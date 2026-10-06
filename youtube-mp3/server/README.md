# Audio server

The front end lives at https://dsteckler.com/youtube-mp3/. GitHub Pages cannot execute this Python/FFmpeg service. Deploy the server separately; the existing site keeps its hosting.

## Render deployment

The repository root contains `render.yaml`. In Render, create a Blueprint from `davidsteckler/dsteckler.github.io`. The service uses the free plan, a Docker image, and a generated `CONVERTER_ACCESS_KEY`. Review the plan in the host dashboard before creating the service.

After the service is running, copy its HTTPS URL and its generated access key from the service's environment settings. Open the page's **Converter connection**, enter both, and connect. The address is remembered locally; the key is stored in sessionStorage and is never committed to GitHub. To set the default server for all visitors, update `youtube-mp3/config.json` with the service URL. Do not put the access key in that file.

The service requires one instance and one process because job state is held in memory. Two conversions can run at a time. Files expire 30 minutes after conversion. Restarting the service removes access to existing jobs. Free hosts can sleep, and YouTube may reject downloads from a host's data-center IP. Live extraction must be checked on the chosen host; no working live YouTube conversion is claimed before that check.

## Any Docker host

From this directory:

```sh
docker build -t steckler-audio .
docker run --rm --env CONVERTER_ACCESS_KEY --env ALLOWED_ORIGINS -p 8080:8080 steckler-audio
```

Set `CONVERTER_ACCESS_KEY` to a long random secret in the host environment. `ALLOWED_ORIGINS` defaults to `https://dsteckler.com,https://www.dsteckler.com`. Add a local origin for local development when needed. Terminate TLS at the hosting provider or reverse proxy.

## Validation

```sh
python -m unittest test_server.py
```

Tests cover YouTube URL validation, API authorization, job completion/error responses, download expiry and tokens, and real FFmpeg MP3 encoding. The job integration test mocks YouTube network calls and verifies the resulting download; it does not verify current YouTube extraction. Test a permitted public YouTube video on the deployed host before calling the converter operational.

Rebuild the Docker image to update yt-dlp and its JavaScript challenge components. The image includes Node.js for current YouTube extraction support and FFmpeg for MP3 encoding. It uses no account cookies, sign-in, or private video access.
