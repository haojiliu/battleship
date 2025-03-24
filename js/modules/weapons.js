import * as THREE from 'three';
import { createMuzzleFlash, createLaserTrail } from './effects.js';

export function createWeaponSystem() {
    const lasers = [];
    const laserSpeed = 1;
    const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5.5, 8);
    const laserMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });

    // Create effects for each wing
    const leftMuzzleFlash = createMuzzleFlash();
    const rightMuzzleFlash = createMuzzleFlash();
    const leftLaserTrail = createLaserTrail();
    const rightLaserTrail = createLaserTrail();

    function shoot(ship) { 
        // Create two lasers (one from each wing)
        const LaserPositions = {
            LEFT_WING: -1,
            //CENTER_LEFT_3: -0.75,
            //CENTER_LEFT_2: -0.5,
            //CENTER_LEFT_1: -0.25,
            //CENTER: 0,
            //CENTER_RIGHT_1: 0.25,
            //CENTER_RIGHT_2: 0.5,
            // CENTER_RIGHT_3: 0.75,
            RIGHT_WING: 1
        };

        const laserPositionY = 0.6
        const positions = Object.values(LaserPositions).map(x => new THREE.Vector3(x, laserPositionY, 0));

        positions.forEach((pos, index) => {
            const laser = new THREE.Mesh(laserGeometry, laserMaterial);
            
            // Calculate world position correctly
            const worldPos = new THREE.Vector3();
            worldPos.copy(ship.position);
            worldPos.add(pos);
            laser.position.copy(worldPos);
            
            laser.rotation.x = Math.PI / 2;
            laser.velocity = new THREE.Vector3(0, 0, -laserSpeed);
            lasers.push(laser);

            // Show effects at the correct position
            if (index === 0) {
                leftMuzzleFlash.show(worldPos);
                leftLaserTrail.show(worldPos);
            } else {
                rightMuzzleFlash.show(worldPos);
                rightLaserTrail.show(worldPos);
            }
        });

        return lasers;
    }

    function updateLasers(scene) {
        // Update effects
        leftMuzzleFlash.update();
        rightMuzzleFlash.update();
        leftLaserTrail.update();
        rightLaserTrail.update();

        // Update lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            laser.position.add(laser.velocity);

            // Remove lasers that have gone too far
            if (laser.position.z < -20) {
                scene.remove(laser);
                lasers.splice(i, 1);
            }
        }
    }

    return { 
        shoot, 
        updateLasers,
        effects: {
            leftMuzzleFlash,
            rightMuzzleFlash,
            leftLaserTrail,
            rightLaserTrail
        },
        lasers
    };
} 