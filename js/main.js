import * as THREE from 'three';
import { createScene } from './modules/scene.js';
import { createShip } from './modules/ship.js';
import { createParticleSystem, updateParticles } from './modules/particles.js';
import { createControls, updateShipPosition } from './modules/controls.js';
import { createWeaponSystem } from './modules/weapons.js';
import { createEnemyManager } from './modules/enemies.js';
import { createScoreDisplay } from './modules/scoreDisplay.js';
import { createInstructionsDisplay } from './modules/instructionsDisplay.js';
import { createHealthDisplay } from './modules/healthDisplay.js';
import { createGameOverDisplay } from './modules/gameOverDisplay.js';
import { createStartScreen } from './modules/startScreen.js';
import { createAudioSystem } from './modules/audio.js';
import { createStarfield } from './modules/starfield.js';
import { createPauseScreen } from './modules/pauseScreen.js';
import * as explosions from './modules/explosions.js';

// Create scene, camera, and renderer
const { scene, camera, renderer } = createScene();

// Camera settings for third-person view
const cameraOffset = new THREE.Vector3(0, 3, 10); // Position camera behind and above the ship
let currentCameraPosition = new THREE.Vector3();
let cameraVelocity = new THREE.Vector3();
const cameraLagFactor = 0.04; // Lower values make camera more laggy (more inertia)
const cameraVelocityDamping = 0.5; // Damping to prevent oscillation

// Initialize camera position
currentCameraPosition.copy(camera.position);

// Create starfield background
const starfield = createStarfield();
scene.add(starfield.group);

// Create ship and add particle system
const ship = createShip();
//const particleSystem = createParticleSystem();
//ship.add(particleSystem.system);
scene.add(ship);

// Setup controls
const keys = createControls();

// Setup weapon system
const weaponSystem = createWeaponSystem();
let lastShotTime = 0;

// Setup enemy system
const enemyManager = createEnemyManager();

// Setup display systems
const scoreDisplay = createScoreDisplay();
const healthDisplay = createHealthDisplay();
const instructionsDisplay = createInstructionsDisplay();
const gameOverDisplay = createGameOverDisplay(scoreDisplay);

// Setup audio system
const audioSystem = createAudioSystem();
audioSystem.init();
console.log("Audio system initialized, loading sounds...");

// Attempt to resume audio context immediately (will often require user interaction)
audioSystem.resumeAudio();

// Add listener for user interaction as early as possible to enable audio
window.addEventListener('click', () => {
    console.log("User interaction detected, resuming audio context...");
    audioSystem.resumeAudio();
    
    // Check if we're at the start screen and should play intro music
    if (!gameStarted) {
        const audioStatus = audioSystem.getStatus();
        if (!audioStatus.introMusicActive && !audioStatus.backgroundMusicActive) {
            console.log("At start screen, attempting to play intro music after user interaction");
            tryPlayingIntroMusic();
        }
    }
}, { capture: true });

// Check if sounds are loaded
const checkSoundsLoaded = () => {
    const status = audioSystem.getStatus();
    return status.soundsLoaded.some(sound => sound.name === 'background' && sound.loaded);
};

// Wire up sound toggle
instructionsDisplay.soundToggle.addEventListener('click', () => {
    const soundEnabled = instructionsDisplay.toggleSound();
    audioSystem.enableSound(soundEnabled);
    
    // If sound is re-enabled and we're at the start screen,
    // restart intro music if it was playing
    if (soundEnabled && !gameStarted) {
        tryPlayingIntroMusic();
    } 
    // If sound is re-enabled and we're in game, restart background music
    else if (soundEnabled && gameStarted && !gameOver) {
        audioSystem.playBackgroundMusic(0.4);
    }
});

// Set restart callback
gameOverDisplay.setRestartCallback(restartGame);

// Setup pause screen
const pauseScreen = createPauseScreen();

// Track game state
let gameStarted = false;
let gameOver = false;
let gamePaused = false;
let enemiesDestroyed = 0; // Track number of enemies destroyed

// Hide UI elements initially
scoreDisplay.element.style.display = 'none';
healthDisplay.element.style.display = 'none';
instructionsDisplay.element.style.display = 'none';
pauseScreen.pauseButton.style.display = 'none'; // Hide pause button initially

// Create start screen
const startScreen = createStartScreen();
startScreen.startButton.addEventListener('click', startGame);

// Play intro music as soon as the start screen is created
console.log("Starting intro music for start screen...");
audioSystem.resumeAudio();

// Try to start the intro music with retries if needed
let startScreenMusicAttempts = 0;
const MAX_INTRO_ATTEMPTS = 5;

