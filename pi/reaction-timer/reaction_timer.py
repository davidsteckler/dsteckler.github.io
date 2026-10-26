from gpiozero import LED, Button
from time import monotonic, sleep
from random import uniform
with LED(17) as light, Button(2, bounce_time=0.02) as button:
    for round_number in range(3):
        input("Release button, then Enter to start: ")
        early = [button.is_pressed]
        def false_start():
            early[0] = True
        button.when_pressed = false_start
        sleep(uniform(2, 5))
        button.when_pressed = None
        if early[0] or button.is_pressed:
            print("False start. Round skipped.")
            continue
        light.on()
        start = monotonic()
        button.wait_for_press(timeout=5)
        elapsed = monotonic() - start
        light.off()
        print(f"{elapsed:.3f} seconds" if elapsed < 5 else "Timed out")
        button.wait_for_release()
