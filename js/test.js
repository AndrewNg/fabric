var mesh;
var geom = new THREE.Boxgeom( 100, 100, 100 );
var material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true } );

// construct 8 blend shapes

for ( var i = 0; i < geom.vertices.length; i ++ ) {

  var vertices = [];

  for ( var v = 0; v < geom.vertices.length; v ++ ) {

    vertices.push( geom.vertices[ v ].clone() );

    if ( v === i ) {

      vertices[ vertices.length - 1 ].x *= 2;
      vertices[ vertices.length - 1 ].y *= 2;
      vertices[ vertices.length - 1 ].z *= 2;

    }

  }

  geom.morphTargets.push( { name: "target" + i, vertices: vertices } );

}

mesh = new THREE.Mesh( geom, material );

scene.add( mesh );

function morphVertex(val){
  mesh.morphTargetInfluences[0] = val;
}