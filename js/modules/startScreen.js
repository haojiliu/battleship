export function createStartScreen() {
    // Main container
    const startScreenContainer = document.createElement('div');
    startScreenContainer.style.position = 'fixed';
    startScreenContainer.style.top = '0';
    startScreenContainer.style.left = '0';
    startScreenContainer.style.width = '100%';
    startScreenContainer.style.height = '100%';
    startScreenContainer.style.backgroundColor = 'black';
    startScreenContainer.style.display = 'flex';
    startScreenContainer.style.flexDirection = 'column';
    startScreenContainer.style.alignItems = 'center';
    startScreenContainer.style.justifyContent = 'center';
    startScreenContainer.style.zIndex = '1000';
    startScreenContainer.style.overflow = 'hidden';
    
    // Starfield background
    const starfield = document.createElement('div');
    starfield.style.position = 'absolute';
    starfield.style.top = '0';
    starfield.style.left = '0';
    starfield.style.width = '100%';
    starfield.style.height = '100%';
    starfield.style.zIndex = '-1';
    startScreenContainer.appendChild(starfield);
    
    // Create stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite`;
        starfield.appendChild(star);
    }
    
    // Logo container
    const logoContainer = document.createElement('div');
    logoContainer.style.marginBottom = '60px';
    logoContainer.style.textAlign = 'center';
    logoContainer.style.transform = 'scale(0)';
    logoContainer.style.transition = 'transform 1.5s ease-out';
    startScreenContainer.appendChild(logoContainer);
    
    // Game title
    const gameTitle = document.createElement('h1');
    gameTitle.textContent = 'STAR FIGHTER';
    gameTitle.style.fontFamily = '"Orbitron", sans-serif';
    gameTitle.style.fontSize = '96px';
    gameTitle.style.color = '#FFE81F'; // Star Wars yellow
    gameTitle.style.textShadow = '0 0 20px rgba(255, 232, 31, 0.8)';
    gameTitle.style.letterSpacing = '10px';
    gameTitle.style.marginBottom = '20px';
    logoContainer.appendChild(gameTitle);
    
    // Subtitle
    const subtitle = document.createElement('h2');
    subtitle.textContent = 'THE BATTLE FOR THE GALAXY';
    subtitle.style.fontFamily = '"Orbitron", sans-serif';
    subtitle.style.fontSize = '24px';
    subtitle.style.color = 'white';
    subtitle.style.letterSpacing = '5px';
    logoContainer.appendChild(subtitle);
    
    // Crawl container
    const crawlContainer = document.createElement('div');
    crawlContainer.style.perspective = '400px';
    crawlContainer.style.width = '80%';
    crawlContainer.style.maxWidth = '800px';
    crawlContainer.style.height = '400px';
    crawlContainer.style.overflow = 'hidden';
    crawlContainer.style.marginBottom = '60px';
    crawlContainer.style.opacity = '0';
    crawlContainer.style.transition = 'opacity 1s ease-in';
    startScreenContainer.appendChild(crawlContainer);
    
    // Text crawl
    const crawl = document.createElement('div');
    crawl.style.fontFamily = '"Orbitron", sans-serif';
    crawl.style.color = '#FFE81F';
    crawl.style.fontSize = '28px';
    crawl.style.lineHeight = '1.6';
    crawl.style.textAlign = 'center';
    crawl.style.transform = 'rotateX(25deg) translateY(100%)';
    crawl.style.position = 'absolute';
    crawl.style.width = '100%';
    crawl.innerHTML = `
        <p>Episode I</p>
        <h2>THE IMPERIAL PURSUIT</h2>
        <p>&nbsp;</p>
        <p>The galaxy is at war. Imperial forces</p>
        <p>have launched a massive attack against</p>
        <p>the last remaining outposts of the Republic.</p>
        <p>&nbsp;</p>
        <p>As the best fighter pilot in the fleet,</p>
        <p>you must defend the galaxy from waves</p>
        <p>of enemy TIE Fighters and restore peace.</p>
        <p>&nbsp;</p>
        <p>Your mission: survive as long as possible</p>
        <p>and destroy as many enemy ships as you can...</p>
    `;
    crawlContainer.appendChild(crawl);
    
    // Start button
    const startButton = document.createElement('button');
    startButton.textContent = 'BEGIN MISSION';
    startButton.style.fontFamily = '"Orbitron", sans-serif';
    startButton.style.fontSize = '24px';
    startButton.style.color = 'black';
    startButton.style.backgroundColor = '#FFE81F';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.padding = '15px 40px';
    startButton.style.marginBottom = '40px';
    startButton.style.cursor = 'pointer';
    startButton.style.letterSpacing = '4px';
    startButton.style.boxShadow = '0 0 20px rgba(255, 232, 31, 0.5)';
    startButton.style.transition = 'all 0.3s ease';
    startButton.style.opacity = '0';
    startButton.style.transform = 'translateY(20px)';
    
    startButton.addEventListener('mouseover', () => {
        startButton.style.backgroundColor = 'white';
        startButton.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
    });
    
    startButton.addEventListener('mouseout', () => {
        startButton.style.backgroundColor = '#FFE81F';
        startButton.style.boxShadow = '0 0 20px rgba(255, 232, 31, 0.5)';
    });
    
    startScreenContainer.appendChild(startButton);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
        }
        
        @keyframes crawl {
            0% { transform: rotateX(25deg) translateY(100%); }
            100% { transform: rotateX(25deg) translateY(-250%); }
        }
    `;
    document.head.appendChild(style);
    
    // Show animations with slight delays
    setTimeout(() => {
        logoContainer.style.transform = 'scale(1)';
    }, 200);
    
    setTimeout(() => {
        crawlContainer.style.opacity = '1';
        crawl.style.animation = 'crawl 15s linear forwards';
    }, 500);
    
    setTimeout(() => {
        startButton.style.opacity = '1';
        startButton.style.transform = 'translateY(0)';
    }, 1000);
    
    // Function to hide start screen
    function hide() {
        startScreenContainer.style.transition = 'opacity 1s ease-out';
        startScreenContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(startScreenContainer);
        }, 1000);
    }
    
    document.body.appendChild(startScreenContainer);
    
    return {
        element: startScreenContainer,
        hide,
        startButton
    };
} 