window.onload = function() {
  var blocker = document.getElementById('blocker');
	var menu = document.getElementById('menu');

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	if (havePointerLock) {
		var element = document.body;

		var pointerlockchange = function (event) {
			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
				controlsEnabled = true;
				controls.enabled = true;
				blocker.style.display = 'none';
			} else {
				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				menu.style.display = '';
			}
		};

		var pointerlockerror = function ( event ) {
			menu.style.display = '';
		};

		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		menu.addEventListener( 'click', function ( event ) {
		  menu.style.display = 'none';
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {
					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
						element.requestPointerLock();
					}
				};

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
				element.requestFullscreen();
			} else {
				element.requestPointerLock();
			}
		}, false );
	} else {
		menu.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	var controlsEnabled = false;
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var prevTime = performance.now();
	var velocity = new THREE.Vector3();

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, viewportSize.getWidth() / viewportSize.getHeight(), 1, 10000);
  camera.position.set(10, 10, 25);
  //camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  var controls = new THREE.PointerLockControls(camera);
  scene.add(controls);

  var onKeyDown = function(event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
			if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};

	var onKeyUp = function(event) {
		switch(event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10);

  var renderer = new THREE.WebGLRenderer({alpha : false});
  renderer.setClearColor(0x00ff19);
  renderer.setSize(viewportSize.getWidth(), viewportSize.getHeight());
  document.body.appendChild(renderer.domElement);

  function onWindowResize() {
    camera.aspect = viewportSize.getWidth()/viewportSize.getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(viewportSize.getWidth(), viewportSize.getHeight());
  }

  window.addEventListener('resize', onWindowResize, false);

  var DEBUG = false, BODEN = true;
  if (BODEN) {
    var _boden = new THREE.ImageUtils.loadTexture('/assets/skybox/unten.png');
    _boden.mapping = new THREE.UVMapping();
    _boden.wrapS = THREE.RepeatWrapping;
    _boden.wrapT = THREE.RepeatWrapping;
    _boden.magFilter = THREE.NearestFilter;
    _boden.minFilter = THREE.NearestMipMapLinearFilter;
    var boden = new THREE.Mesh(
      new THREE.CubeGeometry(128, 1, 128),
      new THREE.MeshBasicMaterial({map : _boden})
    );
    scene.add(boden);
    boden.position.set(0 + 64, 0, 0 + 64);
  }
  //Skybox
  var cubemap = THREE.ImageUtils.loadTextureCube([
    '/assets/skybox/rechts.png',
    '/assets/skybox/links.png',
    '/assets/skybox/oben.png',
    '/assets/skybox/unten.png',
    '/assets/skybox/vorne.png',
    '/assets/skybox/hinten.png'
  ]);
  cubemap.format = THREE.RGBFormat;
  var shader = THREE.ShaderLib['cube'];
  shader.uniforms['tCube'].value = cubemap;
  var skyBoxMaterial = new THREE.ShaderMaterial( {
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  var skybox = new THREE.Mesh(
    new THREE.CubeGeometry(1000, 1000, 1000),
    skyBoxMaterial
  );
  scene.add(skybox);
  skybox.position.set(0, 470, 0);

  var meter = new FPSMeter({
    interval: 500,
    show: "fps",
    maxFps: 100,
    theme: "transparent"
  });

  Mousetrap.bind('esc', function(e) { //noch nicht ganz schön gelöst :D vielleicht auch backspace oder so
    if (e.preventDefault) {
      e.preventDefault();
    }
    window.close();
  }, 'keyup');

  var n = 0;
  var clock = new THREE.Clock();

  function draw() {
    var delta = clock.getDelta();
    meter.tickStart();
    renderer.render(scene, camera);

    requestAnimationFrame(draw);

    meter.tick();
  }

  draw();
};
