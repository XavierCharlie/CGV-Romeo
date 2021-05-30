// set up the scene
const scene = new THREE.Scene();

// Add rectangle to the Scene
const geometry = new THREE.BoxGeometry(10, 0.1, 10);
const material = new THREE.MeshLambertMaterial({color: 0x70483c});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
mesh.scale.set(2000,2000,2000)

scene.add(mesh);

//TREE
let tree;

//Set Up Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(10, 20, 0);
scene.add(directionalLight);

//Camera
const width = 20;
const height = width * (window.innerHeight / window.innerWidth);
const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);
camera.position.set(-900,-200,-900);
// const camera = new THREE.OrthographicCamera(
//   width / -2, //LEFT
//   width / 2, //RIGHT
//   height / 2, //TOP
//   height / -2, //BOTTOM
//   1, // near
//   100 //far
// );

camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function loadGLTF(){
  let treeLoader = new  THREE.GLTFLoader();

  treeLoader.load('./Models/birch_tree.gltf', (gltf) => {
  

  tree = gltf.scene;
  tree.position.set(0, 95, 0);
  tree.scale.set(200,200,200)
  scene.add(tree);
  });

  // tried to do the landscape to not be flat 
  let landscapeLoader = new  THREE.GLTFLoader();
  landscapeLoader.load('./Models/landscape.gltf', (gltf) => {
    landscape = gltf.scene;
    landscape.position.set(0, -700, 0);
    landscape.scale.set(100,100,100)
    scene.add(landscape);
    });
}
function init(){

  document.body.appendChild(renderer.domElement);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);
  controls.minDistance = 500;
  controls.maxDistance = 2500;

  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load( './Skybox/east.bmp');        //front
  let texture_bk = new THREE.TextureLoader().load( './Skybox/west.bmp');      //back
  let texture_up = new THREE.TextureLoader().load( './Skybox/up.bmp');         //up
  let texture_dn = new THREE.TextureLoader().load( './Skybox/down.bmp');   //down
  let texture_rt = new THREE.TextureLoader().load( './Skybox/north.bmp');   //right
  let texture_lf = new THREE.TextureLoader().load( './Skybox/south.bmp');     //left

  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

  for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
  let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
  let skybox = new THREE.Mesh( skyboxGeo, materialArray );
  scene.add( skybox );
}

const animate = function () {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
  controls.update();
};
init();
loadGLTF();
animate();

document.body.appendChild(renderer.domElement);
