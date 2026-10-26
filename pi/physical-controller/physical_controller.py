from gpiozero import Button
import pygame
pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()
player = pygame.Rect(300, 400, 40, 40)
try:
    with Button(2, bounce_time=0.02) as left, Button(3, bounce_time=0.02) as right:
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    running = False
            player.x += (int(right.is_pressed) - int(left.is_pressed)) * 5
            player.clamp_ip(screen.get_rect())
            screen.fill((20, 37, 42))
            pygame.draw.rect(screen, (214, 237, 147), player)
            pygame.display.flip()
            clock.tick(60)
finally:
    pygame.quit()
