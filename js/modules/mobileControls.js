import { isMobileDevice } from './utils.js';

export function createMobileControls() {
    // Create container for mobile controls
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '200px';
    container.style.display = 'none'; // Hidden by default
    container.style.zIndex = '1000';
    container.style.pointerEvents = 'none'; // Allow clicks to pass through by default

    // Create joystick container
    const joystickContainer = document.createElement('div');
    joystickContainer.style.position = 'absolute';
    joystickContainer.style.left = '50px';
    joystickContainer.style.bottom = '50px';
    joystickContainer.style.width = '100px';
    joystickContainer.style.height = '100px';
    joystickContainer.style.pointerEvents = 'auto';

    // Create joystick base
    const joystickBase = document.createElement('div');
    joystickBase.style.width = '100%';
    joystickBase.style.height = '100%';
    joystickBase.style.borderRadius = '50%';
    joystickBase.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    joystickBase.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    joystickContainer.appendChild(joystickBase);

    // Create joystick stick
    const joystickStick = document.createElement('div');
    joystickStick.style.position = 'absolute';
    joystickStick.style.width = '40px';
    joystickStick.style.height = '40px';
    joystickStick.style.borderRadius = '50%';
    joystickStick.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    joystickStick.style.left = '30px';
    joystickStick.style.top = '30px';
    joystickContainer.appendChild(joystickStick);

    // Create fire button
    const fireButton = document.createElement('div');
    fireButton.style.position = 'absolute';
    fireButton.style.right = '50px';
    fireButton.style.bottom = '50px';
    fireButton.style.width = '100px';
    fireButton.style.height = '100px';
    fireButton.style.borderRadius = '50%';
    fireButton.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    fireButton.style.border = '2px solid rgba(255, 0, 0, 0.5)';
    fireButton.style.pointerEvents = 'auto';
    fireButton.style.display = 'flex';
    fireButton.style.alignItems = 'center';
    fireButton.style.justifyContent = 'center';
    fireButton.style.color = 'white';
    fireButton.style.fontSize = '24px';
    fireButton.textContent = 'FIRE';

    // Add elements to container
    container.appendChild(joystickContainer);
    container.appendChild(fireButton);

    // Add container to document
    document.body.appendChild(container);

    // Joystick state
    let joystickActive = false;
    let joystickX = 0;
    let joystickY = 0;
    const joystickRadius = 30; // Maximum distance from center

    // Touch event handlers for joystick
    function handleJoystickStart(e) {
        joystickActive = true;
        updateJoystickPosition(e);
    }

    function handleJoystickMove(e) {
        if (joystickActive) {
            updateJoystickPosition(e);
        }
    }

    function handleJoystickEnd() {
        joystickActive = false;
        joystickStick.style.left = '30px';
        joystickStick.style.top = '30px';
    }

    function updateJoystickPosition(e) {
        const rect = joystickContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const touch = e.touches[0];
        let x = touch.clientX - centerX;
        let y = touch.clientY - centerY;
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y);
        if (distance > joystickRadius) {
            // Limit to radius
            x = (x / distance) * joystickRadius;
            y = (y / distance) * joystickRadius;
        }
        
        joystickX = x / joystickRadius;
        joystickY = y / joystickRadius;
        
        joystickStick.style.left = `${30 + x}px`;
        joystickStick.style.top = `${30 + y}px`;
    }

    // Add touch event listeners
    joystickContainer.addEventListener('touchstart', handleJoystickStart);
    joystickContainer.addEventListener('touchmove', handleJoystickMove);
    joystickContainer.addEventListener('touchend', handleJoystickEnd);
    joystickContainer.addEventListener('touchcancel', handleJoystickEnd);

    // Fire button state
    let isFiring = false;

    // Touch event handlers for fire button
    function handleFireStart() {
        isFiring = true;
        fireButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    }

    function handleFireEnd() {
        isFiring = false;
        fireButton.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    }

    // Add touch event listeners for fire button
    fireButton.addEventListener('touchstart', handleFireStart);
    fireButton.addEventListener('touchend', handleFireEnd);
    fireButton.addEventListener('touchcancel', handleFireEnd);

    // Function to show/hide mobile controls
    function toggleMobileControls(show) {
        container.style.display = show ? 'block' : 'none';
    }

    // Show controls if on mobile device
    if (isMobileDevice()) {
        toggleMobileControls(true);
    }

    return {
        getJoystickValues: () => ({
            x: joystickX,
            y: joystickY
        }),
        isFiring: () => isFiring,
        toggleMobileControls
    };
} 