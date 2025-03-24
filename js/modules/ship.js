import * as THREE from 'three';

export function createShip() {
    const ship = new THREE.Group();

    // Create detailed cockpit
    const cockpit = createDetailedCockpit();
    ship.add(cockpit);

    // Create detailed wings
    const { leftWing, rightWing } = createDetailedWings();
    ship.add(leftWing);
    ship.add(rightWing);

    // Improved struts
    const { leftStrut, rightStrut } = createImprovedStruts();
    ship.add(leftStrut);
    ship.add(rightStrut);

    // Enhanced engine
    const engine = createEngine();
    ship.add(engine);

    // Initial position
    ship.position.set(0, -2, 0);

    return ship;
}

const STRUT_LENGTH = 1.5;

function createDetailedCockpit() {
    const cockpitGroup = new THREE.Group();
    
    // Main cockpit sphere
    const mainSphereGeometry = new THREE.SphereGeometry(0.6, 24, 24);
    const mainSphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe8e8e8,
        specular: 0x888888,
        shininess: 100
    });
    const mainSphere = new THREE.Mesh(mainSphereGeometry, mainSphereMaterial);
    cockpitGroup.add(mainSphere);
    
    // Front viewport (darkened glass)
    const viewportGeometry = new THREE.SphereGeometry(0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const viewportMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        specular: 0x666666,
        shininess: 120,
        transparent: true,
        opacity: 0.9
    });
    const viewport = new THREE.Mesh(viewportGeometry, viewportMaterial);
    viewport.position.z = -0.025;
    viewport.rotation.x = Math.PI;
    cockpitGroup.add(viewport);
    
    // Add external framework/hatch panels
    const panelCount = 8;
    for (let i = 0; i < panelCount; i++) {
        const angle = (i / panelCount) * Math.PI * 2;
        const panelGeometry = new THREE.PlaneGeometry(0.3, 0.5);
        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            specular: 0x222222,
            shininess: 30,
            side: THREE.DoubleSide
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Position panels around the sphere
        const radius = 0.6;
        panel.position.set(
            Math.sin(angle) * radius,
            Math.cos(angle) * radius,
            0
        );
        panel.lookAt(0, 0, 0);
        
        // Offset panels slightly outward
        const normal = new THREE.Vector3(panel.position.x, panel.position.y, panel.position.z).normalize();
        panel.position.add(normal.multiplyScalar(0.02));
        
        cockpitGroup.add(panel);
    }
    
    // Add small details - antenna and sensors
    const antennaGeometry = new THREE.CylinderGeometry(0.07, 0.1, 0.1, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({
        color: 0x2871fa
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 0.7, 0);
    cockpitGroup.add(antenna);
    
    // Small sensor dishes or protrusions
    const sensorGeometry = new THREE.SphereGeometry(0.08, 8, 8, 0, Math.PI);
    const sensorMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x222222
    });
    
    // Add sensors to the sides
    const leftSensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    leftSensor.position.set(-0.6, 0.2, 0);
    leftSensor.rotation.y = -Math.PI / 2;
    cockpitGroup.add(leftSensor);
    
    const rightSensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    rightSensor.position.set(0.6, 0.2, 0);
    rightSensor.rotation.y = Math.PI / 2;
    cockpitGroup.add(rightSensor);
    
    return cockpitGroup;
}

