from gpiozero import MotionSensor
from datetime import datetime
from pathlib import Path
from time import sleep
import csv
path = Path.home() / "motion-events.csv"
with MotionSensor(4) as sensor:
    print("Warming up for 60 seconds")
    sleep(60)
    print("Logging five motion events")
    for event in range(5):
        sensor.wait_for_motion()
        stamp = datetime.now().isoformat(timespec="seconds")
        with path.open("a", newline="") as file:
            csv.writer(file).writerow([stamp, "motion"])
        print(stamp, "motion")
        sensor.wait_for_no_motion()
print("Saved:", path)
