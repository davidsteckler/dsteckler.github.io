from gpiozero import LightSensor, LED
from time import sleep
with LightSensor(4) as sensor, LED(17) as light:
    for sample in range(200):
        value = sensor.value
        if value < 0.3:
            light.on()
        elif value > 0.5:
            light.off()
        print(round(value, 2), "lamp", light.is_lit)
        sleep(0.2)
