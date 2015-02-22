var container, stats;
var camera, scene, renderer;
var vrEffect;
var vrControls;
var mouseControls;
var headControls;
var controller;
var theta = Math.PI;

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
    var intersects = findObjects(frame, cubes);
    for (var i = 0; i < cubes.children.length; i++) {
      var grayness = cubes.children[i].grayness
      cubes.children[i].material.color.setRGB(grayness, grayness, grayness );
    }
    for (var i = 0; i < intersects.length; i++) {
      var obj = intersects[i].object;
      console.log(obj);
      obj.material.color.setHex(0xff0000);
      controls[obj.id].update(frame);
    }
  });

  controller.connect();
}

function init() {
  container = document.createElement( 'div' )
  document.body.appendChild( container );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;
  camera.lookAt( scene.position );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  var geom = new THREE.BoxGeometry( 50, 50, 50 );

  cubes = new THREE.Object3D()

  for(var i = 0; i < 1; i++ ) {
    var grayness = Math.random() * 0.5 + 0.25;
    var mat = new THREE.MeshBasicMaterial();
    mat.color.setRGB( grayness, grayness, grayness );
    var cube = new THREE.Mesh( geom, mat );

    cube.position.x = -10;
    cube.position.y = -10;
    cube.position.z = -10;

    cube.scale.x = 1;
    cube.scale.y = 1;
    cube.scale.z = 1;

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

    controls[cube.id] = control;
    console.log(controls);
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