const tryPlayingIntroMusic = () => {
    startScreenMusicAttempts++;
    console.log(`Attempt ${startScreenMusicAttempts} to play intro music...`);
    
    const introSoundLoaded = audioSystem.getStatus().soundsLoaded.some(
        sound => sound.name === 'intro' && sound.loaded
    );
    
    if (introSoundLoaded) {
        console.log("Intro sound loaded, playing now for start screen!");
        const result = audioSystem.playIntroMusic(0.3);
        console.log("Start screen intro music started:", result);
    } else if (startScreenMusicAttempts < MAX_INTRO_ATTEMPTS) {
        console.log(`Intro sound not loaded yet, retrying in ${startScreenMusicAttempts * 500}ms...`);
        setTimeout(tryPlayingIntroMusic, startScreenMusicAttempts * 500);
    } else {
        console.warn("Failed to load intro music for start screen after multiple attempts");
    }
};

// Start the first attempt for the start screen intro music
tryPlayingIntroMusic();

// Add effects to scene
const { effects } = weaponSystem;
scene.add(effects.leftMuzzleFlash.flash);
scene.add(effects.rightMuzzleFlash.flash);
scene.add(effects.leftLaserTrail.trail);
scene.add(effects.rightLaserTrail.trail);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Update collision detection to use the new explosion for laser hits
function checkCollisions() {
    const lasers = weaponSystem.lasers;
    const enemies = enemyManager.enemies;
    
    // Check laser hits on enemies
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        const laserBox = new THREE.Box3().setFromObject(laser);

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const enemyBox = new THREE.Box3().setFromObject(enemy);

            if (laserBox.intersectsBox(enemyBox)) {
                // Check if it's a boss ship
                const isBoss = enemy.userData.isBoss;
                
                // Remove the laser regardless
                scene.remove(laser);
                lasers.splice(i, 1);
                
                if (isBoss) {
                    // Decrease boss health
                    enemy.userData.health--;
                    
                    // Play hit sound
                    audioSystem.playSound('explosion', { volume: 0.15 });
                    
                    // Create small hit effect
                    const smallExplosion = explosions.createExplosion(scene, laser.position);
                    smallExplosion.forEach(particle => {
                        particle.scale.set(0.5, 0.5, 0.5);
                        particle.userData.lifetime = 0.5; // Shorter lifetime
                    });
                    explosions.addExplosion(smallExplosion);
                    
                    // Color flash feedback on hit
                    if (enemy.children.length > 0) {
                        // Change material color for a brief flash
                        enemy.children.forEach(part => {
                            if (part.material && !part.userData.originalColor) {
                                // Store original color first time
                                part.userData.originalColor = part.material.color.clone();
                                part.userData.originalEmissive = part.material.emissive ? 
                                    part.material.emissive.clone() : new THREE.Color(0x000000);
                            }
                            
                            if (part.material) {
                                // Flash white on hit
                                part.material.color.set(0xffffff);
                                if (part.material.emissive) {
                                    part.material.emissive.set(0xffffff);
                                }
                                
                                // Restore original color after delay
                                setTimeout(() => {
                                    if (part.userData.originalColor) {
                                        part.material.color.copy(part.userData.originalColor);
                                    }
                                    if (part.material.emissive && part.userData.originalEmissive) {
                                        part.material.emissive.copy(part.userData.originalEmissive);
                                    }
                                }, 100);
                            }
                        });
                    }
                    
                    // Check if boss is destroyed
                    if (enemy.userData.health <= 0) {
                        // Create realistic explosion at enemy position
                        const explosion = explosions.createLaserExplosion(scene, enemy.position, camera, true);
                        explosions.addExplosion(explosion);
                        
                        // Play explosion sound
                        audioSystem.playSound('explosion', { volume: 0.5 });
                        
                        // Update score - 9999 for boss ships
                        scoreDisplay.addScore(97482);
                        
                        // Increment enemies destroyed counter
                        enemiesDestroyed++;
                        
                        // Remove the enemy
                        scene.remove(enemy);
                        enemies.splice(j, 1);
                    }
                } else {
                    // Regular enemy - destroy immediately with new explosion effect
                    const explosion = explosions.createLaserExplosion(scene, enemy.position, camera, false);
                    explosions.addExplosion(explosion);
                    
                    // Play explosion sound
                    audioSystem.playSound('explosion', { volume: 0.3 });
                    
                    // Update score - 999 for regular enemies
                    scoreDisplay.addScore(16487);
                    
                    // Increment enemies destroyed counter
                    enemiesDestroyed++;
                    
                    // Remove the enemy
                    scene.remove(enemy);
                    enemies.splice(j, 1);
                }
                
                break;
            }
        }
    }
    
    // Keep the existing code for enemies passing the player
    // Check enemies passing the player
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // If enemy passes the player, decrease health
        if (enemy.position.z > 2) {
            // Damage based on enemy type
            if (enemy.userData.isBoss) {
                healthDisplay.decreaseHealth(200);
            } else {
                healthDisplay.decreaseHealth(50);
            }
            
            // Create small explosion as enemy passes (KEEP THIS EFFECT UNCHANGED)
            const explosion = explosions.createExplosion(scene, enemy.position);
            explosions.addExplosion(explosion);
            
            // Play flyby sound instead of explosion sound
            audioSystem.playSound('flyby', { 
                volume: enemy.userData.isBoss ? 0.3 : 0.2 // Louder for boss ships
            });
            
            // Remove the enemy
            scene.remove(enemy);
            enemies.splice(i, 1);
            
            // Check if game over
            if (healthDisplay.isGameOver()) {
                showGameOver();
            }
        }
    }
}

