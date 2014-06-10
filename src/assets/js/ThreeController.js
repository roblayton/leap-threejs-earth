define(['core/utils/Mapper', 'threejs', 'Leap', 'use!TrackballControls', 'TweenMax'], function(Mapper) {
	var ThreeController = function(container, options) {
		options = options || {};
		var scope = this;
		var callback = options.callbacks.onRender;
        var scene = options.scene || new THREE.Scene();

		// ------
		// Camera
		var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
        camera.target = new THREE.Vector3(0, 0, 0);
		camera.lookAt(camera.target);
		camera.position.set(0, 250, 700);
		var camRadius = 790;
		//var fov = camera.fov;

		var active = false;
		// ------
		// Renderer
		var renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		container.appendChild(renderer.domElement);
		// ------

		// Controls
		var controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.target.set(0, 0, 0);
		// ------

		// Canvas
		var canvas = container.getElementsByTagName('canvas')[0];
		var width = canvas.width;
		var height = canvas.height;
		// ------
		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set( - 1, - 1, - 1).normalize();

		light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 500, 0);
		light.castShadow = true;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;
		var d = 200;
		light.shadowCameraLeft = - d;
		light.shadowCameraRight = d;
		light.shadowCameraTop = d * 2;
		light.shadowCameraBottom = - d * 2;

		light.shadowCameraNear = 100;
		light.shadowCameraFar = 600;
		light.shadowCameraVisible = true;

		// Geometry
		var material, geometry, mesh;

		// Ground plane
		//material = new THREE.MeshBasicMaterial({
			//color: 0xffffff,
			//wireframe: true
		//});

		//geometry = new THREE.CubeGeometry(2300, 10, 2300);
		//mesh = new THREE.Mesh(geometry, material);
		//mesh.position.set(0, - 10, 0);
		//scene.add(mesh);

        var startFrame;
        var active = false;
        var curY;
		Leap.loop(function(frame) {
            options.callbacks.onRender(frame);

			// Camera
			if (!active) {
				startFrame = frame;
				active = true;
			} else {
				var f = startFrame.translation(frame);

				// Limit y-axis betwee 0 and 180 degrees
				curY = Mapper.map(f[1], - 300, 300, 0, 179);

				// Assign rotation coordinates
				rotateX = f[0];
				rotateY = -curY;

				var zoom = Math.max(0, f[2] + 200);
				var zoomFactor = 1 / (1 + (zoom / 150));
				// Adjust 3D spherical coordinates of the camera
				var newX = camRadius * Math.sin(rotateY * Math.PI / 180) * Math.cos(rotateX * Math.PI / 180);
				var newY = camRadius * Math.cos(rotateY * Math.PI / 180);
                var newZ = camRadius * Math.sin(rotateY * Math.PI / 180) * Math.sin(rotateX * Math.PI / 180);

                TweenMax.to(camera.position, 1, {
                    x: -newX,
                    y: newY,
                    z: -newZ
                });
				//camera.fov = fov * zoomFactor;
			}
		});

		var animate = function() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};

		animate();
	};

	return ThreeController;
});

