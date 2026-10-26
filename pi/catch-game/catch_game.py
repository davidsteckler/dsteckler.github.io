import pygame
from random import randint
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Pi Python Lab")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 30)
basket = pygame.Rect(280, 430, 90, 20)
drop = pygame.Rect(randint(0, 620), 0, 20, 20)
score, misses = 0, 0
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
    keys = pygame.key.get_pressed()
    basket.x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 6
    basket.clamp_ip(screen.get_rect())
    drop.y += 4
    if drop.colliderect(basket):
        score += 1
        drop.topleft = (randint(0, 620), 0)
    elif drop.top > 480:
        misses += 1
        drop.topleft = (randint(0, 620), 0)
    screen.fill((20, 37, 42))
    pygame.draw.rect(screen, (214, 237, 147), basket)
    pygame.draw.rect(screen, (255, 170, 110), drop)
    screen.blit(font.render(f"Caught {score}   Missed {misses}", True, "white"), (20, 20))
    pygame.display.flip()
    clock.tick(60)
pygame.quit()