function createDetailedWings() {
    // Create hexagonal wing group with detailed panels
    const leftWingGroup = new THREE.Group();
    const rightWingGroup = new THREE.Group();
    
    // Base hexagonal wing shape
    const wingShape = new THREE.Shape();
    const size = 2.0;
    const points = [];
    
    // Create the hexagon shape and store points
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = size * Math.cos(angle) * 1.0;
        const y = size * Math.sin(angle) * 1.5;
        points.push(new THREE.Vector2(x, y));
        
        if (i === 0) {
            wingShape.moveTo(x, y);
        } else {
            wingShape.lineTo(x, y);
        }
    }
    
    // Close the shape
    wingShape.lineTo(points[0].x, points[0].y);
    
    // Create the base wings
    const wingExtrudeSettings = {
        depth: 0.15,
        bevelEnabled: false
    };
    
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x303030,
        specular: 0x888888,
        shininess: 80
    });

    const baseLeftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWingGroup.add(baseLeftWing);
    
    const baseRightWing = new THREE.Mesh(wingGeometry.clone(), wingMaterial);
    rightWingGroup.add(baseRightWing);
    
    // Add inner structural details to wings - concentric panels
    const addStructuralDetails = (wingGroup) => {
        // Add a central hub
        const hubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        const hubMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222,
            specular: 0x444444,
            shininess: 50
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.position.z = 0.08;
        wingGroup.add(hub);
        
        // Add radiating panels
        const panelCount = 6;
        for (let i = 0; i < panelCount; i++) {
            const angle = (i / panelCount) * Math.PI * 2;
            
            // Create a panel using box geometry
            const panelGeometry = new THREE.BoxGeometry(1.5, 0.25, 0.05);
            const panelMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x555555,
                shininess: 70
            });
            
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.set(
                Math.cos(angle) * 0.8,
                Math.sin(angle) * 0.8,
                0.1
            );
            panel.rotation.z = angle;
            wingGroup.add(panel);
        }
        
        // Add concentric ring detail
        const ringGeometry = new THREE.RingGeometry(1.0, 1.1, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xbdbbbb,
            specular: 0x444444,
            shininess: 50,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = 0.08;
        wingGroup.add(ring);
        
        // Add outer ring
        const outerRingGeometry = new THREE.RingGeometry(1.7, 1.8, 32);
        const outerRing = new THREE.Mesh(outerRingGeometry, ringMaterial);
        outerRing.rotation.x = Math.PI / 2;
        outerRing.position.z = 0.08;
        wingGroup.add(outerRing);
        
        // Add small detail protrusions
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 1.5;
            
            const detailGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
            const detailMaterial = new THREE.MeshPhongMaterial({
                color: 0x555555,
                specular: 0x888888,
                shininess: 100
            });
            
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            detail.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0.1
            );
            detail.rotation.x = Math.PI / 2;
            wingGroup.add(detail);
        }
    };
    
    // Add details to both wings
    addStructuralDetails(leftWingGroup);
    addStructuralDetails(rightWingGroup);
    
    // Position the wings
    leftWingGroup.rotation.y = -Math.PI / 2;
    leftWingGroup.position.x = -STRUT_LENGTH;
    
    rightWingGroup.rotation.y = Math.PI / 2;
    rightWingGroup.position.x = STRUT_LENGTH;
    
    return { leftWing: leftWingGroup, rightWing: rightWingGroup };
}

function createImprovedStruts() {
    const strutGroup = new THREE.Group();
    const STRUT_RADIUS = 0.12;
    
    // Main strut component
    const strutGeometry = new THREE.CylinderGeometry(STRUT_RADIUS, STRUT_RADIUS, STRUT_LENGTH, 12);
    const strutMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        specular: 0x999999,
        shininess: 80
    });

    const leftStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    leftStrut.position.set(-0.8, 0, 0);
    leftStrut.rotation.z = Math.PI / 2;
    
    const rightStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    rightStrut.position.set(0.8, 0, 0);
    rightStrut.rotation.z = -Math.PI / 2;
    
    // Add details to the struts - connection points and reinforcement rings
    const addStrutDetails = (strut, isLeft) => {
        // Add reinforcement rings
        const ringCount = 3;
        const ringSpacing = STRUT_LENGTH / (ringCount + 1);
        
        for (let i = 1; i <= ringCount; i++) {
            const ringGeometry = new THREE.TorusGeometry(STRUT_RADIUS + 0.03, 0.03, 8, 16);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0x828282,
                specular: 0x888888,
                shininess: 70
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            
            // Position the ring along the strut
            const direction = isLeft ? -1 : 1;
            const position = (ringSpacing * i - STRUT_LENGTH / 2) * direction;
            
            ring.rotation.y = Math.PI / 2;
            ring.position.x = position;
            
            strut.add(ring);
        }
        
        // Add connection points at the ends
        const connectorGeometry = new THREE.CylinderGeometry(STRUT_RADIUS + 0.05, STRUT_RADIUS + 0.05, 0.1, 16);
        const connectorMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x666666,
            shininess: 50
        });
        
        // Wing-side connector
        const wingConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        const direction = isLeft ? -1 : 1;
        wingConnector.position.x = (STRUT_LENGTH / 2 + 0.05) * direction;
        strut.add(wingConnector);
        
        // Cockpit-side connector
        const cockpitConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        cockpitConnector.position.x = (STRUT_LENGTH / 2 + 0.05) * -direction;
        strut.add(cockpitConnector);
        
        // Add wiring/cables along the strut
        const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, STRUT_LENGTH - 0.2, 8);
        const wireMaterial = new THREE.MeshPhongMaterial({
            color: 0x111111,
            specular: 0x444444,
            shininess: 30
        });
        
        const wire1 = new THREE.Mesh(wireGeometry, wireMaterial);
        wire1.position.y = STRUT_RADIUS * 0.6;
        wire1.rotation.x = Math.PI / 2;
        strut.add(wire1);
        
        const wire2 = new THREE.Mesh(wireGeometry, wireMaterial);
        wire2.position.y = -STRUT_RADIUS * 0.6;
        wire2.rotation.x = Math.PI / 2;
        strut.add(wire2);
    };
    
    // Add details to both struts
    addStrutDetails(leftStrut, true);
    addStrutDetails(rightStrut, false);
    
    return { leftStrut, rightStrut };
}

