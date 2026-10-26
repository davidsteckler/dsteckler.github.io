from gpiozero import LED
from time import sleep
symbols = {"S": "...", "O": "---"}
unit = 0.2
with LED(17) as light:
    def flash(duration):
        light.on()
        sleep(duration)
        light.off()
        sleep(unit)
    message = input("Use S and O: ").upper()
    for letter in message:
        if letter not in symbols:
            print("Skipped:", letter)
            continue
        for symbol in symbols[letter]:
            flash(unit if symbol == "." else unit * 3)
        sleep(unit * 2)
print("Message complete")
