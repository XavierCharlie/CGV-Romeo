import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

// set up the scene
// const scene = new THREE.Scene();
//
// // Add rectangle to the Scene
// const geometry = new THREE.BoxGeometry(10, 0.1, 10);
// const material = new THREE.MeshLambertMaterial({color: 0x70483c});
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(0, 0, 0);
// mesh.scale.set(20000,2000,20000)
//
// scene.add(mesh);
//
// //TREE
// let tree, dirt;
//
// //Set Up Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);
//
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
// directionalLight.position.set(10, 20, 0);
// scene.add(directionalLight);
//
// //Camera
// const width = 20;
// const height = width * (window.innerHeight / window.innerWidth);
// const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);
// camera.position.set(-9000,-2000,-9000);
// const camera = new THREE.OrthographicCamera(
//   width / -2, //LEFT
//   width / 2, //RIGHT
//   height / 2, //TOP
//   height / -2, //BOTTOM
//   1, // near
//   100 //far
// );

// camera.position.set(2000, 500, 1000);
// camera.lookAt(0, 0, 0);

//Renderer
// const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.render(scene, camera);
//
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.update();
//
// function loadGLTF(){
//   let treeLoader = new  THREE.GLTFLoader();
//
//   for (let i = 0; i < 20; i++){
//     treeLoader.load('./Models/birch_tree.gltf', (gltf) => {
//
//       tree = gltf.scene;
//       tree.position.set(i*600, 10, 0);
//       tree.scale.set(500,500,500)
//       scene.add(tree);
//     });
//   }

//   for (let i = 0; i < 20; i++){
//     treeLoader.load('./Models/birch_tree.gltf', (gltf) => {
//
//       tree = gltf.scene;
//       tree.position.set(-(i+4)*600, 10, 0);
//       tree.scale.set(500,500,500)
//       scene.add(tree);
//     });
//   }
//
//   for (let i = 0; i < 20; i++){
//     treeLoader.load('./Models/birch_tree.gltf', (gltf) => {
//
//       tree = gltf.scene;
//       tree.position.set(i*600, 10, 1000);
//       tree.scale.set(500,500,500)
//       scene.add(tree);
//     });
//   }
//
//   for (let i = 0; i < 20; i++){
//     treeLoader.load('./Models/birch_tree.gltf', (gltf) => {
//
//       tree = gltf.scene;
//       tree.position.set(-(i+4)*600, 10, 1000);
//       tree.scale.set(500,500,500)
//       scene.add(tree);
//     });
//   }
//
//   let grassLoader = new  THREE.GLTFLoader();
//
//   grassLoader.load('./Models/dirt.gltf', (gltf) => {
//
//       dirt = gltf.scene;
//       dirt.position.set(110, 0, 0);
//       dirt.scale.set(3000,3000,3000)
//       scene.add(dirt);
//   });
// }


// function init(){
//
//   document.body.appendChild(renderer.domElement);
//   let controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.addEventListener('change', renderer);
//   controls.minDistance = 500;
//   controls.maxDistance = 4500;
//
//   let materialArray = [];
//   let texture_ft = new THREE.TextureLoader().load( './Skybox/east.bmp');        //front
//   let texture_bk = new THREE.TextureLoader().load( './Skybox/west.bmp');      //back
//   let texture_up = new THREE.TextureLoader().load( './Skybox/up.bmp');         //up
//   let texture_dn = new THREE.TextureLoader().load( './Skybox/down.bmp');   //down
//   let texture_rt = new THREE.TextureLoader().load( './Skybox/north.bmp');   //right
//   let texture_lf = new THREE.TextureLoader().load( './Skybox/south.bmp');     //left
//
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
//   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
//
//   for (let i = 0; i < 6; i++)
//     materialArray[i].side = THREE.BackSide;
//   let skyboxGeo = new THREE.BoxGeometry( 30000, 30000, 30000);
//   let skybox = new THREE.Mesh( skyboxGeo, materialArray );
//   scene.add( skybox );
// }

//CHARACTER
/************************************************************Controller*********************************************************************/

class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};


class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();

    this._animations = {};
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();
  }

  /************************************************************Zombie*********************************************************************/

  _LoadModels() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('mremireh_o_desbiens.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);

        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.setPath('./resources/zombie/');
      loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('run.fbx', (a) => { _OnLoad('run', a); });
      loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
      loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
    });
  }

  get Position() {
    return this._position;
  }

  get Rotation() {
    if (!this._target) {
      return new THREE.Quaternion();
    }
    return this._target.quaternion;
  }

  Update(timeInSeconds) {
    if (!this._stateMachine._currentState) {
      return;
    }

    this._stateMachine.Update(timeInSeconds, this._input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }

    if (this._stateMachine._currentState.Name == 'dance') {
      acc.multiplyScalar(0.0);
    }

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    this._position.copy(controlObject.position);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
};

class BasicCharacterControllerInput {
  constructor() {
    this._Init();
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        break;
    }
  }
};


class FiniteStateMachine {
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
};


class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
    this._AddState('dance', DanceState);
  }
};


class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() {}
  Exit() {}
  Update() {}
};


