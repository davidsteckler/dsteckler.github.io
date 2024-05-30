document.addEventListener("DOMContentLoaded", () => {
    const ball = document.getElementById('ball');
    const gameArea = document.getElementById('gameArea');
    const scoreBoard = document.getElementById('scoreBoard');
    const timerDisplay = document.getElementById('timer');
    let score = 0;
    let timeLeft = 30; // Game time in seconds
    let timerInterval;

    // Function to move the ball to a random position and set random size and speed
    function moveBall() {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const maxX = gameAreaRect.width - ball.offsetWidth;
        const maxY = gameAreaRect.height - ball.offsetHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        ball.style.left = `${randomX}px`;
        ball.style.top = `${randomY}px`;

        const randomSize = Math.floor(Math.random() * 30) + 20; // Random size between 20px and 50px
        ball.style.width = `${randomSize}px`;
        ball.style.height = `${randomSize}px`;

        const randomSpeed = Math.floor(Math.random() * 500) + 200; // Random speed between 200ms and 700ms
        setTimeout(moveBall, randomSpeed);
    }

    // Function to update the score
    function updateScore() {
        score += 1;
        scoreBoard.textContent = `Score: ${score}`;
    }

    // Function to update the timer
    function updateTimer() {
        timeLeft -= 1;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`Game over! Your score is ${score}`);
        }
    }

    // Start the game
    function startGame() {
        moveBall();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Add event listener to the ball
    ball.addEventListener('click', updateScore);

    // Initial ball position
    moveBall();
    startGame();
});
