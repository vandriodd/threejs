import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, -0.4, 5);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const hero = document.getElementById("hero");
hero.appendChild(renderer.domElement);

renderer.setClearColor(0x000000, 0);

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
ambientLight.position.set(0, 1, 1);
scene.add(ambientLight);

const fontLoader = new FontLoader();

fontLoader.load("Noto Serif_Regular.json", (font) => {
  const textGeometry = new TextGeometry("Happy Birthday!", {
    font: font,
    size: 0.4,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xcc76f7 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  textMesh.position.set(-2.1, 1.5, 0);
  scene.add(textMesh);
});

const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ color: 0xcc76f7 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.y = -0.7;

const loader = new GLTFLoader();
loader.load(
  "Cake Birthday.glb",
  (gltf) => {
    const cake = gltf.scene;
    scene.add(cake);

    function animate() {
      requestAnimationFrame(animate);
      cake.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  },
  undefined,
  (error) => {
    console.error("No cargó el modelo, diablo", error);
  }
);
