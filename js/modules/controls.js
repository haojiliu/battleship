import { createMobileControls } from './mobileControls.js';

export function createControls() {
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        Space: false
    };

    // Create mobile controls
    const mobileControls = createMobileControls();

    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            keys.Space = true;
        } else if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            keys.Space = false;
        } else if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = false;
        }
    });

    return {
        keys,
        mobileControls
    };
}

export function updateShipPosition(ship, controls) {
    const moveSpeed = 0.3;
    const bounds = {
        left: -15,
        right: 15,
        top: 8,
        bottom: -8
    };

    // Calculate new position
    let newX = ship.position.x;
    let newY = ship.position.y;

    // Get joystick values
    const joystick = controls.mobileControls.getJoystickValues();

    // Combine keyboard and joystick input
    if (controls.keys.ArrowLeft || joystick.x < -0.5) newX -= moveSpeed;
    if (controls.keys.ArrowRight || joystick.x > 0.5) newX += moveSpeed;
    if (controls.keys.ArrowUp || joystick.y > 0.5) newY += moveSpeed;
    if (controls.keys.ArrowDown || joystick.y < -0.5) newY -= moveSpeed;

    // Apply bounds
    ship.position.x = Math.max(bounds.left, Math.min(bounds.right, newX));
    ship.position.y = Math.max(bounds.bottom, Math.min(bounds.top, newY));
} 