class DanceState extends State {
  constructor(parent) {
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name() {
    return 'dance';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['dance'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.reset();
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._proxy._animations['dance'].action;

    action.getMixer().removeEventListener('finished', this._CleanupCallback);
  }

  Exit() {
    this._Cleanup();
  }

  Update(_) {
  }
};


class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'run') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (input._keys.shift) {
        this._parent.SetState('run');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['run'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'walk') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (!input._keys.shift) {
        this._parent.SetState('walk');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(_, input) {
    if (input._keys.forward || input._keys.backward) {
      this._parent.SetState('walk');
    } else if (input._keys.space) {
      this._parent.SetState('dance');
    }
  }
};


class ThirdPersonCamera {
  constructor(params) {
    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-15, 20, -30);
    idealOffset.applyQuaternion(this._params.target.Rotation);
    idealOffset.add(this._params.target.Position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(this._params.target.Rotation);
    idealLookat.add(this._params.target.Position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}


class ThirdPersonCameraDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 0.5  );
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 0.25);
    this._scene.add(light);

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './Skybox/east.bmp',
      './Skybox/west.bmp',
      './Skybox/up.bmp',
      './Skybox/down.bmp',
      './Skybox/north.bmp',
      './Skybox/south.bmp',
    ]);

    // function init(){
    //
    //   document.body.appendChild(renderer.domElement);
    //   let controls = new THREE.OrbitControls(camera, renderer.domElement);
    //   controls.addEventListener('change', renderer);
    //   controls.minDistance = 500;
    //   controls.maxDistance = 4500;
    //
    //   let materialArray = [];
    //   let texture_ft = new THREE.TextureLoader().load( './Skybox/east.bmp');        //front
    //   let texture_bk = new THREE.TextureLoader().load( './Skybox/west.bmp');      //back
    //   let texture_up = new THREE.TextureLoader().load( './Skybox/up.bmp');         //up
    //   let texture_dn = new THREE.TextureLoader().load( './Skybox/down.bmp');   //down
    //   let texture_rt = new THREE.TextureLoader().load( './Skybox/north.bmp');   //right
    //   let texture_lf = new THREE.TextureLoader().load( './Skybox/south.bmp');     //left
    //
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    //   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
    //
    //   for (let i = 0; i < 6; i++)
    //     materialArray[i].side = THREE.BackSide;
    //   let skyboxGeo = new THREE.BoxGeometry( 30000, 30000, 30000);
    //   let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    //   scene.add( skybox );
    // }

    texture.encoding = THREE.sRGBEncoding;
    this._scene.background = texture;
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0x70483c,
        }));

    plane.scale.set(2000, 2000, 2000);
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    /************************************************************TREES*********************************************************************/
    let treeLoader = new  GLTFLoader();

    for (let i = 0; i < 20; i++){
      treeLoader.load('./Models/birch_tree.gltf', (gltf) => {

      let  tree = gltf.scene;
        tree.position.set((i+2)*30, 0, 0);
        tree.scale.set(20,20,20)
        this._scene.add(tree);
      });
    }

    for (let i = 0; i < 10; i++){
      treeLoader.load('./Models/birch_tree.gltf', (gltf) => {

        let  tree = gltf.scene;
        tree.position.set((i+2)*30, 0, 100);
        tree.scale.set(20,20,20)
        this._scene.add(tree);
      });
    }

    for (let i = 0; i < 10; i++){
      treeLoader.load('./Models/birch_tree.gltf', (gltf) => {

        let  tree = gltf.scene;
        tree.position.set((i+2)*30, 0, 150);
        tree.scale.set(20,20,20)
        this._scene.add(tree);
      });
    }

    for (let i = 0; i < 10; i++){
      treeLoader.load('./Models/birch_tree.gltf', (gltf) => {

        let  tree = gltf.scene;
        tree.position.set(14, 0, (i+3)*30);
        tree.scale.set(20,20,20)
        this._scene.add(tree);
      });
    }

    /************************************************************DIRT*********************************************************************/

    // treeLoader.load('./Models/dirt.gltf', (gltf) => {
    //
    //   let  dirt = gltf.scene;
    //   dirt.position.set(100, 0.1, 10);
    //   dirt.scale.set(2000,2000,2000)
    //   this._scene.add(dirt);
    // });
    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    this._RAF();
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    }
    this._controls = new BasicCharacterController(params);

    this._thirdPersonCamera = new ThirdPersonCamera({
      camera: this._camera,
      target: this._controls,
    });
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }

    this._thirdPersonCamera.Update(timeElapsedS);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new ThirdPersonCameraDemo();
});


function _LerpOverFrames(frames, t) {
  const s = new THREE.Vector3(0, 0, 0);
  const e = new THREE.Vector3(100, 0, 0);
  const c = s.clone();

  for (let i = 0; i < frames; i++) {
    c.lerp(e, t);
  }
  return c;
}

function _TestLerp(t1, t2) {
  const v1 = _LerpOverFrames(100, t1);
  const v2 = _LerpOverFrames(50, t2);
  console.log(v1.x + ' | ' + v2.x);
}

_TestLerp(0.01, 0.01);
_TestLerp(1.0 / 100.0, 1.0 / 50.0);
_TestLerp(1.0 - Math.pow(0.3, 1.0 / 100.0),
    1.0 - Math.pow(0.3, 1.0 / 50.0));

// const animate = function () {
//   requestAnimationFrame( animate );
//   renderer.render(scene, camera);
//   controls.update();
// };
// init();
// loadGLTF();
// animate();

// document.body.appendChild(renderer.domElement);
