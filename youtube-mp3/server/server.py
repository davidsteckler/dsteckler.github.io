"""Single-instance YouTube audio service. Run behind an HTTPS reverse proxy."""
import hmac
import importlib.util
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, urlsplit

ACCESS_KEY = os.environ.get('CONVERTER_ACCESS_KEY', '')
ORIGINS = set(os.environ.get('ALLOWED_ORIGINS', 'https://dsteckler.com,https://www.dsteckler.com').split(','))
TTL = 1800
MAX_DURATION = 7200
MAX_JOBS = 20
SLOTS = threading.BoundedSemaphore(2)
LOCK = threading.RLock()
JOBS = {}


def video_id(url):
    if not isinstance(url, str) or len(url) > 2048:
        raise ValueError('Enter a valid YouTube video link.')
    u = urlsplit(url)
    if u.scheme not in ('https', 'http') or u.username or u.password or u.port:
        raise ValueError('Enter a valid YouTube video link.')
    host = (u.hostname or '').lower()
    if host == 'youtu.be':
        value = u.path.lstrip('/').split('/')[0]
    elif host in ('youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'):
        if u.path == '/watch':
            value = parse_qs(u.query).get('v', [''])[0]
        elif re.match(r'^/(shorts|embed|live)/', u.path):
            value = u.path.split('/')[2]
        else:
            value = ''
    else:
        value = ''
    if not re.fullmatch(r'[A-Za-z0-9_-]{11}', value):
        raise ValueError('Enter a YouTube video link, including Shorts or youtu.be links.')
    return value


def run(command, timeout):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, start_new_session=True)
    try:
        out, err = process.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGKILL)
        process.communicate()
        raise ValueError('The video took too long to process. Try a shorter video.')
    if process.returncode:
        lower = err.lower()
        if 'sign in' in lower or 'bot' in lower or '403' in lower:
            raise ValueError('YouTube blocked this server’s download request. Try again later or use a different server host.')
        if 'private video' in lower or 'video unavailable' in lower or 'not available' in lower:
            raise ValueError('This video is unavailable to the audio server.')
        raise ValueError('Could not process this video. Try another public video; the server may need a yt-dlp update.')
    return out


def transcode(source, destination, quality):
    run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
         '-i', str(source), '-vn', '-map', '0:a:0', '-c:a', 'libmp3lame',
         '-b:a', f'{quality}k', str(destination)], 300)


def update(job_id, **fields):
    with LOCK:
        JOBS[job_id].update(fields)


def convert(job_id):
    with LOCK:
        job = dict(JOBS[job_id])
    folder = Path(job['folder'])
    try:
        common = [sys.executable, '-m', 'yt_dlp', '--ignore-config', '--no-playlist',
                  '--no-warnings', '--js-runtimes', 'node', '--socket-timeout', '20',
                  '--retries', '2', '--extractor-retries', '1']
        info = json.loads(run(common + ['--skip-download', '--dump-single-json', job['url']], 90))
        if info.get('is_live') or info.get('live_status') == 'is_upcoming':
            raise ValueError('Use a finished video instead of a live stream.')
        duration = info.get('duration')
        if not duration or duration > MAX_DURATION:
            raise ValueError('Use a finished video up to two hours long.')
        title = str(info.get('title') or 'YouTube audio')[:250]
        update(job_id, title=title, state='downloading', message='Downloading audio…')
        run(common + ['--no-progress', '--max-filesize', '100M', '-f', 'bestaudio/best',
                      '-o', str(folder / 'source.%(ext)s'), job['url']], 600)
        sources = [p for p in folder.glob('source.*') if p.suffix not in ('.part', '.ytdl')]
        if len(sources) != 1:
            raise ValueError('The source audio is unavailable or exceeds the 100 MB download limit.')
        update(job_id, state='converting', message='Encoding the MP3…')
        output = folder / 'audio.mp3'
        transcode(sources[0], output, job['quality'])
        sources[0].unlink(missing_ok=True)
        filename = re.sub(r'[^\w .()-]', '', title, flags=re.UNICODE).strip(' .')[:120] or 'YouTube audio'
        update(job_id, state='ready', message='Your MP3 is ready.', size=output.stat().st_size,
               filename=filename + '.mp3', expires=time.time() + TTL)
    except Exception as exc:
        message = str(exc) if isinstance(exc, ValueError) else 'The audio server could not complete this conversion.'
        shutil.rmtree(folder, ignore_errors=True)
        update(job_id, state='error', error=message, expires=time.time() + TTL)
    finally:
        SLOTS.release()


def cleanup():
    while True:
        time.sleep(60)
        with LOCK:
            expired = [job_id for job_id, job in JOBS.items() if job['expires'] <= time.time()]
            for job_id in expired:
                shutil.rmtree(JOBS.pop(job_id)['folder'], ignore_errors=True)


