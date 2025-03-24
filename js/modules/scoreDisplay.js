export function createScoreDisplay() {
    let score = 0;
    const scoreElement = document.createElement('div');
    
    // Style the score display
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '20px';
    scoreElement.style.right = '20px';
    scoreElement.style.color = '#FFE81F'; // Star Wars yellow
    scoreElement.style.fontSize = '24px';
    scoreElement.style.fontFamily = '"Orbitron", sans-serif';
    scoreElement.style.textShadow = '0 0 10px rgba(255, 232, 31, 0.5)';
    scoreElement.style.padding = '10px 20px';
    scoreElement.style.border = '2px solid #FFE81F';
    scoreElement.style.borderRadius = '5px';
    scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    scoreElement.style.letterSpacing = '2px';
    scoreElement.textContent = 'SCORE: 0';
    document.body.appendChild(scoreElement);

    function addScore(points) {
        score += points;
        scoreElement.textContent = `SCORE: ${score}`;
    }

    function getScore() {
        return score;
    }
    
    function reset() {
        score = 0;
        scoreElement.textContent = 'SCORE: 0';
    }

    return {
        addScore,
        getScore,
        reset,
        element: scoreElement
    };
} 