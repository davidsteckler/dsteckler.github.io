from gpiozero import RGBLED
with RGBLED(red=17, green=27, blue=22) as light:
    while True:
        text = input("Red green blue (0-100), or q: ")
        if text.lower() == "q":
            break
        try:
            values = [int(part) for part in text.split()]
            if len(values) != 3 or any(v < 0 or v > 100 for v in values):
                raise ValueError
            light.color = tuple(v / 100 for v in values)
        except ValueError:
            print("Enter three whole numbers from 0 to 100.")
