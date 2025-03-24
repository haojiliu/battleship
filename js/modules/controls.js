export function createControls() {
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        Space: false
    };

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

    return keys;
}

export function updateShipPosition(ship, keys) {
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

    if (keys.ArrowLeft) newX -= moveSpeed;
    if (keys.ArrowRight) newX += moveSpeed;
    if (keys.ArrowUp) newY += moveSpeed;
    if (keys.ArrowDown) newY -= moveSpeed;

    // Apply bounds
    ship.position.x = Math.max(bounds.left, Math.min(bounds.right, newX));
    ship.position.y = Math.max(bounds.bottom, Math.min(bounds.top, newY));
} 