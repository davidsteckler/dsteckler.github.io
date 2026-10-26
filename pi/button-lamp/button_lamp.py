from gpiozero import LED, Button
from signal import pause
with LED(17) as light, Button(2, bounce_time=0.05) as button:
    button.when_pressed = light.on
    button.when_released = light.off
    print("Hold the button to light the LED. Stop to finish.")
    pause()
