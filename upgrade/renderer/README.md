# Upgrade films

Ten original 16-second films. The webpage plays H.264/AAC video; it does not draw
the scenes in the browser. Each film plays once and keeps its ending until Replay.

`render.py` builds the geometry, material shaders, particle movement, cameras,
typography and score. It renders full-HD frames through an EGL context and pipes
them to ffmpeg, which encodes and muxes the picture and generated stereo audio.
Random seeds and frame times are fixed. Posters come from the same rendered films.

On Linux, install ffmpeg, Mesa EGL, the URW base-35 fonts, and the Python packages:

```
python3 -m pip install -r requirements.txt
python3 render.py --all
```

Existing movies with posters are skipped. `--force` regenerates them. Use
`--film constructive --stills` to inspect four points in one scene. `--all --stills`
generates contact sheets for all ten. Contact sheets and WAV intermediates are
not deployed. `manifest.json` records the verified size, codec and timing of the
published movies. Rendering needs no interactive window or browser.
