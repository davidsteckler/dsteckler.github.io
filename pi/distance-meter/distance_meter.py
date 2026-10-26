from gpiozero import DistanceSensor
from time import sleep
with DistanceSensor(echo=24, trigger=23, max_distance=2) as sensor:
    for sample in range(60):
        cm = sensor.distance * 100
        state = "NEAR" if cm < 20 else "CLEAR"
        print(f"{cm:5.1f} cm | {state}")
        sleep(0.3)
