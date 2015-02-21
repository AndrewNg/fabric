  // Including this in the footer so that the bone hand plugin can create its canvas on the body

  //
  // CREATE THE SCENE
  //
  //

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  var canvas = document.getElementById('scene');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, false);

  // add cube
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 2;

  //
  // ADD LEAP MOTION
  //
  //

  // Connect to localhost and start getting frames
  Leap.loop({

    hand: function(hand){
      console.log( hand.screenPosition() );
    }

  }).use('screenPosition');

  // Docs: http://leapmotion.github.io/leapjs-plugins/main/transform/
  Leap.loopController.use('transform', {

    // This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
    vr: true,

    // This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
    // The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
    // (As the hands will usually interact with multiple objects in the scene.)
    effectiveParent: camera

  });

  // Docs: http://leapmotion.github.io/leapjs-plugins/main/bone-hand/
  Leap.loopController.use('boneHand', {

    // If you already have a scene or want to create it yourself, you can pass it in here
    // Alternatively, you can pass it in whenever you want by doing
    // Leap.loopController.plugins.boneHand.scene = myScene.
    scene: scene,

    // Display the arm
    arm: true

  });



  //
  // ADD VIRTUAL REALITY
  //
  //

  // Moves (translates and rotates) the camera
  var vrControls = new THREE.VRControls(camera);

  var vrEffect = new THREE.VREffect(renderer);


  var onkey = function(event) {
    if (event.key === 'z') {
      vrControls.zeroSensor();
    }
    if (event.key === 'f') {
      return vrEffect.setFullScreen(true);
    }
  };

  window.addEventListener("keypress", onkey, true);



  //
  // MAKE IT GO
  //
  //

  var render = function() {
    vrControls.update();
    vrEffect.render(scene, camera);

    requestAnimationFrame(render);
  };

  render();


  //
  // Add a debug message Real quick
  // Prints out when receiving oculus data.
  //
  //

  var receivingPositionalData = false;
  var receivingOrientationData = false;

  var timerID = setInterval(function(){

    if (camera.position.x !== 0 && !receivingPositionalData){
      receivingPositionalData = true;
      console.log("receiving positional data");
    }

    if (camera.quaternion.x !== 0 && !receivingOrientationData){
      receivingOrientationData = true;
      console.log("receiving orientation data");
    }

    if (receivingOrientationData && receivingPositionalData){
      clearInterval(timerID);
    }

  }, 2000);