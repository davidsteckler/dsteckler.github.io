from gpiozero import LED
from time import sleep
with LED(17) as light:
    for flash in range(5):
        light.on()
        sleep(0.5)
        light.off()
        sleep(0.5)
print("Five flashes finished")
