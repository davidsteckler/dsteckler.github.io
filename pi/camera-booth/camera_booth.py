from picamera2 import Picamera2
from pathlib import Path
from datetime import datetime
from time import sleep
folder = Path.home() / "pi-photos"
folder.mkdir(exist_ok=True)
camera = Picamera2()
try:
    camera.configure(camera.create_still_configuration())
    camera.start()
    sleep(2)
    while input("Enter to take photo, q to quit: ").lower() != "q":
        for count in (3, 2, 1):
            print(count)
            sleep(1)
        name = datetime.now().strftime("photo-%Y%m%d-%H%M%S-%f.jpg")
        camera.capture_file(str(folder / name))
        print("Saved:", name)
finally:
    camera.close()
