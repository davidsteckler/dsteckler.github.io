import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class AudioServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        cls.base = 'http://127.0.0.1:' + str(cls.httpd.server_port)
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()
        cls.old_key = server.ACCESS_KEY
        server.ACCESS_KEY = 'test-only-key'

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        server.ACCESS_KEY = cls.old_key

    def tearDown(self):
        with server.LOCK:
            for job in server.JOBS.values():
                shutil.rmtree(job['folder'], ignore_errors=True)
            server.JOBS.clear()

    def request(self, path, data=None, key='test-only-key', extra=None):
        headers = {'X-Converter-Key': key, 'Content-Type': 'application/json'}
        headers.update(extra or {})
        req = Request(self.base + path, headers=headers,
                      data=json.dumps(data).encode() if data is not None else None)
        try:
            with urlopen(req, timeout=5) as response:
                return response.status, response.read(), response.headers
        except HTTPError as response:
            return response.code, response.read(), response.headers

    def test_video_links_and_host_restrictions(self):
        for url in ('https://youtu.be/abcdefghijk?t=12', 'https://www.youtube.com/watch?v=abcdefghijk&list=abc',
                    'https://youtube.com/shorts/abcdefghijk', 'https://music.youtube.com/watch?v=abcdefghijk'):
            self.assertEqual(server.video_id(url), 'abcdefghijk')
        for url in ('https://youtube.com.evil.example/watch?v=abcdefghijk', 'http://127.0.0.1/watch?v=abcdefghijk',
                    'https://youtube.com@evil.example/watch?v=abcdefghijk', 'file:///etc/passwd',
                    'https://youtube.com:443/watch?v=abcdefghijk', 'https://youtube.com/playlist?list=abcdefghijk',
                    'https://youtube.com/watch?v=bad', None):
            with self.assertRaises(ValueError):
                server.video_id(url)

    def test_auth_and_invalid_payload(self):
        self.assertEqual(self.request('/api/jobs', {'url': 'https://youtu.be/abcdefghijk'}, key='wrong')[0], 401)
        self.assertEqual(self.request('/api/jobs', {'url': 'https://127.0.0.1/private'})[0], 400)
        self.assertEqual(self.request('/api/jobs', {'url': 'https://youtu.be/abcdefghijk', 'quality': 999})[0], 400)
        self.assertEqual(self.request('/api/jobs', [1, 2])[0], 400)

    def test_cors(self):
        _, _, headers = self.request('/api/jobs/not-found', extra={'Origin': 'https://dsteckler.com'})
        self.assertEqual(headers.get('Access-Control-Allow-Origin'), 'https://dsteckler.com')
        _, _, headers = self.request('/api/jobs/not-found', extra={'Origin': 'https://other.example'})
        self.assertIsNone(headers.get('Access-Control-Allow-Origin'))

    @unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'FFmpeg required')
    def test_real_mp3_conversion_and_authenticated_download(self):
        real_run = server.run

        def fake_youtube(command, timeout):
            if '-m' in command and 'yt_dlp' in command:
                if '--dump-single-json' in command:
                    return json.dumps({'title': 'Permitted fixture', 'duration': 1})
                output = command[command.index('-o') + 1].replace('%(ext)s', 'wav')
                subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi',
                                '-i', 'sine=frequency=440:duration=1', output], check=True)
                return ''
            return real_run(command, timeout)

        with patch.object(server, 'run', side_effect=fake_youtube):
            status, body, _ = self.request('/api/jobs', {'url': 'https://youtu.be/abcdefghijk', 'quality': 192})
            self.assertEqual(status, 202)
            ident = json.loads(body)['id']
            deadline = time.time() + 10
            while time.time() < deadline:
                status, body, _ = self.request('/api/jobs/' + ident)
                job = json.loads(body)
                if job['state'] in ('ready', 'error'):
                    break
                time.sleep(.05)
            self.assertEqual(job['state'], 'ready', job)
            self.assertEqual(self.request('/api/jobs/' + ident + '/download?token=wrong', key='')[0], 404)
            status, audio, headers = self.request(job['download'], key='')
            self.assertEqual(status, 200)
            self.assertEqual(headers.get('Content-Type'), 'audio/mpeg')
            self.assertIn('attachment', headers.get('Content-Disposition'))
            self.assertGreater(len(audio), 1000)
            self.assertNotIn('folder', job)
            self.assertNotIn('url', job)
            with tempfile.TemporaryDirectory() as folder:
                mp3 = Path(folder) / 'download.mp3'
                mp3.write_bytes(audio)
                probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'quiet', '-show_streams', '-of', 'json', str(mp3)]))
                self.assertEqual(probe['streams'][0]['codec_name'], 'mp3')
                self.assertEqual(int(probe['streams'][0]['bit_rate']), 192000)
            with server.LOCK:
                server.JOBS[ident]['expires'] = time.time() - 1
            self.assertEqual(self.request(job['download'], key='')[0], 404)

    def test_conversion_failure_releases_capacity(self):
        ident = 'a' * 32
        folder = tempfile.mkdtemp()
        server.SLOTS.acquire()
        with server.LOCK:
            server.JOBS[ident] = {'url': 'https://youtu.be/abcdefghijk', 'quality': 192,
                                  'folder': folder, 'expires': float('inf')}
        with patch.object(server, 'run', side_effect=ValueError('Unavailable video')):
            server.convert(ident)
        self.assertEqual(server.JOBS[ident]['state'], 'error')
        self.assertEqual(server.JOBS[ident]['error'], 'Unavailable video')
        self.assertFalse(Path(folder).exists())
        self.assertTrue(server.SLOTS.acquire(blocking=False))
        self.assertTrue(server.SLOTS.acquire(blocking=False))
        server.SLOTS.release()
        server.SLOTS.release()

    def test_duration_limit_prevents_download(self):
        ident = 'b' * 32
        folder = tempfile.mkdtemp()
        server.SLOTS.acquire()
        with server.LOCK:
            server.JOBS[ident] = {'url': 'https://youtu.be/abcdefghijk', 'quality': 192,
                                  'folder': folder, 'expires': float('inf')}
        with patch.object(server, 'run', return_value=json.dumps({'duration': 7201})) as command:
            server.convert(ident)
        self.assertEqual(command.call_count, 1)
        self.assertEqual(server.JOBS[ident]['state'], 'error')


if __name__ == '__main__':
    unittest.main()
