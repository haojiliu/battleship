import * as THREE from 'three';

export function createMuzzleFlash() {
    const flashGeometry = new THREE.CircleGeometry(0.1, 16);
    const flashMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1
    });

    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.rotation.x = Math.PI / 2;
    flash.visible = false;

    function show(position) {
        flash.position.copy(position);
        flash.visible = true;
        flash.material.opacity = 1;
    }

    function update() {
        if (flash.visible) {
            flash.material.opacity -= 0.1;
            if (flash.material.opacity <= 0) {
                flash.visible = false;
            }
        }
    }

    return { flash, show, update };
}

export function createLaserTrail() {
    const trailGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
    const trailMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.rotation.x = Math.PI / 2;
    trail.visible = false;

    function show(position) {
        trail.position.copy(position);
        trail.visible = true;
        trail.material.opacity = 0.8;
    }

    function update() {
        if (trail.visible) {
            trail.material.opacity -= 0.2;
            if (trail.material.opacity <= 0) {
                trail.visible = false;
            }
        }
    }

    return { trail, show, update };
} 