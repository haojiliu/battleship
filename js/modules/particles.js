import * as THREE from 'three';

export function createParticleSystem() {
    // Create a more advanced particle system for realistic engine flame
    const particleCount = 300; // Increased for density
    const particles = new THREE.BufferGeometry();
    
    // Arrays to hold individual particle properties
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    // Colors for flame gradient (from inner to outer)
    const coreColor = new THREE.Color(0xffffff); // Hot white core
    const midColor = new THREE.Color(0xffaa00);  // Orange-yellow mid
    const outerColor = new THREE.Color(0xff4400); // Red-orange outer
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random position in a wider, shorter cone (bigger radius, shorter z)
        const radius = Math.random() * 0.35; // Increased from 0.2 to 0.35 for wider flame
        const theta = Math.random() * Math.PI * 2;
        const z = 0.5 + Math.random() * 0.6; // Reduced from 1.0 to 0.6 for shorter flame
        
        positions[i3] = Math.sin(theta) * radius;     // x
        positions[i3 + 1] = Math.cos(theta) * radius; // y
        positions[i3 + 2] = z;                        // z
        
        // Assign colors based on distance from center
        let particleColor;
        if (radius < 0.07) {
            particleColor = coreColor;
        } else if (radius < 0.14) {
            // Interpolate between core and mid
            const t = (radius - 0.07) / 0.07;
            particleColor = new THREE.Color().lerpColors(coreColor, midColor, t);
        } else {
            // Interpolate between mid and outer
            const t = (radius - 0.14) / 0.06;
            particleColor = new THREE.Color().lerpColors(midColor, outerColor, t);
        }
        
        colors[i3] = particleColor.r;
        colors[i3 + 1] = particleColor.g;
        colors[i3 + 2] = particleColor.b;
        
        // Vary particle sizes (make them larger overall)
        sizes[i] = 0.08 + (0.35 - radius) * 0.7; // Increased from 0.05 to 0.08 and adjusted scale
        
        // Random lifetime for continuous respawn effect
        lifetimes[i] = Math.random();
        
        // Velocity (adjust for shorter flame)
        const speed = 0.04 + (0.35 - radius) * 0.15; // Slightly reduced speed for shorter flame
        velocities[i3] = (Math.random() - 0.5) * 0.015;    // slightly more x drift
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.015; // slightly more y drift
        velocities[i3 + 2] = speed;                         // z velocity (positive = outward)
    }
    
    // Set attributes
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader material for better-looking particles
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: createFlameTexture() }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                // Apply glow effect
                gl_FragColor.rgb *= 1.5;
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    
    // Create the particle system
    const system = new THREE.Points(particles, particleMaterial);
    
    // Position at the front of the ship, moved closer for shorter flame
    system.position.set(0, -0.25, 1.0); // Moved from z=1.2 to z=1.0 and slightly lower
    
    // Store velocities and lifetimes for animation
    system.userData = {
        velocities,
        lifetimes,
        positions,
        colors,
        sizes,
        coreColor,
        midColor,
        outerColor
    };
    
    return { system };
}

// Create a soft, glowing texture for particles
function createFlameTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    
    const context = canvas.getContext('2d');
    
    // Create a radial gradient for a softer particle
    const gradient = context.createRadialGradient(
        32, 32, 0,    // inner circle center and radius
        32, 32, 32    // outer circle center and radius
    );
    
    // Add color stops for a more realistic flame look
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 180, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create texture
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export function updateParticles(particleSystem) {
    const system = particleSystem.system;
    const positions = system.geometry.attributes.position.array;
    const velocities = system.userData.velocities;
    const lifetimes = system.userData.lifetimes;
    const colors = system.geometry.attributes.color.array;
    const sizes = system.geometry.attributes.size.array;
    
    // Flame flicker effect parameters
    const time = Date.now() * 0.0005;
    const flickerSpeed = 10;
    const flickerIntensity = 0.15;
    
    // Update each particle
    for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        // Update lifetime (for continuous respawn)
        lifetimes[i] -= 0.01;
        
        // Random flicker effect
        const flicker = 1.0 + Math.sin(time * flickerSpeed + i) * flickerIntensity;
        
        // If particle died, respawn it at engine position
        if (lifetimes[i] < 0) {
            // Reset position - wider cone at origin
            const radius = Math.random() * 0.35; // Increased from 0.2 to 0.35
            const theta = Math.random() * Math.PI * 2;
            
            positions[i3] = Math.sin(theta) * radius;     // x
            positions[i3 + 1] = Math.cos(theta) * radius; // y
            positions[i3 + 2] = 0.3 + Math.random() * 0.2; // Reduced from 0.5 to 0.3 for shorter flame
            
            // Assign colors based on distance from center with flicker
            let particleColor;
            if (radius < 0.07) {
                particleColor = system.userData.coreColor.clone();
            } else if (radius < 0.14) {
                // Interpolate between core and mid
                const t = (radius - 0.07) / 0.07;
                particleColor = new THREE.Color().lerpColors(system.userData.coreColor, system.userData.midColor, t);
            } else {
                // Interpolate between mid and outer
                const t = (radius - 0.14) / 0.06;
                particleColor = new THREE.Color().lerpColors(system.userData.midColor, system.userData.outerColor, t);
            }
            
            // Apply flicker effect
            particleColor.multiplyScalar(flicker);
            
            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;
            
            // Vary particle sizes based on distance from center, with flicker influence
            sizes[i] = (0.08 + (0.35 - radius) * 0.7) * flicker; // Increased sizes
            
            // New velocity (faster at center, slower at edges)
            const speed = 0.04 + (0.35 - radius) * 0.15; // Adjusted for shorter flame
            velocities[i3] = (Math.random() - 0.5) * 0.015;     // slightly more x drift
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.015; // slightly more y drift
            velocities[i3 + 2] = speed;                        // z velocity (positive = outward)
            
            // Shorter lifetime for more rapid turnover
            lifetimes[i] = 0.4 + Math.random() * 0.4; // Reduced from 0.5 to 0.4
        } else {
            // Move particle based on velocity
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];
            
            // Add some turbulence/flicker to existing particles
            const turbulence = Math.sin(time * 15 + i * 33.3) * 0.002;
            positions[i3] += turbulence;
            positions[i3 + 1] += turbulence;
            
            // Fade out particles as they age
            const fadeRatio = lifetimes[i];
            
            // Calculate distance from center
            const dx = positions[i3];
            const dy = positions[i3 + 1];
            const radius = Math.sqrt(dx * dx + dy * dy);
            
            // Get base color based on radius
            let particleColor;
            if (radius < 0.07) {
                particleColor = system.userData.coreColor.clone();
            } else if (radius < 0.14) {
                const t = (radius - 0.07) / 0.07;
                particleColor = new THREE.Color().lerpColors(system.userData.coreColor, system.userData.midColor, t);
            } else {
                const t = (radius - 0.14) / 0.06;
                particleColor = new THREE.Color().lerpColors(system.userData.midColor, system.userData.outerColor, t);
            }
            
            // Apply flicker and fade
            particleColor.multiplyScalar(fadeRatio * flicker);
            
            // Update color
            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;
            
            // Update size with fade and flicker
            sizes[i] *= 0.995; // Gradually reduce size
        }
    }
    
    // Mark attributes as needing update
    system.geometry.attributes.position.needsUpdate = true;
    system.geometry.attributes.color.needsUpdate = true;
    system.geometry.attributes.size.needsUpdate = true;
} 