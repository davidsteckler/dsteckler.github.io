from picamera2 import Picamera2
from pathlib import Path
from datetime import datetime
from time import sleep
folder = Path.home() / "pi-timelapse" / datetime.now().strftime("%Y%m%d-%H%M%S-%f")
folder.mkdir(parents=True)
camera = Picamera2()
try:
    camera.configure(camera.create_still_configuration(main={"size": (1280, 720)}))
    camera.start()
    sleep(2)
    for number in range(30):
        path = folder / f"frame-{number:04d}.jpg"
        camera.capture_file(str(path))
        print(path.name)
        sleep(2)
finally:
    camera.close()
print("Frames saved in:", folder)
