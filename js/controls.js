var projector = new THREE.Projector();

function findObjects(frame, cubes) {
  var hl = frame.hands.length;
  var fl = frame.fingers.filter(function(f){return f.extended}).length;;
  var intersects = [];

  if (hl == 1 && fl == 1) {
    var f = frame.pointables[0];
    var cont = $(renderer.domElement);
    var coords = transform(f.tipPosition, cont.width(), cont.height());
    var vpx = (coords[0]/cont.width())*2 - 1;
    var vpy = -(coords[1]/cont.height())*2 + 1;
    var vector = new THREE.Vector3(vpx, vpy, 0.5);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    console.log(camera.position);
    console.log(vector.sub(camera.position).normalize());
    console.log(cubes.children.length);
    intersects = raycaster.intersectObjects(cubes.children);
  };

  return intersects;
};

function transform(tipPosition, w, h) {
  var width = 150;
  var height = 150;
  var minHeight = 100;

  var ftx = tipPosition[0];
  var fty = tipPosition[1];
  ftx = (ftx > width ? width - 1 : (ftx < -width ? -width + 1 : ftx));
  fty = (fty > 2*height ? 2*height - 1 : (fty < minHeight ? minHeight + 1 : fty));
  var x = THREE.Math.mapLinear(ftx, -width, width, 0, w);
  var y = THREE.Math.mapLinear(fty, 2*height, minHeight, 0, h);
  return [x, y];
};