from gpiozero import LED
from time import sleep
with LED(17) as red, LED(27) as amber, LED(22) as green:
    for cycle in range(3):
        green.on()
        sleep(3)
        green.off()
        amber.on()
        sleep(1)
        amber.off()
        red.on()
        sleep(3)
        red.off()
print("Sequence finished")
