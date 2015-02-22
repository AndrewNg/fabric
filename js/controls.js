var projector = new THREE.Projector();

function translation(frame, object, prev) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;
  console.log('translate?');
  console.log(hl);
  console.log(fl);
  console.log(prev);

  if (hl == 1 && fl == 2 && prev != null) {
    console.log("translation");

    var cont = $(renderer.domElement);
    var fromCoords = transform(prev, cont.width(), cont.height());

    var f = frame.pointables[0];
    var toCoords = transform(f.tipPosition, cont.width(), cont.height());

    var vector = new THREE.Vector3(toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1], 0);
  

    translateObject(object, vector);
    return true;
  }

  return false;
}

function rotation(frame, object) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;

  if (hl == 1 && fl == 4) {
    console.log("rotation");
    rotateObject(object, 2);
    return true;
  }

  return false;
}

function selector(frame, cubes) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;
  var intersects = [];

  if (hl == 1 && fl == 1) {
    var f = frame.pointables[0];
    var cont = $(renderer.domElement);
    var coords = transform(f.tipPosition, cont.width(), cont.height());
    var vector = new THREE.Vector3();
    vector.x = (coords[0]/cont.width())*2 - 1;
    vector.y = 1 - (coords[1]/cont.height())*2;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( vector.clone(), camera ); 
    intersects = raycaster.intersectObjects(cubes.children);

    if(pinchStrength > 0.3){
      // init.rotateCamera();
    }
  };

  return intersects;
};

function transform(tipPosition, w, h) {
  var width = 0.2;
  var maxHeight = 0.2;
  var minHeight = -0.4;

  var ftx = tipPosition[0];
  var fty = tipPosition[1];
  ftx = (ftx > width ? width - 0.001 : (ftx < -width ? -width + 0.001 : ftx));
  fty = (fty > maxHeight ? maxHeight - 0.001 : (fty < minHeight ? minHeight + 0.001 : fty));
  var x = THREE.Math.mapLinear(ftx, -width, width, 0, w);
  var y = THREE.Math.mapLinear(fty, minHeight, maxHeight, 0, h);
  return [x, y];
};

var morphVertex = function(obj, vertex, val){
  obj.morphTargetInfluences[vertex] = val;
}

var scaleObject = function(obj, val){
  obj.scale.set(val,val,val);
}

var rotateObject = function(obj, axis){
  var rotObjectMatrix;
  function rotateAroundObjectAxis(object, axis, radians) {
      rotObjectMatrix = new THREE.Matrix4();
      rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

      object.matrix.multiply(rotObjectMatrix);

      object.rotation.setFromRotationMatrix(object.matrix);
  }

  var rotWorldMatrix;
  // Rotate an object around an arbitrary axis in world space       
  function rotateAroundWorldAxis(object, axis, radians) {
      rotWorldMatrix = new THREE.Matrix4();
      rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

      rotWorldMatrix.multiply(object.matrix);

      object.matrix = rotWorldMatrix;
      object.rotation.setFromRotationMatrix(object.matrix);
  }

  // x axis, y axis, and z axis
  var axes = [(new THREE.Vector3(1,0,0)), (new THREE.Vector3(0,1,0)), (new THREE.Vector3(0,0,1))];

  rotateAroundWorldAxis(obj, axes[axis], Math.PI / 180);
}

var zoomCamera = function(){
  var zoomFactor = 1.0, inc = 0.1; 
  while(zoomFactor < 2){
    // setTimeout(function(){
    //   camera.fov *= zoomFactor;
    //   camera.updateProjectionMatrix();
    //   zoom += inc;
    // }, 10);
  }
}

var rotateCamera = function(){
  camera.rotation.y = 90 * Math.PI / 180;
}