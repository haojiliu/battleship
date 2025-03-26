import { isMobileDevice } from './utils.js';

export function createMobileWarning() {
    if (!isMobileDevice()) return null;

    const warningContainer = document.createElement('div');
    warningContainer.style.position = 'fixed';
    warningContainer.style.top = '0';
    warningContainer.style.left = '0';
    warningContainer.style.width = '100%';
    warningContainer.style.height = '100%';
    warningContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    warningContainer.style.display = 'flex';
    warningContainer.style.flexDirection = 'column';
    warningContainer.style.alignItems = 'center';
    warningContainer.style.justifyContent = 'center';
    warningContainer.style.zIndex = '9999';
    warningContainer.style.padding = '20px';

    // Create the warning text container
    const textContainer = document.createElement('div');
    textContainer.style.textAlign = 'center';
    textContainer.style.maxWidth = '600px';
    textContainer.style.position = 'relative';

    // Create the warning title
    const title = document.createElement('h1');
    title.textContent = 'WARNING';
    title.style.color = '#00BFFF';
    title.style.fontSize = '48px';
    title.style.fontFamily = '"Orbitron", sans-serif';
    title.style.textShadow = '0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF';
    title.style.marginBottom = '30px';
    title.style.animation = 'pulse 2s infinite';

    // Create the warning message
    const message = document.createElement('p');
    message.innerHTML = `
        This game is not supported on mobile devices.<br>
        Please use a desktop computer to play the game.
    `;
    message.style.color = '#00BFFF';
    message.style.fontSize = '24px';
    message.style.fontFamily = '"Orbitron", sans-serif';
    message.style.textShadow = '0 0 5px #00BFFF, 0 0 10px #00BFFF';
    message.style.lineHeight = '1.5';
    message.style.marginBottom = '20px';

    // Create the decorative line
    const line = document.createElement('div');
    line.style.width = '100%';
    line.style.height = '2px';
    line.style.background = 'linear-gradient(90deg, transparent, #00BFFF, transparent)';
    line.style.margin = '20px 0';

    // Add elements to container
    textContainer.appendChild(title);
    textContainer.appendChild(line);
    textContainer.appendChild(message);
    warningContainer.appendChild(textContainer);

    // Add the warning container to the document
    document.body.appendChild(warningContainer);

    // Add the pulse animation to the document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { text-shadow: 0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF; }
            50% { text-shadow: 0 0 20px #00BFFF, 0 0 30px #00BFFF, 0 0 40px #00BFFF; }
            100% { text-shadow: 0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF; }
        }
    `;
    document.head.appendChild(style);

    return warningContainer;
} 