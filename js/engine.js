var container, stats;
var camera, scene, renderer;
var vrEffect;
var vrControls;
var mouseControls;
var headControls;
var controller;
var containerWidth, containerHeight;
var range = 50;

var mouse = new THREE.Vector2();
var cubes;
var controls = [];

init();
animate();

// leap motion controller
function initLeapMotion() { 
  window.controller = controller = new Leap.Controller({
    background: true
  });

  controller.use('transform', {
    vr: true,
    effectiveParent: camera
  });

  controller.use('boneHand', {
    scene: scene,
    arm: true
  });

  controller.on('frame', function(frame){
    var index = focusObject(frame, cubes);
    if(index != -1){
      for (var i = 0; i < cubes.children.length; i++) {
        cubes.children[i].material.color.setHex(0x000000);
      }
      cubes.children[index].material.color.setHex(0xff0000);
      controls.update(frame);
    }
  });

  controller.connect();
}

function init() {
  container = document.createElement( 'div' )
  document.body.appendChild( container );
  
  containerWidth = container.clientWidth;
  containerHeight = container.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
  camera.position.set( 0, 0, range * 2 );
  camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

  geom = new THREE.CubeGeometry( 5, 5, 5 );

  cubes = new THREE.Object3D();

  for(var i = 0; i < 100; i++ ) {
    var grayness = Math.random() * 0.5 + 0.25,
            mat = new THREE.MeshBasicMaterial(),
            cube = new THREE.Mesh( geom, mat );
    mat.color.setRGB( grayness, grayness, grayness );
    cube.position.set( range * (0.5 - Math.random()), range * (0.5 - Math.random()), range * (0.5 - Math.random()) );
    cube.rotation.set( Math.random(), Math.random(), Math.random() ).multiplyScalar( 2 * Math.PI );
    cube.grayness = grayness; // *** NOTE THIS
    cubes.add(cube);

    // leap object controls
    var control = new THREE.LeapObjectControls(camera, cube)

    control.rotateEnabled  = true;
    control.rotateSpeed    = 3;
    control.rotateHands    = 1;
    control.rotateFingers  = [2, 3];

    control.scaleEnabled   = true;
    control.scaleSpeed     = 3;
    control.scaleHands     = 1;
    control.scaleFingers   = [4, 5];

    control.panEnabled     = true;
    control.panSpeed       = 3;
    control.panHands       = 2;
    control.panFingers     = [6, 12];
    control.panRightHanded = false; // for left-handed person

    controls.push(control);
  }

  scene.add(cubes)

  initLeapMotion();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );

  var fullScreenButton = document.querySelector( '.full-screen' );
  var mouseLookButton = document.querySelector( '.mouse-look' );
  var mouseLook = false;

  fullScreenButton.onclick = function() {
    vrEffect.setFullScreen( true );
  };

  vrControls = new THREE.VRControls(camera);
  mouseControls = new THREE.MouseControls(camera);
  headControls = vrControls;

  mouseLookButton.onclick = function() {
    mouseLook = !mouseLook;

    if (mouseLook) {
      headControls = mouseControls;
      mouseLookButton.classList.add('enabled');
    } else {
      headControls = vrControls;
      mouseLookButton.classList.remove('enabled');
    }
  }

  vrEffect = new THREE.VREffect(renderer, VREffectLoaded);
  function VREffectLoaded(error) {
    if (error) {
      fullScreenButton.innerHTML = error;
      fullScreenButton.classList.add('error');
    }
  }

  renderer.setClearColor( 0xf0f0f0 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  vrEffect.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {
  camera.updateMatrixWorld();

  headControls.update();
  vrEffect.render( scene, camera );
}