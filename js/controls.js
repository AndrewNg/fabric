var projector = new THREE.Projector();

function findObjects(frame, cubes) {
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
      init.rotateCamera();
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