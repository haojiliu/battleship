import * as THREE from 'three';

export function createEnemyShip() {
    const enemyGroup = new THREE.Group();
    
    // Create cockpit (spherical)
    const cockpitGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        shininess: 80,
        specular: 0x999999
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    enemyGroup.add(cockpit);
    
    // Create left wing
    const leftWingGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const leftWingMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        shininess: 80,
        specular: 0x999999
    });
    const leftWing = new THREE.Mesh(leftWingGeometry, leftWingMaterial);
    leftWing.position.set(-0.8, 0, 0);
    leftWing.rotation.y = -Math.PI / 2;
    enemyGroup.add(leftWing);
    
    // Create right wing
    const rightWingGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const rightWingMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        shininess: 80,
        specular: 0x999999
    });
    const rightWing = new THREE.Mesh(rightWingGeometry, rightWingMaterial);
    rightWing.position.set(0.8, 0, 0);
    rightWing.rotation.y = Math.PI / 2;
    enemyGroup.add(rightWing);
    
    // Create left strut
    const leftStrutGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8);
    const leftStrutMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        shininess: 80,
        specular: 0x999999
    });
    const leftStrut = new THREE.Mesh(leftStrutGeometry, leftStrutMaterial);
    leftStrut.position.set(-0.5, 0, 0);
    leftStrut.rotation.z = Math.PI / 2;
    enemyGroup.add(leftStrut);
    
    // Create right strut
    const rightStrutGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8);
    const rightStrutMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        shininess: 80,
        specular: 0x999999
    });
    const rightStrut = new THREE.Mesh(rightStrutGeometry, rightStrutMaterial);
    rightStrut.position.set(0.5, 0, 0);
    rightStrut.rotation.z = -Math.PI / 2;
    enemyGroup.add(rightStrut);
    
    // Add main engine glow
    const engineGeometry = new THREE.CircleGeometry(0.12, 6);
    const engineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.5
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.z = 0.5;
    engine.rotation.x = -Math.PI / 2;
    enemyGroup.add(engine);
    
    // Add outer engine glow
    const outerGlowGeometry = new THREE.CircleGeometry(0.25, 12);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    outerGlow.position.z = 0.4;
    outerGlow.rotation.x = -Math.PI / 2;
    enemyGroup.add(outerGlow);
    
    // Add engine trail
    const trailGeometry = new THREE.CylinderGeometry(0.05, 0.2, 1, 8);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6
    });
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.position.z = 0;
    trail.rotation.x = -Math.PI / 2;
    enemyGroup.add(trail);
    
    // Add pulsing effect
    enemyGroup.userData.pulseTime = 0;
    enemyGroup.userData.engine = engine;
    enemyGroup.userData.outerGlow = outerGlow;
    enemyGroup.userData.trail = trail;
    
    return enemyGroup;
}

