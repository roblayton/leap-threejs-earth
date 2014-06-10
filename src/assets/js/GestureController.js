define(['dom/primitives/Elem'], function(Elem) {
    var GestureController = function(options) {
        var scope = this;

        var timer;

        var geometry, material;

        if (options.renderHand) {
            var scene = options.scene || new THREE.Scene();
            if (!scene) {
                throw new Error('Must supply a scene');
            }

            // Palm		
            geometry = new THREE.CubeGeometry(100, 20, 80);
            material = new THREE.MeshNormalMaterial({
                wireframe: true
            });

            //material.opacity = 0.5;
            var palm = new THREE.Mesh(geometry, material);
            scene.add(palm);

            // Fingers		
            var fingers = [];
            geometry = new THREE.CubeGeometry(16, 12, 1);
            for (var i = 0; i < 5; i++) {
                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                fingers.push(mesh);
            }
        };

		var startTimer = function(callback) {
            clearTimeout(timer);
			setTimeout(function() {
                if (!isOffscreen) {
                    callback();
                }
			}, 1000);
		};

        var isOffscreen = true;
        var gesture, lastGesture;

        this.readFrame = function(frame) {
            var hCount = frame.hands.length;
            var fCount = frame.pointables.length;

            gesture = 'h' + hCount + 'f' + fCount;

            if (!hCount) {
                clearTimeout(timer);
                isOffscreen = true;
            } else {
                isOffscreen = false;
            }

            var callback = options.callbacks[gesture];
            if (gesture != lastGesture && callback) {
                lastGesture = gesture;

                if (callback) {
                    startTimer(function() {
                        callback()
                    });
                }
            }

            if (options.renderHand) {
                if (hCount > 0) {
                    hand = frame.hands[0];
                    palm.position.set(hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2]);
                    direction = v(hand.direction[0], hand.direction[1], hand.direction[2]); // best so far
                    palm.lookAt(direction.add(palm.position));
                    palm.rotation.z = - hand.roll();
                    palm.rotation.set(hand.pitch(), - hand.yaw(), hand.roll());
                    palm.visible = true;
                } else {
                    palm.visible = false;
                }

                var i;
                if (fCount > 0) {
                    var pointable;
                    palm.hasFingers = true;
                    for (i = 0; i < 5; i++) {
                        finger = fingers[i];
                        if (i < fCount) {
                            pointable = frame.pointables[i];
                            finger.position.set(pointable.stabilizedTipPosition[0], pointable.stabilizedTipPosition[1], pointable.stabilizedTipPosition[2]);
                            direction = v(pointable.direction[0], pointable.direction[1], pointable.direction[2]);
                            finger.lookAt(direction.add(finger.position));
                            finger.scale.z = pointable.length;
                            finger.visible = true;
                        } else {
                            finger.visible = false;
                        }
                    }
                } else if (palm.hasFingers) {
                    for (i = 0; i < 5; i++) {
                        fingers[i].visible = false;
                    }
                    palm.hasFingers = false;
                }
            }
        };

		var v = function(x, y, z) {
			return new THREE.Vector3(x, y, z);
		};
    };

    return GestureController;
});
