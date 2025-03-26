export function createInstructionsDisplay() {
    const instructionsElement = document.createElement('div');
    
    // Style the instructions display
    instructionsElement.style.position = 'absolute';
    instructionsElement.style.bottom = '20px';
    instructionsElement.style.left = '20px';
    instructionsElement.style.color = '#00BFFF'; // Neon blue
    instructionsElement.style.fontSize = '18px';
    instructionsElement.style.fontFamily = '"Orbitron", sans-serif';
    instructionsElement.style.textShadow = '0 0 10px rgba(0, 191, 255, 0.5)';
    instructionsElement.style.padding = '15px 25px';
    instructionsElement.style.border = '2px solid #00BFFF';
    instructionsElement.style.borderRadius = '5px';
    instructionsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructionsElement.style.letterSpacing = '1px';
    instructionsElement.style.lineHeight = '1.5';
    
    // Add instructions text
    instructionsElement.innerHTML = `
        ARROWS - Move Ship<br>
        SPACE - Fire Lasers<br>
        <div id="sound-toggle" style="margin-top: 10px; cursor: pointer;">
            SOUND: ON 🔊
        </div>
    `;
    
    document.body.appendChild(instructionsElement);
    
    // Create a reference to the sound toggle button
    const soundToggle = instructionsElement.querySelector('#sound-toggle');
    let soundEnabled = true;
    
    // Function to update the sound toggle display
    function updateSoundToggleDisplay() {
        soundToggle.textContent = soundEnabled ? 'SOUND: ON 🔊' : 'SOUND: OFF 🔇';
    }
    
    // Function to toggle sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        updateSoundToggleDisplay();
        return soundEnabled;
    }
    
    return {
        element: instructionsElement,
        soundToggle,
        toggleSound
    };
} 