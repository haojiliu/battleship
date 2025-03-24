import * as THREE from 'three';

// Track active explosions
let explosions = [];

export function addExplosion(explosion) {
    explosions.push(explosion);
}

// Create explosion effect
export function createExplosion(scene, position) {
    const particles = [];
    const particleCount = 100;
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true
    });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        
        // Random velocity for each particle
        const speed = 0.1 + Math.random() * 0.2;
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.userData.velocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(angle) * speed,
            Math.sin(phi) * Math.sin(angle) * speed,
            Math.cos(phi) * speed
        );
        
        particle.userData.lifetime = 0.5; // 1 second lifetime
        particles.push(particle);
        scene.add(particle);
    }
    
    return particles;
}

// Create a more realistic laser-induced explosion effect for battleships
export function createLaserExplosion(scene, position, camera, isBoss = false) {
    const particles = [];
    const particleCount = isBoss ? 350 : 200;
    
    // Create a shockwave effect
    const shockwaveGeometry = new THREE.RingGeometry(0.1, 0.5, 32);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    
    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
    shockwave.position.copy(position);
    shockwave.lookAt(camera.position); // Always face camera
    shockwave.userData.velocity = new THREE.Vector3(0, 0, 0);
    shockwave.userData.lifetime = 0.6;
    shockwave.userData.isShockwave = true;
    shockwave.userData.expansionRate = isBoss ? 0.25 : 0.15;
    
    particles.push(shockwave);
    scene.add(shockwave);
    
    // Create an initial bright flash
    const flashGeometry = new THREE.SphereGeometry(isBoss ? 1.0 : 0.6, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    flash.userData.velocity = new THREE.Vector3(0, 0, 0);
    flash.userData.lifetime = 0.15; // Very quick flash
    flash.userData.isFlash = true;
    flash.userData.fadeSpeed = 6.0; // Very fast fade out
    
    particles.push(flash);
    scene.add(flash);
    
    // Create a secondary orange explosion core
    const coreGeometry = new THREE.SphereGeometry(isBoss ? 0.9 : 0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.copy(position);
    core.userData.velocity = new THREE.Vector3(0, 0, 0);
    core.userData.lifetime = 0.3; // Slightly longer than the flash
    core.userData.isCore = true;
    
    particles.push(core);
    scene.add(core);
    
    // Colors for the ship debris
    const shipDebrisColors = [
        0x444444, // Dark gray (hull)
        0x666666, // Medium gray (internal structure)
        0x888888, // Light gray (plating)
        0x222222, // Almost black (burned metal)
        0x553311  // Brown (scorched metal)
    ];
    
    // Colors for the flames
    const flameColors = [
        0xff4400, // Bright orange
        0xff2200, // Red-orange
        0xffaa00, // Yellow-orange
        0xffdd00, // Yellow
        0xffff99  // Light yellow (hottest)
    ];
    
    // Create various particles for debris, fire, and smoke
    for (let i = 0; i < particleCount; i++) {
        let particleGeometry, particleMaterial;
        
        // Determine particle type with weighted probabilities
        const particleType = Math.random();
        // More debris for boss ships
        const debrisThreshold = isBoss ? 0.4 : 0.35;
        // More flames for more dramatic effect
        const flameThreshold = isBoss ? 0.8 : 0.75;
        
        if (particleType < debrisThreshold) {
            // Ship debris with various shapes for realism
            const size = 0.05 + Math.random() * (isBoss ? 0.2 : 0.15);
            
            // Choose a random geometry type for variation
            const geometryType = Math.floor(Math.random() * 5);
            if (geometryType === 0) {
                // Hull fragments (flat plates)
                particleGeometry = new THREE.BoxGeometry(size, size * 0.2, size);
            } else if (geometryType === 1) {
                // Angular structures
                particleGeometry = new THREE.TetrahedronGeometry(size);
            } else if (geometryType === 2) {
                // Complex internal components
                particleGeometry = new THREE.DodecahedronGeometry(size);
            } else if (geometryType === 3) {
                // Cylindrical components (pipes, conduits)
                particleGeometry = new THREE.CylinderGeometry(size * 0.2, size * 0.2, size, 8);
            } else {
                // Standard fragments
                particleGeometry = new THREE.BoxGeometry(size, size, size);
            }
            
            // Use a ship-like color for debris with some variation
            const debrisColor = shipDebrisColors[Math.floor(Math.random() * shipDebrisColors.length)];
            
            // Some debris is glowing hot from the explosion
            const isGlowing = Math.random() < 0.3;
            if (isGlowing) {
                particleMaterial = new THREE.MeshPhongMaterial({
                    color: debrisColor,
                    emissive: 0xff2200,
                    emissiveIntensity: 0.5 + Math.random() * 0.5,
                    shininess: 30,
                    transparent: true
                });
            } else {
                particleMaterial = new THREE.MeshPhongMaterial({
                    color: debrisColor,
                    shininess: 30,
                    transparent: true
                });
            }
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Start position - randomness based on ship size
            const offset = isBoss ? 0.7 : 0.3;
            particle.position.set(
                position.x + (Math.random() - 0.5) * offset,
                position.y + (Math.random() - 0.5) * offset,
                position.z + (Math.random() - 0.5) * offset
            );
            
            // Debris is ejected outward rapidly from explosion center
            const speed = 0.15 + Math.random() * 0.4;
            const direction = new THREE.Vector3(
                particle.position.x - position.x,
                particle.position.y - position.y,
                particle.position.z - position.z
            ).normalize();
            
            particle.userData.velocity = direction.multiplyScalar(speed);
            
            // Add rotation to debris pieces
            particle.userData.rotation = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            
            particle.userData.lifetime = 0.7 + Math.random() * 1.0; // Longer lifetime for debris
            particle.userData.isDebris = true;
            particle.userData.isGlowing = isGlowing;
            if (isGlowing) {
                particle.userData.glowFadeRate = 0.3 + Math.random() * 0.7; // How quickly the glow cools
            }
            
            particles.push(particle);
            scene.add(particle);
            
        } else if (particleType < flameThreshold) {
            // Fire particles - dynamic flames - MAKING THESE TINY AND VERY SHORT-LIVED
            const size = 0.02 + Math.random() * (isBoss ? 0.15 : 0.07); // Further reduced from 0.05-0.25/0.15
            
            // Use different geometries for more interesting flames
            const flameShape = Math.random();
            if (flameShape < 0.7) {
                // Standard flame particles
                particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            } else {
                // More angular flame elements
                particleGeometry = new THREE.TetrahedronGeometry(size);
            }
            
            // Different colors based on flame temperature
            const flameColor = flameColors[Math.floor(Math.random() * flameColors.length)];
            
            particleMaterial = new THREE.MeshBasicMaterial({
                color: flameColor,
                transparent: true,
                opacity: 0.7 + Math.random() * 0.3
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Flames start closer to the center
            const offset = isBoss ? 0.5 : 0.25;
            particle.position.set(
                position.x + (Math.random() - 0.5) * offset,
                position.y + (Math.random() - 0.5) * offset,
                position.z + (Math.random() - 0.5) * offset
            );
            
            // Flames rise and spread outward
            const speed = 0.05 + Math.random() * 0.2;
            const upwardBias = 0.2 + Math.random() * 0.4; // Flames tend to rise
            
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * speed,
                (Math.random() + upwardBias) * speed,
                (Math.random() - 0.5) * speed
            );
            
            // Flames should pulse/flicker
            particle.userData.flickerSpeed = 0.1 + Math.random() * 0.2;
            particle.userData.flickerIntensity = 0.1 + Math.random() * 0.3;
            
            // Extra short lifetime for flames - reduced from 0.2-0.5 to 0.05-0.2
            particle.userData.lifetime = 0.05 + Math.random() * 0.15;
            particle.userData.isFlame = true;
            
            particles.push(particle);
            scene.add(particle);
            
        } else {
            // Smoke particles - dark and billowing
            const size = 0.15 + Math.random() * (isBoss ? 0.5 : 0.3);
            particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            
            // Smoke darkens as it ages
            const initialColor = Math.random() < 0.3 ? 0x999999 : 0x666666;
            particleMaterial = new THREE.MeshBasicMaterial({
                color: initialColor,
                transparent: true,
                opacity: 0.4 + Math.random() * 0.3
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Smoke starts mixed with the explosion
            const offset = isBoss ? 0.8 : 0.4;
            particle.position.set(
                position.x + (Math.random() - 0.5) * offset,
                position.y + (Math.random() - 0.5) * offset,
                position.z + (Math.random() - 0.5) * offset
            );
            
            // Smoke rises slower than flames
            const speed = 0.02 + Math.random() * 0.1;
            const upwardBias = 0.3 + Math.random() * 0.5; // Strong upward rise
            
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * speed,
                (Math.random() + upwardBias) * speed,
                (Math.random() - 0.5) * speed
            );
            
            // Much shorter smoke lifetime - reduced from 1.2-2.2 to 0.3-0.7 seconds
            particle.userData.lifetime = 0.3 + Math.random() * 0.4;
            particle.userData.isSmoke = true;
            particle.userData.growRate = 1.01 + Math.random() * 0.01; // Smoke expands as it rises
            
            particles.push(particle);
            scene.add(particle);
        }
    }
    
    return particles;
}

// Update updateExplosions function to handle different particle types
export function updateExplosions(scene, camera) {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        
        for (let j = explosion.length - 1; j >= 0; j--) {
            const particle = explosion[j];
            
            // Update position
            particle.position.add(particle.userData.velocity);
            
            // Update lifetime
            particle.userData.lifetime -= 0.016; // Assuming 60fps
            
            // Special handling for shockwave
            if (particle.userData.isShockwave) {
                // Expand the shockwave
                const expansionRate = particle.userData.expansionRate || 0.15;
                particle.scale.x += expansionRate;
                particle.scale.y += expansionRate;
                
                // Fade out as it expands
                particle.material.opacity = particle.userData.lifetime * 1.5;
                
                // Keep it facing the camera
                particle.lookAt(camera.position);
            }
            // Special handling for flash particles
            else if (particle.userData.isFlash) {
                const fadeSpeed = particle.userData.fadeSpeed || 1.0;
                particle.material.opacity = particle.userData.lifetime * fadeSpeed;
                // Scale the flash
                particle.scale.multiplyScalar(1.05); // Expand rapidly
            } 
            // Special handling for explosion core
            else if (particle.userData.isCore) {
                particle.material.opacity = particle.userData.lifetime * 2.5;
                // Scale the core
                particle.scale.multiplyScalar(1.03);
            }
            // Handle debris particles
            else if (particle.userData.isDebris) {
                // Make debris slowly fade out
                particle.material.opacity = particle.userData.lifetime;
                
                // Update rotation for debris particles
                if (particle.userData.rotation) {
                    particle.rotation.x += particle.userData.rotation.x;
                    particle.rotation.y += particle.userData.rotation.y;
                    particle.rotation.z += particle.userData.rotation.z;
                    
                    // Slow down rotation over time (air resistance)
                    particle.userData.rotation.multiplyScalar(0.98);
                }
                
                // Slow down debris due to drag
                particle.userData.velocity.multiplyScalar(0.97);
                
                // Handle glowing debris pieces cooling down
                if (particle.userData.isGlowing && particle.material.emissive) {
                    const glowFadeRate = particle.userData.glowFadeRate || 0.5;
                    particle.material.emissiveIntensity *= (1 - (0.01 * glowFadeRate));
                    
                    // Shift color from bright orange-red to darker red as it cools
                    const coolFactor = Math.max(0, 1 - (particle.userData.lifetime / 0.7));
                    const r = 1.0;
                    const g = Math.max(0.1, 0.34 - (coolFactor * 0.34));
                    const b = Math.max(0, 0.1 - (coolFactor * 0.1));
                    particle.material.emissive.setRGB(r, g, b);
                }
            }
            // Handle flame particles
            else if (particle.userData.isFlame) {
                // Flames flicker
                if (particle.userData.flickerSpeed) {
                    const flickerIntensity = particle.userData.flickerIntensity || 0.2;
                    const flickerAmount = Math.sin(Date.now() * particle.userData.flickerSpeed) * flickerIntensity;
                    particle.material.opacity = Math.min(1, Math.max(0.1, 
                        particle.userData.lifetime + flickerAmount));
                } else {
                    particle.material.opacity = particle.userData.lifetime;
                }
                
                // Flames expand slightly as they rise
                if (particle.userData.lifetime > 0.3) {
                    particle.scale.multiplyScalar(1.01);
                } else {
                    // But then contract as they burn out
                    particle.scale.multiplyScalar(0.98);
                }
                
                // Slow down as energy dissipates
                particle.userData.velocity.multiplyScalar(0.99);
            }
            // Handle smoke particles
            else if (particle.userData.isSmoke) {
                // Smoke fades out slowly
                particle.material.opacity = particle.userData.lifetime * 0.3;
                
                // Smoke expands as it rises
                if (particle.userData.growRate) {
                    particle.scale.multiplyScalar(particle.userData.growRate);
                }
                
                // Smoke darkens as it ages
                const darkenFactor = 1 - (particle.userData.lifetime / 2.2);
                const colorValue = Math.max(0.1, 0.6 - (darkenFactor * 0.4));
                particle.material.color.setRGB(colorValue, colorValue, colorValue);
                
                // Slow down vertical rise
                particle.userData.velocity.y *= 0.99;
            }
            // Regular explosion particles (backwards compatibility)
            else {
                // Fade out
                particle.material.opacity = particle.userData.lifetime;
            }
            
            // Remove dead particles
            if (particle.userData.lifetime <= 0) {
                scene.remove(particle);
                explosion.splice(j, 1);
            }
        }
        
        // Remove empty explosions
        if (explosion.length === 0) {
            explosions.splice(i, 1);
        }
    }
}
