from gpiozero import Robot
from time import sleep
with Robot(left=(17, 18), right=(22, 23)) as buggy:
    def move(action, speed, seconds):
        action(speed)
        sleep(seconds)
        buggy.stop()
        sleep(0.5)
    input("Clear the route, then Enter: ")
    for side in range(4):
        move(buggy.forward, 0.3, 1)
        move(buggy.right, 0.3, 0.5)
print("Route complete")
