import pygame
from random import randint
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Pi Python Lab")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 30)
left = pygame.Rect(20, 180, 14, 100)
right = pygame.Rect(606, 180, 14, 100)
ball = pygame.Rect(310, 230, 16, 16)
vx, vy = 4, 3
scores = [0, 0]
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
    keys = pygame.key.get_pressed()
    left.y += (keys[pygame.K_s] - keys[pygame.K_w]) * 5
    right.y += (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * 5
    left.clamp_ip(screen.get_rect())
    right.clamp_ip(screen.get_rect())
    ball.move_ip(vx, vy)
    if ball.top <= 0 or ball.bottom >= 480:
        vy = -vy
    if vx < 0 and ball.colliderect(left):
        ball.left = left.right
        vx = abs(vx)
    if vx > 0 and ball.colliderect(right):
        ball.right = right.left
        vx = -abs(vx)
    if ball.right < 0 or ball.left > 640:
        scores[1 if ball.right < 0 else 0] += 1
        ball.center = (320, 240)
        vx = -vx
    screen.fill((20, 37, 42))
    for paddle in (left, right):
        pygame.draw.rect(screen, (214, 237, 147), paddle)
    pygame.draw.ellipse(screen, "white", ball)
    screen.blit(font.render(f"{scores[0]} : {scores[1]}", True, "white"), (290, 20))
    pygame.display.flip()
    clock.tick(60)
pygame.quit()
