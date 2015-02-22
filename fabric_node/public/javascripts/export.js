// in this i'll export a basic triangle to STL and send it to the server for handling

var data = {};
var loadGeoFromJSON;
var cubeJSON;
var modelCount = 0;

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function render() {
//   requestAnimationFrame( render );
//   cube.rotation.x += 0.1;
//   cube.rotation.y += 0.1;
//   renderer.render( scene, camera );
// }

// render();

function exportGeometry(geo) {
  var STLFile = generateSTL(geo);
  // cubeJSON = geo.toJSON();
  // var formatCubeJSON = JSON.stringify( cubeJSON, null, '\t' );
  // formatCubeJSON = formatCubeJSON.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

  data.stl = STLFile;
  // data.json = formatCubeJSON;

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/export',
    success: function(data) {
      console.log("success!");
      modelCount = data;
    },
    error: function(xhr) {
      console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText);
    }
  });
}

function loadFromSTL() {
  var loader = new THREE.STLLoader();
   loader.load( '/javascripts/' + modelCount + '.stl', function ( geometry ) {
     scene.add( new THREE.Mesh( geometry ) );
   });
}