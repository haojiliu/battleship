import * as THREE from 'three';

export function createStarfield() {
    // Create a group to hold all stars
    const starfieldGroup = new THREE.Group();
    
    // Create star material
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Create multiple star layers with different densities and speeds
    const layers = [
        { count: 2000, depth: 100, speed: 0.01, size: 0.05 },  // Distant stars (small, slow)
        { count: 500, depth: 80, speed: 0.02, size: 0.08 },   // Medium stars
        { count: 200, depth: 60, speed: 0.03, size: 0.12 }    // Close stars (larger, faster)
    ];
    
    const starLayers = [];
    
    layers.forEach(layer => {
        // Create star geometry
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const velocities = new Float32Array(layer.count * 3);
        const colors = new Float32Array(layer.count * 3);
        const sizes = new Float32Array(layer.count);
        
        // Populate star positions and colors
        for (let i = 0; i < layer.count; i++) {
            const i3 = i * 3;
            
            // Random positions across a wide area
            positions[i3] = (Math.random() - 0.5) * 150;     // x
            positions[i3 + 1] = (Math.random() - 0.5) * 150; // y
            positions[i3 + 2] = -(Math.random() * layer.depth + 10); // z (negative = into the screen)
            
            // Store velocity (only in z-direction for now)
            velocities[i3] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = layer.speed;
            
            // Random star colors
            // Mostly white, but some stars with slight blue or yellow tint
            const r = 0.9 + Math.random() * 0.1;
            const g = 0.9 + Math.random() * 0.1;
            const b = 0.9 + Math.random() * 0.1;
            
            colors[i3] = r;
            colors[i3 + 1] = g; 
            colors[i3 + 2] = b;
            
            // Random star sizes, with some variation within the layer
            sizes[i] = layer.size * (0.8 + Math.random() * 0.4);
        }
        
        // Set geometry attributes
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material with custom sizes
        const material = new THREE.PointsMaterial({
            size: layer.size,
            transparent: true,
            opacity: 0.8,
            color: 0xffffff,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create the star system
        const starSystem = new THREE.Points(starGeometry, material);
        
        // Add to group
        starfieldGroup.add(starSystem);
        
        // Store the layer info for animation
        starLayers.push({
            system: starSystem,
            positions: positions,
            velocities: velocities,
            depth: layer.depth
        });
    });
    
    // Update function for star animation
    function updateStarfield(shipPosition, shipVelocity) {
        shipPosition = shipPosition || { x: 0, y: 0, z: 0 };
        shipVelocity = shipVelocity || { x: 0, y: 0, z: 0 };
        
        starLayers.forEach(layer => {
            const positions = layer.positions;
            const velocities = layer.velocities;
            const depth = layer.depth;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Move star in z direction (based on layer speed)
                positions[i + 2] += velocities[i + 2];
                
                // Add slight shift based on ship movement (parallax effect)
                if (shipVelocity.x || shipVelocity.y) {
                    // Deeper stars (further away) move less - parallax effect
                    const parallaxFactor = 0.02 * (1 - (layer.depth / 100));
                    positions[i] -= shipVelocity.x * parallaxFactor;
                    positions[i + 1] -= shipVelocity.y * parallaxFactor;
                }
                
                // If star passes the camera, reset it to the back
                if (positions[i + 2] > 10) {
                    positions[i] = (Math.random() - 0.5) * 150;
                    positions[i + 1] = (Math.random() - 0.5) * 150;
                    positions[i + 2] = -(Math.random() * depth + 10);
                }
                
                // If star goes too far to the sides due to ship movement, reset it
                const boundaryLimit = 100;
                if (Math.abs(positions[i]) > boundaryLimit || Math.abs(positions[i + 1]) > boundaryLimit) {
                    positions[i] = (Math.random() - 0.5) * 150;
                    positions[i + 1] = (Math.random() - 0.5) * 150;
                    positions[i + 2] = -(Math.random() * depth + 10);
                }
            }
            
            // Update geometry
            layer.system.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    return {
        group: starfieldGroup,
        update: updateStarfield
    };
} 