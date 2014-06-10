define(function() {
    var Earth = function(options) {
        var scope = this;
        var scene = options.scene;

		var loader = new THREE.JSONLoader(true);
		loader.load("assets/models/earth.js", function(geometry) {
            var material = new THREE.MeshBasicMaterial( { color: 0x0099cc, wireframe: true } );
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
            mesh.scale.set(15, 15, 15);
            mesh.position.set(0, 0, 0);
            scene.add(mesh)
        });
    };

    return Earth;
});
