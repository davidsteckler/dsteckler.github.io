import pygame
from random import randint
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Pi Python Lab")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 30)
x, y = 100, 100
vx, vy = 4, 3
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
    keys = pygame.key.get_pressed()
    x += vx
    y += vy
    if x <= 15 or x >= 625:
        vx = -vx
    if y <= 15 or y >= 465:
        vy = -vy
    screen.fill((20, 37, 42))
    pygame.draw.circle(screen, (214, 237, 147), (x, y), 15)
    pygame.display.flip()
    clock.tick(60)
pygame.quit()
