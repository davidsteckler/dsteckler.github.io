document.addEventListener("DOMContentLoaded", () => {
    const ball = document.getElementById('ball');
    const gameArea = document.getElementById('gameArea');
    let score = 0;

    // Function to move the ball to a random position
    function moveBall() {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const maxX = gameAreaRect.width - ball.offsetWidth;
        const maxY = gameAreaRect.height - ball.offsetHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        ball.style.left = `${randomX}px`;
        ball.style.top = `${randomY}px`;
    }

    // Function to update the score
    function updateScore() {
        score += 1;
        alert(`Score: ${score}`);
        moveBall();
    }

    // Add event listener to the ball
    ball.addEventListener('click', updateScore);

    // Initial ball position
    moveBall();
});
