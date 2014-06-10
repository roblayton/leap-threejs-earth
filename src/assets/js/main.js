require(['core/utils/FpsTracker', 'dom/primitives/Container', 'proj/ThreeController', 'proj/GestureController', 'proj/OutputText', 'proj/Earth', 'proj/Ring', 'threejs'], function(FpsTracker, Container, ThreeController, GestureController, OutputText, Earth, Ring) {
	var Master = function() {

		// Scene
		var scene = new THREE.Scene();

		var init = function() {
			// Fps
			var fps = new FpsTracker();

			var container = new Container({
				insert: {
					type: 'parent',
					target: document.body
				}
			});

            var gc = new GestureController({
                callbacks: {
                    //h1f1: function() {
                        //ot.show('pointing');
                    //},
                    //h1f2: function() {
                        //ot.show('scissors');
                    //},
                    //h1f5: function() {
                        //ot.show('paper');
                    //},
                    //h1f0: function() {
                        //ot.show('rock');
                    //}
               },
                //renderHand: true,
                scene: scene
            });
            var ot = new OutputText();

            var e = new Earth({
                scene: scene
            });

            var r = new Ring({
                scene: scene,
                radius: 400,
                tubeRadius: 0.42,
                radialSegments: 30,
                tubularSegments: 30,
                rotation: 90
            });

            var r2 = new Ring({
                scene: scene,
                radius: 200,
                tubeRadius: 0.42,
                radialSegments: 30,
                tubularSegments: 30,
                rotation: 0
            });

            var r3 = new Ring({
                scene: scene,
                radius: 200,
                tubeRadius: 2.42,
                radialSegments: 30,
                tubularSegments: 30,
                rotation: 45
            });

			var tc = new ThreeController(container.el, {
				callbacks: {
					onRender: function(frame) {
						fps.update();
                        gc.readFrame(frame);
                        r.rotation.x += 0.01;
                        r2.rotation.x += 0.01;
                        r3.rotation.y += 0.01;
					}
				},
                scene: scene
			});
		};

		init();

	}; // End
	var master = new Master();
});

