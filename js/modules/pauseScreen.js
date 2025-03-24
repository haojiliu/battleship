// Pause Screen module - provides functionality to pause the game
export function createPauseScreen() {
    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    overlay.style.display = 'none'; // Hidden by default
    overlay.style.zIndex = '1000';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    
    // Create the pause text with Star Wars style
    const pauseText = document.createElement('div');
    pauseText.textContent = 'PAUSED';
    pauseText.style.color = '#FFE81F'; // Star Wars yellow
    pauseText.style.fontFamily = "'Arial', sans-serif";
    pauseText.style.fontSize = '4rem';
    pauseText.style.fontWeight = 'bold';
    pauseText.style.textShadow = '0 0 10px rgba(255, 232, 31, 0.8)';
    pauseText.style.letterSpacing = '0.2em';
    pauseText.style.marginBottom = '2rem';
    
    // Create the continue text
    const continueText = document.createElement('div');
    continueText.textContent = 'Click anywhere or press P to continue';
    continueText.style.color = '#fff';
    continueText.style.fontFamily = "'Arial', sans-serif";
    continueText.style.fontSize = '1.5rem';
    continueText.style.marginTop = '1rem';
    
    // Add elements to the overlay
    overlay.appendChild(pauseText);
    overlay.appendChild(continueText);
    document.body.appendChild(overlay);
    
    // Create the pause button
    const pauseButton = document.createElement('div');
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    pauseButton.style.position = 'absolute';
    pauseButton.style.bottom = '2rem';
    pauseButton.style.right = '2rem';
    pauseButton.style.width = '4rem';
    pauseButton.style.height = '4rem';
    pauseButton.style.borderRadius = '50%';
    pauseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    pauseButton.style.border = '2px solid #FFE81F'; // Star Wars yellow
    pauseButton.style.color = '#FFE81F';
    pauseButton.style.display = 'flex';
    pauseButton.style.justifyContent = 'center';
    pauseButton.style.alignItems = 'center';
    pauseButton.style.fontSize = '1.8rem';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.zIndex = '999';
    pauseButton.style.boxShadow = '0 0 10px rgba(255, 232, 31, 0.5)';
    pauseButton.style.transition = 'all 0.2s ease';
    
    // Load Font Awesome for the pause icon
    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);
    
    // Add hover effect
    pauseButton.addEventListener('mouseenter', () => {
        pauseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        pauseButton.style.boxShadow = '0 0 15px rgba(255, 232, 31, 0.8)';
    });
    
    pauseButton.addEventListener('mouseleave', () => {
        pauseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        pauseButton.style.boxShadow = '0 0 10px rgba(255, 232, 31, 0.5)';
    });
    
    document.body.appendChild(pauseButton);
    
    // State management
    let paused = false;
    let pauseCallback = null;
    let resumeCallback = null;
    let initialized = false;
    
    // Show the overlay
    function show() {
        overlay.style.display = 'flex';
        pauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
        paused = true;
        
        if (pauseCallback) {
            pauseCallback();
        }
    }
    
    // Hide the overlay
    function hide() {
        overlay.style.display = 'none';
        pauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change back to pause icon
        paused = false;
        
        if (resumeCallback) {
            resumeCallback();
        }
    }
    
    // Toggle pause state
    function togglePause() {
        if (paused) {
            hide();
        } else {
            show();
        }
    }
    
    // Setup event listeners
    function initialize() {
        if (initialized) return;
        
        // Pause button click handler
        pauseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePause();
        });
        
        // Click anywhere on overlay to unpause
        overlay.addEventListener('click', () => {
            if (paused) {
                hide();
            }
        });
        
        // Handle P key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                togglePause();
            }
            
            // Handle ESC key
            if (e.key === 'Escape') {
                if (paused) {
                    hide();
                } else {
                    show();
                }
            }
        });
        
        initialized = true;
    }
    
    return {
        show,
        hide,
        togglePause,
        initialize,
        setPauseCallback: (callback) => {
            pauseCallback = callback;
        },
        setResumeCallback: (callback) => {
            resumeCallback = callback;
        },
        isPaused: () => paused,
        pauseButton, // Export so it can be hidden when needed
        overlay // Export so it can be customized if needed
    };
} 