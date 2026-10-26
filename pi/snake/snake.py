import pygame
from random import randint
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Pi Python Lab")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 30)
snake = [(160, 160), (140, 160), (120, 160)]
direction = (20, 0)
food = (400, 300)
over = False
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
    keys = pygame.key.get_pressed()
    if not over:
        new_direction = direction
        if keys[pygame.K_UP]: new_direction = (0, -20)
        elif keys[pygame.K_DOWN]: new_direction = (0, 20)
        elif keys[pygame.K_LEFT]: new_direction = (-20, 0)
        elif keys[pygame.K_RIGHT]: new_direction = (20, 0)
        if new_direction != (-direction[0], -direction[1]):
            direction = new_direction
        head = (snake[0][0] + direction[0], snake[0][1] + direction[1])
        growing = head == food
        body = snake if growing else snake[:-1]
        over = not (0 <= head[0] < 640 and 0 <= head[1] < 480) or head in body
        if not over:
            snake.insert(0, head)
            if growing:
                empty = [(x, y) for x in range(0, 640, 20) for y in range(0, 480, 20) if (x, y) not in snake]
                if empty:
                    food = empty[randint(0, len(empty) - 1)]
                else:
                    over = True
            else:
                snake.pop()
    screen.fill((20, 37, 42))
    for x, y in snake:
        pygame.draw.rect(screen, (214, 237, 147), (x, y, 18, 18))
    pygame.draw.rect(screen, (255, 170, 110), (*food, 18, 18))
    label = "Game over - Escape to quit" if over else f"Score: {len(snake) - 3}"
    screen.blit(font.render(label, True, "white"), (15, 10))
    pygame.display.flip()
    clock.tick(10)
pygame.quit()