// Show game over screen
function showGameOver() {
    gameOver = true;
    gameOverDisplay.show(enemiesDestroyed); // Pass enemies destroyed count
    ship.visible = false;
    
    // Hide pause button when game is over
    pauseScreen.pauseButton.style.display = 'none';
    
    // Stop background music and play game over sound
    audioSystem.stopBackgroundMusic();
    audioSystem.playSound('gameover', { volume: 0.2 });
    
    // Add ship explosion
    const shipExplosion = explosions.createExplosion(scene, ship.position);
    explosions.addExplosion(shipExplosion);
}

// Reset game state
function resetGameState() {
    // Reset score
    scoreDisplay.reset();
    
    // Reset health
    healthDisplay.reset();
    
    // Reset enemies destroyed count
    enemiesDestroyed = 0;
    
    // Clear existing enemies
    const enemies = enemyManager.enemies;
    for (let i = enemies.length - 1; i >= 0; i--) {
        scene.remove(enemies[i]);
    }
    enemies.length = 0;
    
    // Clear existing lasers
    const lasers = weaponSystem.lasers;
    for (let i = lasers.length - 1; i >= 0; i--) {
        scene.remove(lasers[i]);
    }
    lasers.length = 0;
    
    // Reset ship position
    ship.position.set(0, 0, 0);
    ship.visible = true;
    
    // Reset game state flags
    gameOver = false;
}

// Start the game (first time from start screen)
function startGame() {
    console.log("Starting game...");
    
    // Stop the intro music before transitioning to game
    console.log("Stopping intro music...");
    audioSystem.stopIntroMusic();
    
    startScreen.hide();
    gameStarted = true;
    
    // Show UI elements
    scoreDisplay.element.style.display = 'block';
    healthDisplay.element.style.display = 'block';
    instructionsDisplay.element.style.display = 'block';
    pauseScreen.pauseButton.style.display = 'flex'; // Show pause button when game starts
    
    // Initialize pause functionality
    pauseScreen.initialize();
    pauseScreen.setPauseCallback(() => {
        gamePaused = true;
        // Optional: pause background music or reduce volume
        audioSystem.setVolumeMultiplier(0.3); // Lower volume when paused
    });
    
    pauseScreen.setResumeCallback(() => {
        gamePaused = false;
        // Resume normal volume
        audioSystem.setVolumeMultiplier(1.0);
    });
    
    // Reset game state
    resetGameState();
    
    // Resume audio context
    console.log("Resuming audio...");
    audioSystem.resumeAudio();
    
    // Try to start the background music with retries if needed
    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    
    const tryPlayingBackgroundMusic = () => {
        attempts++;
        console.log(`Attempt ${attempts} to play background music...`);
        
        if (checkSoundsLoaded()) {
            console.log("Background sound loaded, playing now!");
            const result = audioSystem.playBackgroundMusic(0.4);
            console.log("Background music started:", result);
        } else if (attempts < MAX_ATTEMPTS) {
            console.log(`Sound not loaded yet, retrying in ${attempts * 500}ms...`);
            setTimeout(tryPlayingBackgroundMusic, attempts * 500);
        } else {
            console.warn("Failed to load background music after multiple attempts");
        }
    };
    
    // Start the first attempt
    tryPlayingBackgroundMusic();
}

