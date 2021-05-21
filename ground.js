// import {OrbitControls} from "./JS/OrbitControls";

// set up the scene
const scene = new THREE.Scene();

//Add rectangle to the Scene
const geometry = new THREE.BoxGeometry(10, 0.1, 10);
const material = new THREE.MeshLambertMaterial({color: 0x70483c});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

//Set Up Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 0);
scene.add(directionalLight);

//Camera
const width = 20;
const height = width * (window.innerHeight / window.innerWidth);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const camera = new THREE.OrthographicCamera(
//   width / -2, //LEFT
//   width / 2, //RIGHT
//   height / 2, //TOP
//   height / -2, //BOTTOM
//   1, // near
//   100 //far
// );

camera.position.set(4, 4, 4);
camera.lookAt(0, 0, 0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const animate = function () {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
  controls.update();
};

animate();

document.body.appendChild(renderer.domElement);
