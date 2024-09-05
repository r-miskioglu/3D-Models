import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas'), antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// Set the camera position
camera.position.x = 250;
camera.position.y = 15;
camera.position.z = 5;

camera.rotation.x = 0.8;
camera.rotation.y = 0;
camera.rotation.z = 0;

// Add OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);

// Create the particle grid
const particles = new THREE.BufferGeometry();

const gridHeight = 500;
const gridWidth = 500;
const gridThickness = 1;

// Update buffer size to include z-coordinates
const positions = new Float32Array((gridHeight + 1) * (gridWidth + 1) * 3);

// Fill the positions array with a grid of particles
let i = 0;
for (let x = 0; x <= gridHeight; x += 1) {
    for (let y = 0; y <= gridWidth; y += 1) {
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = 0; // Initial z-coordinate
        i += 3;
    }
}

// Set the position attribute for the particles
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a material for the particles
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
});

// Create a Points object to represent the particle system
const particleSystem = new THREE.Points(particles, particleMaterial);

// Add the particle system to the scene
scene.add(particleSystem);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    // controls.update();
    // console.log(camera.position, camera.rotation)
    // Animate the z-coordinate of each particle
    const positions = particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.001; // Use time to create a wave effect

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(positions[i] * 0.1 + time) * Math.cos(positions[i + 1] * 0.2 + time); // Update z-coordinate
    }

    particleSystem.geometry.attributes.position.needsUpdate = true; // Mark position attribute for update

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