// Restart the game (after game over)
function restartGame() {
    console.log("Restarting game...");
    // Hide game over screen
    gameOverDisplay.hide();
    
    // Reset game state
    resetGameState();
    
    // Skip start screen
    startScreen.hide();
    gameStarted = true;
    gameOver = false;
    ship.visible = true;
    
    // Show UI elements
    scoreDisplay.element.style.display = 'block';
    scoreDisplay.showDisplay();
    healthDisplay.element.style.display = 'block';
    healthDisplay.showDisplay();
    instructionsDisplay.element.style.display = 'block';
    
    // Show pause button and make sure it's initialized
    pauseScreen.pauseButton.style.display = 'flex';
    
    // Re-initialize pause functionality
    pauseScreen.initialize();
    pauseScreen.setPauseCallback(() => {
        gamePaused = true;
        // Reduce volume when paused
        audioSystem.setVolumeMultiplier(0.3);
    });
    
    pauseScreen.setResumeCallback(() => {
        gamePaused = false;
        // Resume normal volume
        audioSystem.setVolumeMultiplier(1.0);
    });
    
    // Resume audio context
    audioSystem.resumeAudio();
    
    // Ensure the background music is playing
    console.log("Attempting to restart background music...");
    const audioStatus = audioSystem.getStatus();
    console.log("Audio status:", audioStatus);
    
    if (checkSoundsLoaded()) {
        console.log("Sounds loaded, playing background music immediately");
        audioSystem.playBackgroundMusic(0.4);
    } else {
        // Try to start the background music with retries if needed
        let attempts = 0;
        const MAX_ATTEMPTS = 5;
        
        const tryPlayingBackgroundMusic = () => {
            attempts++;
            console.log(`Restart attempt ${attempts} to play background music...`);
            
            if (checkSoundsLoaded()) {
                console.log("Background sound loaded, playing now!");
                const result = audioSystem.playBackgroundMusic(0.4);
                console.log("Background music started on restart:", result);
            } else if (attempts < MAX_ATTEMPTS) {
                console.log(`Sound not loaded yet, retrying in ${attempts * 500}ms...`);
                setTimeout(tryPlayingBackgroundMusic, attempts * 500);
            } else {
                console.warn("Failed to load background music after multiple restart attempts");
            }
        };
        
        // Start the first attempt
        tryPlayingBackgroundMusic();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate ship velocity for starfield effect
    const shipVelocity = {
        x: keys.ArrowLeft ? 0.1 : (keys.ArrowRight ? -0.1 : 0),
        y: keys.ArrowUp ? -0.1 : (keys.ArrowDown ? 0.1 : 0),
        z: 0
    };
    
    // Always update starfield, even at start screen or game over
    starfield.update(ship.position, shipVelocity);
    
    // Ensure pause button is visible when game is running
    if (gameStarted && !gameOver && pauseScreen.pauseButton.style.display !== 'flex') {
        pauseScreen.pauseButton.style.display = 'flex';
    } else if (gameOver && pauseScreen.pauseButton.style.display !== 'none') {
        pauseScreen.pauseButton.style.display = 'none';
    }
    
    // Check if background music should be playing but isn't
    if (gameStarted && !gameOver && !audioSystem.getStatus().backgroundMusicActive && checkSoundsLoaded()) {
        console.log("Background music stopped unexpectedly, restarting...");
        audioSystem.playBackgroundMusic(0.4);
    }
    
    // Update game only if not paused
    if (gameStarted && !gameOver && !pauseScreen.isPaused()) {
        updateShipPosition(ship, keys);
        //updateParticles(particleSystem);
        
        // Make camera follow the ship with natural motion
        if (ship.position) {
            // Calculate target position
            const targetCameraPosition = new THREE.Vector3().copy(ship.position).add(cameraOffset);
            
            // Calculate distance from current to target
            const positionDelta = new THREE.Vector3().subVectors(targetCameraPosition, currentCameraPosition);
            
            // Apply smooth acceleration toward target (spring physics)
            cameraVelocity.add(positionDelta.multiplyScalar(cameraLagFactor));
            
            // Apply damping to prevent overshooting
            cameraVelocity.multiplyScalar(cameraVelocityDamping);
            
            // Update current camera position
            currentCameraPosition.add(cameraVelocity);
            
            // Apply to actual camera
            camera.position.copy(currentCameraPosition);
            
            // Smoothly look at a point slightly ahead of the ship
            const lookTarget = new THREE.Vector3().copy(ship.position);
            lookTarget.z -= 2; // Look slightly ahead
            camera.lookAt(lookTarget);
        }
        
        // Handle shooting
        const now = Date.now();
        if (keys.Space && now - lastShotTime > 125) { // Fire rate limit: 8 shots per second
            const newLasers = weaponSystem.shoot(ship);
            newLasers.forEach(laser => scene.add(laser));
            
            // Play lightsaber sound
            audioSystem.playSound('laser', { volume: 0.1 });
            
            lastShotTime = now;
        }
        
        weaponSystem.updateLasers(scene);
        enemyManager.updateEnemies(scene, camera);
        
        // Check for collisions
        checkCollisions();
    } else if (!gameStarted || gameOver) {
        // When not in game, use a fixed camera position
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
        
        // Reset camera tracking variables
        currentCameraPosition.set(0, 0, 15);
        cameraVelocity.set(0, 0, 0);
    }
    
    // Update explosions (even during game over)
    explosions.updateExplosions(scene, camera);
    
    // Render the scene
    renderer.render(scene, camera);
}

animate(); 