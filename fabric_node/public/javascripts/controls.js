var projector = new THREE.Projector();
var containerDepth = 200;

function scale(frame, object, prev) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;

  if (hl == 1 && fl == 4 && prev != null) {
    var cont = $(renderer.domElement);
    var fromZ = transform(prev, cont.width(), cont.height())[2];
    var f = frame.pointables[0];
    var toZ = transform(f.tipPosition, cont.width(), cont.height())[2];

    var k = Math.pow(2, (toZ - fromZ) / 50);
  
    console.log("scale object from: to: using: ");
    console.log(object.scale);
    scaleObject(object, k);
    console.log(object.scale);
    console.log(k);
    return true;
  }

  return false;
}

function translation(frame, object, prev) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;

  if (hl == 1 && fl == 2 && prev != null) {
    var cont = $(renderer.domElement);
    var fromCoords = transform(prev, cont.width(), cont.height());

    var f = frame.pointables[0];
    var toCoords = transform(f.tipPosition, cont.width(), cont.height());

    var vector = new THREE.Vector3(toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1], toCoords[2] - fromCoords[2]);
  
    console.log("translate object from: to: using: ");
    console.log(object.position);
    translateObject(object, vector.normalize().multiplyScalar(5));
    console.log(object.position);
    console.log(vector.normalize().multiplyScalar(5));
    return true;
  }

  return false;
}

function rotation(frame, object, prev) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;

  // if (hl == 1 && fl == 4 && prev != null) {
  //   console.log("rotation");
  //   rotateObject(object, 2);
  //   return true;
  // }

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
  var minWidth = -0.2;
  var maxWidth = 0.2;
  var maxHeight = 0.2;
  var minHeight = -0.4;
  var minDepth = 99.5;
  var maxDepth = 100;
  var d = containerDepth;

  var ftx = tipPosition[0];
  var fty = tipPosition[1];
  var ftz = tipPosition[2];
  ftx = (ftx > maxWidth ? maxWidth - 0.001 : (ftx < minWidth ? minWidth + 0.001 : ftx));
  fty = (fty > maxHeight ? maxHeight - 0.001 : (fty < minHeight ? minHeight + 0.001 : fty));
  ftz = (ftz > maxDepth ? maxDepth - 0.001 : (ftz < minDepth ? minDepth + 0.001 : ftz));
  var x = THREE.Math.mapLinear(ftx, minWidth, maxWidth, 0, w);
  var y = THREE.Math.mapLinear(fty, minHeight, maxHeight, 0, h);
  var z = THREE.Math.mapLinear(ftz, minDepth, maxDepth, 0, d);
  return [x, y, z];
};

function translateObject(obj, vector){
  obj.translateX(vector.x);
  obj.translateY(vector.y);
  obj.translateZ(vector.z);
}

var morphVertex = function(obj, vertex, val){
  obj.morphTargetInfluences[vertex] = val;
}

var scaleObject = function(obj, val){
  var scale = obj.scale;
  scale = scale.multiplyScalar(val);
  obj.scale.set(scale.x,scale.y,scale.z);
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