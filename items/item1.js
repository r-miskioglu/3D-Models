import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.y = 50;
camera.position.x = 25;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//TEST
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add a light source
const lightAmb = new THREE.AmbientLight("0xffffff",1); // soft white light
scene.add(lightAmb);


const light = new THREE.DirectionalLight( 0xffffff, 2 );
light.position.set( 225, 320, 105 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

// Load the 3D model
const loader = new GLTFLoader();
loader.load("model1.glb", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0, 0, 0); // Adjust position as needed
});

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required for damping (controls.enableDamping = true; controls.dampingFactor = 0.25)
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});