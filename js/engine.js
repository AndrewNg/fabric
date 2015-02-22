var container, stats;
var camera, scene, raycaster, renderer;
var vrEffect;
var vrControls;
var mouseControls;
var headControls;
var controller;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var objects = [];

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  var geometry = new THREE.BoxGeometry( 20, 20, 20 );

  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;

  object.rotation.x = Math.PI;
  object.rotation.y = Math.PI;
  object.rotation.z = Math.PI;

    // leap object controls
  var objectControls = new THREE.LeapObjectControls(camera, object);

  objectControls.rotateEnabled  = true;
  objectControls.rotateSpeed    = 3;
  objectControls.rotateHands    = 1;
  objectControls.rotateFingers  = [2, 3];

  objectControls.scaleEnabled   = true;
  objectControls.scaleSpeed     = 3;
  objectControls.scaleHands     = 1;
  objectControls.scaleFingers   = [4, 5];

  objectControls.panEnabled     = true;
  objectControls.panSpeed       = 3;
  objectControls.panHands       = 2;
  objectControls.panFingers     = [6, 12];
  objectControls.panRightHanded = false; // for left-handed person

  objects.push(object);
  scene.add( object );

  theta = Math.PI;

  camera.position.x = -100;
  camera.position.y = 0;
  camera.position.z = -100;

  camera.lookAt( object.position );

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
    var index = focusObject(frame, objects);
    if(index != -1){
      objectControls.update(frame);
    }
  });

  controller.connect();

  // var trackHand = function(hand){
  //   var handMesh = hand.data('riggedHand.mesh');
  //   console.log(handMesh.position.x);
  // };

  // controller.on('hand', trackHand);

  raycaster = new THREE.Raycaster();

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

  // find intersections

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  headControls.update();
  vrEffect.render( scene, camera );
}