from random import randint
secret = randint(1, 20)
attempts = 0
while True:
    text = input("Guess 1 to 20: ")
    if not text.isdigit():
        print("Use a whole number.")
        continue
    guess = int(text)
    attempts += 1
    if guess == secret:
        print(f"Found it in {attempts} guesses!")
        break
    print("Too low" if guess < secret else "Too high")
