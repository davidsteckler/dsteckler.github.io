from pathlib import Path
from gpiozero import Button
from signal import pause
import pygame
pygame.mixer.init()
sound = pygame.mixer.Sound(str(Path(__file__).with_name("chime.wav")))
sound.set_volume(0.4)
try:
    with Button(2, bounce_time=0.1) as button:
        button.when_pressed = sound.play
        print("Press to play. Stop to finish.")
        pause()
finally:
    pygame.quit()