export function createBossEnemyShip() {
    const enemyGroup = new THREE.Group();
    const healthBarWidth = 3.0; // Doubled from 1.5
    
    // Create cockpit (conical for more aggressive look)
    const cockpitGeometry = new THREE.ConeGeometry(1.2, 3.0, 12); // Doubled from 0.6, 1.5
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444, // Dark grey
        shininess: 100,
        specular: 0x888888
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.rotation.x = Math.PI / 2; // Orient forward
    enemyGroup.add(cockpit);
    
    // Create left wing
    const leftWingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 4.5, 8); // Doubled from 0.03, 2.25
    const leftWingMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, // Darker grey
        shininess: 100,
        specular: 0x888888
    });
    const leftWing = new THREE.Mesh(leftWingGeometry, leftWingMaterial);
    leftWing.position.set(-2.4, 0, 0); // Doubled from -1.2
    leftWing.rotation.y = -Math.PI / 2;
    enemyGroup.add(leftWing);
    
    // Create right wing
    const rightWingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 4.5, 8); // Doubled from 0.03, 2.25
    const rightWingMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, // Darker grey
        shininess: 100,
        specular: 0x888888
    });
    const rightWing = new THREE.Mesh(rightWingGeometry, rightWingMaterial);
    rightWing.position.set(2.4, 0, 0); // Doubled from 1.2
    rightWing.rotation.y = Math.PI / 2;
    enemyGroup.add(rightWing);
    
    // Create left strut
    const leftStrutGeometry = new THREE.CylinderGeometry(0.24, 0.24, 3.0, 8); // Doubled from 0.12, 1.5
    const leftStrutMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, // Darker grey
        shininess: 100,
        specular: 0x888888
    });
    const leftStrut = new THREE.Mesh(leftStrutGeometry, leftStrutMaterial);
    leftStrut.position.set(-1.5, 0, 0); // Doubled from -0.75
    leftStrut.rotation.z = Math.PI / 2;
    enemyGroup.add(leftStrut);
    
    // Create right strut
    const rightStrutGeometry = new THREE.CylinderGeometry(0.24, 0.24, 3.0, 8); // Doubled from 0.12, 1.5
    const rightStrutMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, // Darker grey
        shininess: 100,
        specular: 0x888888
    });
    const rightStrut = new THREE.Mesh(rightStrutGeometry, rightStrutMaterial);
    rightStrut.position.set(1.5, 0, 0); // Doubled from 0.75
    rightStrut.rotation.z = -Math.PI / 2;
    enemyGroup.add(rightStrut);
    
    // Add main engine glow
    const engineGeometry = new THREE.CircleGeometry(0.36, 6); // Doubled from 0.18
    const engineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3300, // Red-orange for engine
        emissive: 0xff3300,
        emissiveIntensity: 0.7
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.z = 1.5; // Doubled from 0.75
    engine.rotation.x = -Math.PI / 2;
    enemyGroup.add(engine);
    
    // Add outer engine glow
    const outerGlowGeometry = new THREE.CircleGeometry(0.76, 12); // Doubled from 0.38
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600, // Orange
        emissive: 0xff6600,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    outerGlow.position.z = 1.2; // Doubled from 0.6
    outerGlow.rotation.x = -Math.PI / 2;
    enemyGroup.add(outerGlow);
    
    // Add engine trail
    const trailGeometry = new THREE.CylinderGeometry(0.15, 0.6, 3.0, 8); // Doubled from 0.075, 0.3, 1.5
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.7
    });
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.position.z = 0;
    trail.rotation.x = -Math.PI / 2;
    enemyGroup.add(trail);
    
    // Add pulsing effect
    enemyGroup.userData.pulseTime = 0;
    enemyGroup.userData.engine = engine;
    enemyGroup.userData.outerGlow = outerGlow;
    enemyGroup.userData.trail = trail;
    
    // Mark as boss and set health
    enemyGroup.userData.isBoss = true;
    enemyGroup.userData.health = 5; // Boss ships require 5 hits to destroy
    enemyGroup.userData.maxHealth = 5;
    
    // Update health bar to match larger ship
    const healthBarHeight = 0.3; // Doubled from 0.15
    
    // Create a container for the health bar that will always face the camera
    const healthBarContainer = new THREE.Group();
    healthBarContainer.position.set(0, 4.0, 0); // Doubled from 2.0
    enemyGroup.add(healthBarContainer);
    
    // Background (gray)
    const healthBgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
    const healthBgMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x555555,
        transparent: true,
        opacity: 0.8,
        depthTest: false // Ensure it renders on top
    });
    const healthBarBg = new THREE.Mesh(healthBgGeometry, healthBgMaterial);
    healthBarContainer.add(healthBarBg);
    
    // Foreground (red)
    const healthFgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
    const healthFgMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff3333,
        transparent: true,
        opacity: 0.9,
        depthTest: false // Ensure it renders on top
    });
    const healthBarFg = new THREE.Mesh(healthFgGeometry, healthFgMaterial);
    healthBarFg.position.z = 0.01; // Slightly in front of background
    healthBarContainer.add(healthBarFg);
    
    // Store references to health bar elements
    enemyGroup.userData.healthBarContainer = healthBarContainer;
    enemyGroup.userData.healthBarFg = healthBarFg;
    
    // Rotate to face the player
    enemyGroup.rotation.y = Math.PI;
    
    return enemyGroup;
}

