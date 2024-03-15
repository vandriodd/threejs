import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// const treeUrl = new URL('/scene.gltf', import.meta.url)

/* ------------------------------- Setting up ------------------------------- */

// Create an instance of WebGL renderer, that is a tool that threejs uses to allocate a space on a web page where we can add and animate all of the 3D stuff we want to create
const renderer = new THREE.WebGLRenderer()

// shadowMap is a property that will allow us to cast and receive shadows
renderer.shadowMap.enabled = true

// Set the size of the renderer to the size of the window
renderer.setSize(window.innerWidth, window.innerHeight)

// Inject the space into the page
document.body.appendChild(renderer.domElement)

/* ----------------------- Creating scene & add camera ---------------------- */

const scene = new THREE.Scene()

// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// Create an instance of OrbitControls, which is a tool that allows us to move the camera around the scene
const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// set( x, y, z )
camera.position.set(-10, 30, 30)
// update the camera position everytime we move it
orbit.update()

/* --------------------------- Create a 3D object --------------------------- */
// 1. Create a geometry (like the skeleton of the object)
// 2. Create a material
// 3. Combine the geometry and the material to create a mesh
// 4. Add the mesh to the scene
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
//! The angles in threejs are in radians, so we need to convert the degrees to radians, -Math.PI / 2 is equal to -90 degrees in x axis
plane.rotation.x = -Math.PI / 2
// The shadow will be casted on the plane, receiveShadow its a boolean
plane.receiveShadow = true

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

// When we increase the number of segments, the sphere will look more perfect
//^ wireframe: true will show the skeleton of the sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)

// MeshStandardMaterial is a material that will reflect the light
// MeshLambertMaterial is a material that will not reflect the light
//! Both of them needs light to be visible
// In other hand, MeshBasicMaterial does not need light to be visible
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

sphere.position.set(-10, 10, 0)
sphere.castShadow = true

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

/* ---------------------------- Directional Light --------------------------- */
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// //! Actually, shadows in threeJS use cameras internally, so we need to set the properties of the camera that will be used to cast the shadow
// directionalLight.castShadow = true
// // Adjust the shadow properties
// directionalLight.shadow.camera.bottom = -12

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

/* -------------------------------- SpotLight ------------------------------- */
const spotLight = new THREE.SpotLight(0xffffff, 0.8)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = 0.2

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

// renderer.setClearColor(0xFFEA00)
const textureLoader = new THREE.TextureLoader()

// 1st way to add a background
scene.background = textureLoader.load('/background.png')

// 2nd way
// const cubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = cubeTextureLoader.load([
//   '/background.png',
//   '/background.png',
//   '/background.png',
//   '/background.png'
//   // more images that applies to the different faces of the cube
// ])

const boxGeometry2 = new THREE.BoxGeometry(4, 4, 4)
const boxMaterial2 = new THREE.MeshBasicMaterial({
  map: textureLoader.load('/woodTexture.png')
})
const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2)
scene.add(box2)
box2.position.set(0, 2.1, 10)

/* ------------------ Change position of object's vertices ------------------ */

const plane2Geometry = new THREE.PlaneGeometry(10, 10)
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
scene.add(plane2)
plane2.position.set(0, 0, 10)

plane2.geometry.attributes.position.array[0] -= 10 * Math.random()
plane2.geometry.attributes.position.array[1] -= 10 * Math.random()
plane2.geometry.attributes.position.array[2] -= 10 * Math.random()
const lastPointZ = plane2.geometry.attributes.position.array.length - 1
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random()

/* ------------------------ Vertex & fragment shaders ----------------------- */
const sphereGeometry2 = new THREE.SphereGeometry(4)

// const vShader = `
//   void main() {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `

// const fShader = `
//   void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//   }
// `

const sphereMaterial2 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
})
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2)
scene.add(sphere2)
sphere2.position.set(-5, 10, 10)

/* ----------------------------- Load 3D models ----------------------------- */
const assetLoader = new GLTFLoader()

assetLoader.load('/scene.gltf', (gltf) => {
  const model = gltf.scene
  scene.add(model)
  model.position.set(10, 0, 0)
}, undefined, (error) => {
  console.error(error)
})

/* ----------------------------- dat.GUI library ---------------------------- */
// Is a library that allows us to create a user interface to change the properties of the objects in the scene
const gui = new dat.GUI()

// options object is for the properties that we want to change
const options = {
  sphereColor: 0x0000ff,
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1
}

//^ Syntax for adding a property to the gui
// addColor(object, property)
// onChange() will be called everytime the value of the property changes
gui.addColor(options, 'sphereColor').onChange((e) => {
  sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange((e) => {
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0

/* ------------------------------ Select object ----------------------------- */

// Create a vector to store the mouse position
const mousePosition = new THREE.Vector2()

// Add an event listener to the window to get the mouse position when it moves
window.addEventListener('mousemove', (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
})

// Create a raycaster to detect the objects that the mouse is pointing at
const rayCaster = new THREE.Raycaster()

// Threejs objects have an id property, and also we can add a name to the objects
const sphereId = sphere.id
box2.name = 'theBox'

// Animation loop function that will be called every frame
const animate = () => {
  box.rotation.x += 0.01
  box.rotation.y += 0.01

  step += options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))

  spotLight.angle = options.angle
  spotLight.penumbra = options.penumbra
  spotLight.intensity = options.intensity
  sLightHelper.update()

  rayCaster.setFromCamera(mousePosition, camera)
  const intersects = rayCaster.intersectObjects(scene.children)

  // for loop thats going to iterate over all the objects that the raycaster is pointing at
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId) intersects[i].object.material.color.set(0xff0000)
    if (intersects[i].object.name === 'theBox') intersects[i].object.material.color.set(0x00ff00)
  }

  plane2.geometry.attributes.position.array[0] = 10 * Math.random()
  plane2.geometry.attributes.position.array[1] = 10 * Math.random()
  plane2.geometry.attributes.position.array[2] = 10 * Math.random()
  plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random()
  plane2.geometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

/* -------------------------- Do canvas responsive -------------------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