class Handler(BaseHTTPRequestHandler):
    server_version = 'AudioConverter/1'

    def log_message(self, *_):
        # Download URLs contain short-lived bearer tokens; do not write URLs to logs.
        pass

    def cors(self):
        origin = self.headers.get('Origin', '')
        if origin in ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Vary', 'Origin')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')

    def reply(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.cors()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def authorized(self):
        if not ACCESS_KEY:
            self.reply(503, {'error': 'Set the audio server’s CONVERTER_ACCESS_KEY before connecting.'})
            return False
        if not hmac.compare_digest(self.headers.get('X-Converter-Key', ''), ACCESS_KEY):
            self.reply(401, {'error': 'The access key is incorrect. Check Converter connection.'})
            return False
        return True

    def do_OPTIONS(self):
        if self.headers.get('Origin') not in ORIGINS:
            self.reply(403, {'error': 'Origin is not allowed.'})
            return
        self.send_response(204)
        self.cors()
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Converter-Key')
        self.end_headers()

    def do_GET(self):
        u = urlsplit(self.path)
        if u.path == '/health':
            ready = bool(ACCESS_KEY and shutil.which('ffmpeg') and shutil.which('node')
                         and importlib.util.find_spec('yt_dlp'))
            self.reply(200 if ready else 503, {'ready': ready})
            return
        download = re.fullmatch(r'/api/jobs/([a-f0-9]{32})/download', u.path)
        if download:
            with LOCK:
                job = dict(JOBS.get(download[1], {}))
            token = parse_qs(u.query).get('token', [''])[0]
            if not job or job.get('state') != 'ready' or job['expires'] <= time.time() or not hmac.compare_digest(token, job['token']):
                self.reply(404, {'error': 'This download has expired. Convert the video again.'})
                return
            try:
                with open(Path(job['folder']) / 'audio.mp3', 'rb') as audio:
                    self.send_response(200)
                    self.cors()
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(job['size']))
                    self.send_header('Content-Disposition', "attachment; filename=audio.mp3; filename*=UTF-8''" + quote(job['filename']))
                    self.end_headers()
                    shutil.copyfileobj(audio, self.wfile, length=65536)
            except (FileNotFoundError, BrokenPipeError, ConnectionResetError):
                pass
            return
        if not self.authorized():
            return
        if u.path == '/api/connection':
            if not (shutil.which('ffmpeg') and shutil.which('node') and importlib.util.find_spec('yt_dlp')):
                self.reply(503, {'error': 'Install FFmpeg, Node.js, and yt-dlp on the audio server.'})
            else:
                self.reply(200, {'ready': True})
            return
        match = re.fullmatch(r'/api/jobs/([a-f0-9]{32})', u.path)
        with LOCK:
            job = dict(JOBS.get(match[1], {})) if match else {}
        if not job or job['expires'] <= time.time():
            self.reply(404, {'error': 'This conversion has expired. Please convert the video again.'})
            return
        public = {k: v for k, v in job.items() if k in ('state', 'title', 'quality', 'message', 'error', 'size', 'filename')}
        if job['state'] == 'ready':
            public['download'] = f"/api/jobs/{match[1]}/download?token={job['token']}"
        self.reply(200, public)

    def do_POST(self):
        if not self.authorized():
            return
        if self.path != '/api/jobs':
            self.reply(404, {'error': 'Unknown endpoint.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length <= 0 or length > 4096:
                raise ValueError('Invalid request size.')
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError('Invalid request.')
            ident = video_id(data.get('url'))
            quality = data.get('quality', 192)
            if quality not in (128, 192, 320):
                raise ValueError('Choose 128, 192, or 320 kbps.')
        except (ValueError, TypeError):
            self.reply(400, {'error': 'Enter a valid YouTube video link and MP3 quality.'})
            return
        with LOCK:
            if len(JOBS) >= MAX_JOBS or not SLOTS.acquire(blocking=False):
                self.reply(429, {'error': 'The audio server is busy. Please try again shortly.'})
                return
            job_id = secrets.token_hex(16)
            JOBS[job_id] = {'state': 'reading', 'message': 'Reading video information…',
                            'quality': quality, 'url': 'https://www.youtube.com/watch?v=' + ident,
                            'folder': tempfile.mkdtemp(prefix='mp3-'), 'token': secrets.token_urlsafe(32),
                            'expires': float('inf')}
        threading.Thread(target=convert, args=(job_id,), daemon=True).start()
        self.reply(202, {'id': job_id})


if __name__ == '__main__':
    threading.Thread(target=cleanup, daemon=True).start()
    httpd = ThreadingHTTPServer(('0.0.0.0', int(os.environ.get('PORT', '8080'))), Handler)
    httpd.serve_forever()