export function createEnemyManager() {
    const enemies = [];
    let lastSpawnTime = 0;
    const spawnInterval = 1000; // Spawn every 1 seconds
    let bossSpawnChance = 0.15; // 15% chance to spawn a boss
    const healthBarWidth = 2; // Define here so it's accessible to updateEnemies
    
    function spawnEnemy() {
        // Determine if this should be a boss ship
        const isBoss = Math.random() < bossSpawnChance;
        
        // Create appropriate enemy type
        const enemy = isBoss ? createBossEnemyShip() : createEnemyShip();
        
        // Random position in the distance (for third-person view)
        const x = (Math.random() - 0.5) * 16; // Wider range
        const y = (Math.random() - 0.5) * 8; // Taller range
        const z = -40; // Start further away for third-person perspective
        enemy.position.set(x, y, z);
        
        // Add random movement pattern
        enemy.userData.movePattern = Math.floor(Math.random() * 4); // 0-3 movement patterns
        enemy.userData.amplitude = 0.05 + Math.random() * 0.1; // Random movement amplitude
        enemy.userData.frequency = 0.02 + Math.random() * 0.03; // Random movement frequency
        enemy.userData.waveCenterX = x; // Initial X position as wave center
        enemy.userData.waveCenterY = y; // Initial Y position as wave center
        enemy.userData.time = Math.random() * 100; // Random starting phase
        
        // Random speed - bosses move slightly slower
        enemy.speed = isBoss 
            ? 0.1 + Math.random() * 0.1  // Boss speed range: 0.1-0.2
            : 0.15 + Math.random() * 0.15; // Regular speed range: 0.15-0.3
        
        enemies.push(enemy);
        return enemy;
    }
    
    function updateEnemies(scene, camera) {
        const now = Date.now();
        
        // Spawn new enemies
        if (now - lastSpawnTime > spawnInterval) {
            const enemy = spawnEnemy();
            scene.add(enemy);
            lastSpawnTime = now;
        }
        
        // Update existing enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const isBoss = enemy.userData.isBoss;
            
            // Move enemy forward (toward the player)
            enemy.position.z += enemy.speed;
            
            // Update enemy position based on movement pattern
            enemy.userData.time += 0.05;
            
            switch(enemy.userData.movePattern) {
                case 0: // Sine wave on X-axis
                    enemy.position.x = enemy.userData.waveCenterX + 
                        Math.sin(enemy.userData.time * enemy.userData.frequency) * 
                        enemy.userData.amplitude * Math.abs(enemy.position.z);
                    break;
                case 1: // Sine wave on Y-axis
                    enemy.position.y = enemy.userData.waveCenterY + 
                        Math.sin(enemy.userData.time * enemy.userData.frequency) * 
                        enemy.userData.amplitude * Math.abs(enemy.position.z);
                    break;
                case 2: // Circular pattern
                    enemy.position.x = enemy.userData.waveCenterX + 
                        Math.sin(enemy.userData.time * enemy.userData.frequency) * 
                        enemy.userData.amplitude * Math.abs(enemy.position.z);
                    enemy.position.y = enemy.userData.waveCenterY + 
                        Math.cos(enemy.userData.time * enemy.userData.frequency) * 
                        enemy.userData.amplitude * Math.abs(enemy.position.z);
                    break;
                case 3: // Straight line (no additional movement)
                    break;
            }
            
            // Update visual effects
            enemy.userData.pulseTime += 0.1;
            
            // Boss ships have more intense pulsing
            const pulseIntensity = isBoss 
                ? 0.7 + Math.sin(enemy.userData.pulseTime) * 0.3  // More intense for bosses
                : 0.5 + Math.sin(enemy.userData.pulseTime) * 0.2; // Standard for regular enemies
            
            // Pulse the engine glow
            enemy.userData.engine.material.emissiveIntensity = pulseIntensity;
            enemy.userData.outerGlow.material.emissiveIntensity = pulseIntensity * 0.6;
            
            // Scale trail based on speed
            const trailScale = 0.5 + (enemy.speed - 0.1) * 5; // More dramatic trail
            enemy.userData.trail.scale.z = trailScale;
            
            // Fade trail based on distance
            const distance = enemy.position.z + 40; // Distance from spawn point
            const fadeStart = 30; // Start fading at this distance
            const fadeEnd = 40; // Fully faded at this distance
            const fadeProgress = Math.max(0, Math.min(1, (distance - fadeStart) / (fadeEnd - fadeStart)));
            enemy.userData.trail.material.opacity = 0.6 * (1 - fadeProgress);
            
            // Add slight rotation based on movement
            if (enemy.userData.movePattern !== 3) {
                enemy.rotation.z = Math.sin(enemy.userData.time * 0.1) * 0.1;
                enemy.rotation.x = Math.cos(enemy.userData.time * 0.1) * 0.1;
            }
            
            // Update health bar for boss ships
            if (isBoss && enemy.userData.healthBarFg && enemy.userData.healthBarContainer) {
                // Update health bar fill amount
                const healthPercent = enemy.userData.health / enemy.userData.maxHealth;
                enemy.userData.healthBarFg.scale.x = healthPercent;
                enemy.userData.healthBarFg.position.x = -(healthBarWidth * (1 - healthPercent)) / 2;
                
                // Make health bar face the camera
                if (camera) {
                    enemy.userData.healthBarContainer.lookAt(camera.position);
                }
            }
            
            // Remove enemies that have passed the player
            if (enemy.position.z > 10) { // Further distance for third-person view
                scene.remove(enemy);
                enemies.splice(i, 1);
            }
        }
    }
    
    return {
        enemies,
        updateEnemies
    };
} 