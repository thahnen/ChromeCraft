window.onload = function() {
  Mousetrap.bind('backspace', function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    window.close();
  }, 'keyup');

  Mousetrap.bind('esc', function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    document.exitPointerLock =
      document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
    document.exitPointerLock();
  });

  function onDocumentMouseDown(event) {
    if (event.button !== 0)
      return;
    document.body.requestPointerLock =
      document.body.requestPointerLock ||
      document.body.mozRequestPointerLock ||
      document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
  }

  document.body.addEventListener('click', onDocumentMouseDown, false);

  document.body.requestPointerLock =
    document.body.requestPointerLock ||
    document.body.mozRequestPointerLock ||
    document.body.webkitRequestPointerLock;
  document.body.requestPointerLock(); //bei Autostart PointerLock! :)
  
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
  scene.add(controls.getObject());

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

  Mousetrap.bind('q', function(e) { //noch nicht ganz schön gelöst :D vielleicht auch backspace oder so
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