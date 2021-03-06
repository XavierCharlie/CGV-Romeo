// set up the scene
const scene = new THREE.Scene();

// set up the comera of the seen to be perspective
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 4; // set the position of the comera
// render using webGL
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#e5e5e5"); // set the background color

// dynamicaly resizing the screen
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', ()=>{
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})
document.body.appendChild( renderer.domElement );

// draw the square
const geometryCube = new THREE.BoxGeometry();
const materialCube = new THREE.MeshLambertMaterial( { color: 0x00ffcc } );
const cube = new THREE.Mesh( geometryCube, materialCube );
// place the object in position (optional if not giventhen the position is the origin)
cube.position.set(1,1,1)
// place drowing on the scene
scene.add( cube );

// draw the sphare
var geometrySphere = new THREE.SphereGeometry(1, 15, 15)
var materialSphere = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.position.set(-1,0,1)
sphere.scale.set(0.5,0.5,0.5)
scene.add(sphere);

// add light to the seen to produce some shadow
const light = new THREE.PointLight(0xffffff, 2, 700)
light.position.set(10,-5,10)
scene.add(light)

// camera.position.z = 5;

const animate = function () {
  requestAnimationFrame( animate );


  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};


animate();
