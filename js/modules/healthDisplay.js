export function createHealthDisplay() {
    let health = 1000;
    const maxHealth = 1000;
    const healthElement = document.createElement('div');
    
    // Style the health display
    healthElement.style.position = 'absolute';
    healthElement.style.top = '20px';
    healthElement.style.left = '20px';
    healthElement.style.color = '#33FF33'; // Green for health
    healthElement.style.fontSize = '24px';
    healthElement.style.fontFamily = '"Orbitron", sans-serif';
    healthElement.style.textShadow = '0 0 10px rgba(51, 255, 51, 0.7)';
    healthElement.style.padding = '10px 20px';
    healthElement.style.border = '2px solid #33FF33';
    healthElement.style.borderRadius = '5px';
    healthElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    healthElement.style.letterSpacing = '2px';
    healthElement.style.minWidth = '200px'; // Ensure minimum width
    
    // Create health bar
    const healthBarContainer = document.createElement('div');
    healthBarContainer.style.width = '100%';
    healthBarContainer.style.height = '10px';
    healthBarContainer.style.backgroundColor = 'rgba(51, 255, 51, 0.2)';
    healthBarContainer.style.borderRadius = '5px';
    healthBarContainer.style.marginTop = '5px';
    healthBarContainer.style.overflow = 'hidden'; // Ensure bar stays within container
    healthBarContainer.style.position = 'relative'; // For absolute positioning of child
    healthBarContainer.style.boxShadow = '0 0 8px rgba(51, 255, 51, 0.4)';
    
    const healthBar = document.createElement('div');
    healthBar.style.width = '100%';
    healthBar.style.height = '100%';
    healthBar.style.backgroundColor = '#33FF33';
    healthBar.style.borderRadius = '5px';
    healthBar.style.transition = 'width 0.3s';
    healthBar.style.position = 'absolute'; // Position absolutely within container
    healthBar.style.left = '0';
    healthBar.style.top = '0';
    healthBar.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.5)';
    
    healthBarContainer.appendChild(healthBar);
    
    // Add health bar to element
    healthElement.innerHTML = `<div>SHIELD</div>`;
    healthElement.appendChild(healthBarContainer);
    document.body.appendChild(healthElement);
    
    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; box-shadow: 0 0 10px rgba(51, 255, 51, 0.7); }
            50% { opacity: 0.7; box-shadow: 0 0 20px rgba(51, 255, 51, 0.9); }
            100% { opacity: 1; box-shadow: 0 0 10px rgba(51, 255, 51, 0.7); }
        }
        
        @keyframes healthGlow {
            0% { box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5); }
            50% { box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.8); }
            100% { box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5); }
        }
    `;
    document.head.appendChild(style);
    
    // Update display
    updateDisplay();
    
    function updateDisplay() {
        // Get shield percentage
        const healthPercentage = Math.max(0, health / maxHealth * 100);
        
        // Format the HTML with the numeric value
        const valueDisplay = document.createElement('div');
        valueDisplay.style.marginTop = '5px';
        valueDisplay.textContent = `${Math.round(healthPercentage)}%`;
        
        // Clear previous content except for the "SHIELD" label
        while (healthElement.childNodes.length > 2) {
            healthElement.removeChild(healthElement.lastChild);
        }
        
        // Add the value display after the health bar
        healthElement.appendChild(valueDisplay);
        
        // Update bar width
        requestAnimationFrame(() => {
            healthBar.style.width = `${healthPercentage}%`;
        });
        
        // Change color based on health percentage
        if (healthPercentage > 60) {
            healthBar.style.backgroundColor = '#33FF33'; // Bright green for high health
            healthBar.style.animation = 'healthGlow 2s infinite';
            healthElement.style.color = '#33FF33';
            healthElement.style.borderColor = '#33FF33';
        } else if (healthPercentage > 30) {
            healthBar.style.backgroundColor = '#FFFF33'; // Yellow for medium health
            healthBar.style.animation = 'healthGlow 1.5s infinite';
            healthElement.style.color = '#FFFF33';
            healthElement.style.borderColor = '#FFFF33';
        } else {
            healthBar.style.backgroundColor = '#FF3333'; // Red for critical
            healthBar.style.animation = 'pulse 0.8s infinite';
            healthElement.style.color = '#FF3333';
            healthElement.style.borderColor = '#FF3333';
            
            // Make the entire health element pulse when health is critical
            healthElement.style.animation = 'pulse 0.8s infinite';
        }
    }

    function decreaseHealth(amount) {
        health = Math.max(0, health - amount);
        updateDisplay();
        return health;
    }
    
    function getHealth() {
        return health;
    }
    
    function isGameOver() {
        return health <= 0;
    }
    
    function reset() {
        health = maxHealth;
        healthElement.style.animation = ''; // Clear any animation
        healthElement.style.color = '#33FF33'; // Reset to green
        healthElement.style.borderColor = '#33FF33'; // Reset border color
        updateDisplay();
    }

    return {
        decreaseHealth,
        getHealth,
        isGameOver,
        reset,
        element: healthElement
    };
} 