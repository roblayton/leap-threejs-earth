define(function() {
    var Ring = function(options) {
        var scope = this;
        var scene = options.scene;

            var geometry	= new THREE.TorusGeometry(options.radius, options.tubeRadius, options.radialSegments, options.tubularSegments); 
			var customMaterial = new THREE.ShaderMaterial( 
				{
				    uniforms: {  },
					vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
					side: THREE.BackSide,
					blending: THREE.AdditiveBlending,
					transparent: true,
                    wireframe: true,
                    color: 0x0099cc
				}   );
            var mesh = new THREE.Mesh(geometry, customMaterial);
            mesh.position.set(0, 0, 0);
            mesh.rotation.x = options.rotation;
            scene.add(mesh);
            return mesh;
    };

    return Ring;
});
