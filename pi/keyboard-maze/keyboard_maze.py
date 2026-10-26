import pygame
from random import randint
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Pi Python Lab")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 30)
player = pygame.Rect(25, 25, 24, 24)
walls = [pygame.Rect(120, 0, 20, 310), pygame.Rect(260, 170, 20, 310), pygame.Rect(400, 0, 20, 310)]
goal = pygame.Rect(570, 410, 45, 45)
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
    keys = pygame.key.get_pressed()
    dx = (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 3
    dy = (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * 3
    player.x += dx
    if any(player.colliderect(wall) for wall in walls):
        player.x -= dx
    player.y += dy
    if any(player.colliderect(wall) for wall in walls):
        player.y -= dy
    player.clamp_ip(screen.get_rect())
    screen.fill((20, 37, 42))
    for wall in walls:
        pygame.draw.rect(screen, (90, 140, 145), wall)
    pygame.draw.rect(screen, (214, 237, 147), goal)
    pygame.draw.rect(screen, (255, 170, 110), player)
    if player.colliderect(goal):
        screen.blit(font.render("Escaped!", True, "white"), (450, 20))
    pygame.display.flip()
    clock.tick(60)
pygame.quit()
