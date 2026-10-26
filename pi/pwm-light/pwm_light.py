from gpiozero import PWMLED
from time import sleep
with PWMLED(17) as light:
    for cycle in range(3):
        for step in range(101):
            light.value = step / 100
            sleep(0.01)
        for step in range(100, -1, -1):
            light.value = step / 100
            sleep(0.01)
print("Fade finished")
