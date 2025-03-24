export function createGameOverDisplay(scoreDisplay) {
    // Create game over display
    const gameOverElement = document.createElement('div');
    gameOverElement.style.position = 'absolute';
    gameOverElement.style.top = '50%';
    gameOverElement.style.left = '50%';
    gameOverElement.style.transform = 'translate(-50%, -50%)';
    gameOverElement.style.color = '#FF3333';
    gameOverElement.style.fontSize = '48px';
    gameOverElement.style.fontFamily = '"Orbitron", sans-serif';
    gameOverElement.style.textShadow = '0 0 20px rgba(255, 51, 51, 0.8)';
    gameOverElement.style.padding = '30px 50px';
    gameOverElement.style.border = '4px solid #FF3333';
    gameOverElement.style.borderRadius = '10px';
    gameOverElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverElement.style.letterSpacing = '4px';
    gameOverElement.style.textAlign = 'center';
    gameOverElement.style.zIndex = '1000';
    gameOverElement.style.display = 'none';
    gameOverElement.innerHTML = `
        SHIELDS DEPLETED<br><br>
        <span id="finalScore" style="font-size: 24px">FINAL SCORE: 0</span><br>
        <span id="enemiesDestroyed" style="font-size: 22px; color: #3399FF; text-shadow: 0 0 10px rgba(51, 153, 255, 0.8);">ENEMIES DESTROYED: 0</span><br><br>
        <div id="starRating" style="margin: 15px 0; height: 50px; display: flex; justify-content: center; align-items: center;"></div>
        <span style="font-size: 18px">PRESS R TO RESTART</span>
    `;
    document.body.appendChild(gameOverElement);
    
    // Add Star Wars style CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starGlow {
            0% { filter: drop-shadow(0 0 5px rgba(255, 223, 0, 0.7)); }
            50% { filter: drop-shadow(0 0 15px rgba(255, 223, 0, 0.9)); }
            100% { filter: drop-shadow(0 0 5px rgba(255, 223, 0, 0.7)); }
        }
        
        .rating-star {
            width: 50px;
            height: 50px;
            margin: 0 10px;
            clip-path: polygon(
                50% 0%, 
                61% 35%, 
                98% 35%, 
                68% 57%, 
                79% 91%, 
                50% 70%, 
                21% 91%, 
                32% 57%, 
                2% 35%, 
                39% 35%
            );
            background-color: #FFD700;
            display: inline-block;
            animation: starGlow 1.5s infinite;
        }
        
        .rating-star.empty {
            background-color: #333;
            animation: none;
            opacity: 0.6;
        }
        
        .rating-label {
            color: #FFD700;
            font-size: 36px;
            text-transform: uppercase;
            margin-bottom: 10px;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            letter-spacing: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Event for restart callback
    let restartCallback = null;

    // Function to set restart callback
    function setRestartCallback(callback) {
        restartCallback = callback;
    }

    // Setup restart handler
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyR' && gameOverElement.style.display === 'block') {
            if (restartCallback) {
                restartCallback();
            }
        }
    });

    // Generate star rating based on score
    function generateStarRating(score) {
        const starRatingElement = gameOverElement.querySelector('#starRating');
        starRatingElement.innerHTML = '';
        
        // Add rating label
        const ratingLabel = document.createElement('div');
        ratingLabel.className = 'rating-label';
        
        // Determine number of stars and rating text
        let starCount = 1;
        let ratingText = "REBEL RECRUIT";
        
        if (score >= 2000000) {
            starCount = 3;
            ratingText = "JEDI MASTER";
        } else if (score >= 1000000) {
            starCount = 2;
            ratingText = "REBEL ACE";
        } else if (score == 0) {
            starCount = 0;
            ratingText = "YOU SUCK!";
        }
        
        // Create container for label and stars
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        
        // Add label
        ratingLabel.textContent = ratingText;
        container.appendChild(ratingLabel);
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.style.display = 'flex';
        starsContainer.style.justifyContent = 'center';
        starsContainer.style.marginTop = '10px';
        
        // Add stars
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = i < starCount ? 'rating-star' : 'rating-star empty';
            
            // Add staggered animation for filled stars
            if (i < starCount) {
                star.style.animationDelay = `${i * 0.3}s`;
            }
            
            starsContainer.appendChild(star);
        }
        
        container.appendChild(starsContainer);
        starRatingElement.appendChild(container);
    }

    function show(enemiesDestroyed = 0) {
        gameOverElement.style.display = 'block';
        const score = scoreDisplay.getScore();
        const finalScoreElement = gameOverElement.querySelector('#finalScore');
        finalScoreElement.textContent = `FINAL SCORE: ${score}`;
        
        // Update enemies destroyed counter
        const enemiesDestroyedElement = gameOverElement.querySelector('#enemiesDestroyed');
        enemiesDestroyedElement.textContent = `ENEMIES DESTROYED: ${enemiesDestroyed}`;
        
        // Generate star rating
        generateStarRating(score);
    }

    function hide() {
        gameOverElement.style.display = 'none';
    }

    return {
        show,
        hide,
        setRestartCallback,
        element: gameOverElement
    };
} 