function createEngine() {
    // Create engine components group
    const engineGroup = new THREE.Group();
    
    // Main engine housing
    const engineHousingGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 16);
    const engineHousingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        specular: 0x666666,
        shininess: 30
    });
    const engineHousing = new THREE.Mesh(engineHousingGeometry, engineHousingMaterial);
    engineHousing.position.z = 0.6;
    engineGroup.add(engineHousing);
    
    // Add engine details - cooling vents, power conduits
    const ventCount = 8;
    for (let i = 0; i < ventCount; i++) {
        const angle = (i / ventCount) * Math.PI * 2;
        
        const ventGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.2);
        const ventMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222,
            specular: 0x444444,
            shininess: 30
        });
        
        const vent = new THREE.Mesh(ventGeometry, ventMaterial);
        
        // Position around the engine
        const radius = 0.35;
        vent.position.set(
            Math.sin(angle) * radius,
            Math.cos(angle) * radius,
            0.6
        );
        
        // Rotate to face outward
        vent.rotation.z = angle;
        
        engineGroup.add(vent);
    }
    
    // Engine detail - rear housing ring
    const rearRingGeometry = new THREE.TorusGeometry(0.4, 0.05, 8, 24);
    const rearRingMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        specular: 0x888888,
        shininess: 50
    });
    
    const rearRing = new THREE.Mesh(rearRingGeometry, rearRingMaterial);
    rearRing.position.z = 0.85;
    rearRing.rotation.x = Math.PI / 2;
    engineGroup.add(rearRing);
    
    // Engine flame - ONLY BLUE FLAMES
    const flameGroup = new THREE.Group();
    
    // Main flame cone - BLUE ONLY
    const flameGeometry = new THREE.ConeGeometry(0.5, 0.6, 16);
    const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3366ff, // Blue flame
        transparent: true,
        opacity: 0.8,
        emissive: 0x3366ff, // Blue glow
        emissiveIntensity: 1.0
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.rotation.x = Math.PI/2; // Point backward
    flame.position.z = 0.9;
    flameGroup.add(flame);
    
    // Inner brighter flame - BRIGHTER BLUE
    const innerFlameGeometry = new THREE.ConeGeometry(0.3, 0.4, 16);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x99ccff, // Light blue core
        transparent: true,
        opacity: 0.9,
        emissive: 0x99ccff, // Light blue glow
        emissiveIntensity: 1.0
    });
    const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    innerFlame.rotation.x = Math.PI/2; // Point backward
    innerFlame.position.z = 0.8;
    flameGroup.add(innerFlame);
    
    // Outer glow - DARKER BLUE
    const outerGlowGeometry = new THREE.ConeGeometry(0.7, 0.8, 16);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x1a3399, // Darker blue outer glow
        transparent: true,
        opacity: 0.4,
        emissive: 0x1a3399, // Dark blue glow
        emissiveIntensity: 0.5
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    outerGlow.rotation.x = Math.PI/2; // Point backward
    outerGlow.position.z = 1.0;
    flameGroup.add(outerGlow);
    
    // Fix the flame group orientation to face directly backward (z-axis)
    flameGroup.rotation.set(0, 0, 0);
    engineGroup.add(flameGroup);
    
    // Animation for flame flicker effect
    const animateFlame = () => {
        const flickerSpeed = 0.05;
        const flickerIntensity = 0.15;
        
        // Random flicker based on time
        const flicker = Math.sin(Date.now() * flickerSpeed) * flickerIntensity;
        
        // Apply flicker to flame size and opacity
        flame.scale.set(1 + flicker, 1 + flicker, 1 + flicker * 2);
        innerFlame.scale.set(1 + flicker * 1.5, 1 + flicker * 1.5, 1 + flicker * 3);
        outerGlow.scale.set(1 + flicker * 0.8, 1 + flicker * 0.8, 1 + flicker);
        
        // Continue animation
        requestAnimationFrame(animateFlame);
    };
    
    // Start the flame animation
    animateFlame();
    
    return engineGroup;
} 