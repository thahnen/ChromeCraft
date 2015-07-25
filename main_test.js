window.onload = function() {
  /* INIT */
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, viewportSize.getWidth() / viewportSize.getHeight(), 1, 10000);
  camera.position.set(10, 10, 25);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  var renderer = new THREE.WebGLRenderer({alpha : false});
  renderer.setSize(viewportSize.getWidth(), viewportSize.getHeight());
  document.body.appendChild(renderer.domElement);

  /* MAIN */
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

  if (DEBUG) {
    var bottom = new THREE.CubeGeometry(100, 1, 1);
    var cover = new THREE.MeshBasicMaterial({color : 0xf2ff00, wireframe : false});
    var x_achse = new THREE.Mesh(bottom, cover);
    scene.add(x_achse);
    x_achse.position.set(0 + 50, 0, 0);

    var bottom1 = new THREE.CubeGeometry(1, 100, 1);
    var cover1 = new THREE.MeshBasicMaterial({color : 0xff0015, wireframe : false});
    var y_achse = new THREE.Mesh(bottom, cover);
    scene.add(y_achse);
    y_achse.position.set(0, 0 + 50, 0);

    var bottom2 = new THREE.CubeGeometry(1, 1, 100);
    var cover2 = new THREE.MeshBasicMaterial({color : 0x3c00ff, wireframe : false});
    var z_achse = new THREE.Mesh(bottom, cover);
    scene.add(z_achse);
    z_achse.position.set(0, 0, 0 + 50);
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

  //EinseitigesBeispiel - Minecraft Cobblestone Block
  var cobble = new THREE.ImageUtils.loadTexture('/assets/cube/cobblestone.png');
  cobble.mapping = new THREE.UVMapping();
  cobble.wrapS = THREE.RepeatWrapping;
  cobble.wrapT = THREE.RepeatWrapping;
  cobble.magFilter = THREE.NearestFilter;
  cobble.minFilter = THREE.NearestMipMapLinearFilter;

  var cobblestone = new THREE.Mesh(
    new THREE.CubeGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({map : cobble})
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/cobblestone.png')}) //ohne Filter, unscharf
  );
  scene.add(cobblestone);
  cobblestone.position.set(5, 5, 0);

  //Mehrseitiges Beispiel - Minecraft Grass Block
  var oben = new THREE.ImageUtils.loadTexture('/assets/cube/grass_top.png');
  oben.mapping = new THREE.UVMapping();
  oben.wrapS = THREE.RepeatWrapping;
  oben.wrapT = THREE.RepeatWrapping;
  oben.magFilter = THREE.NearestFilter;
  oben.minFilter = THREE.NearestMipMapLinearFilter;
  var unten = new THREE.ImageUtils.loadTexture('/assets/cube/grass_bot.png');
  unten.mapping = new THREE.UVMapping();
  unten.wrapS = THREE.RepeatWrapping;
  unten.wrapT = THREE.RepeatWrapping;
  unten.magFilter = THREE.NearestFilter;
  unten.minFilter = THREE.NearestMipMapLinearFilter;
  var seite = new THREE.ImageUtils.loadTexture('/assets/cube/grass_side.png');
  seite.mapping = new THREE.UVMapping();
  seite.wrapS = THREE.RepeatWrapping;
  seite.wrapT = THREE.RepeatWrapping;
  seite.magFilter = THREE.NearestFilter;
  seite.minFilter = THREE.NearestMipMapLinearFilter;

  var materials = [
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_side.png')}),
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_side.png')}),
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_top.png')}), //oben
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_bot.png')}), //unten
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_side.png')}),
    //new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture('/assets/cube/grass_side.png')})
    new THREE.MeshBasicMaterial({map : seite}),
    new THREE.MeshBasicMaterial({map : seite}),
    new THREE.MeshBasicMaterial({map : oben}), //oben
    new THREE.MeshBasicMaterial({map : unten}), //unten
    new THREE.MeshBasicMaterial({map : seite}),
    new THREE.MeshBasicMaterial({map : seite})
  ];
  var grass = new THREE.Mesh(
    new THREE.CubeGeometry(5, 5, 5),
    new THREE.MeshFaceMaterial(materials)
  );
  scene.add(grass);

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
  /*
  Mousetrap.bind('w', function() { //ab hier wohl fehlerhaft, nicht richtig!
    camera.position.z -= 5;
  }, 'keypress');
  Mousetrap.bind('a', function() {
    camera.position.x -= 5;
  }, 'keypress');
  Mousetrap.bind('s', function() {
    camera.position.z += 5;
  }, 'keypress');
  Mousetrap.bind('d', function() {
    camera.position.x += 5;
  }, 'keypress');
  Mousetrap.bind(['w+a', 'a+w'], function() {
    camera.position.x -= 5;
    camera.position.z -= 5;
  });
  Mousetrap.bind(['s+d', 'd+s'], function() {
    camera.position.x += 5;
    camera.position.z += 5;
  });
  Mousetrap.bind(['w+d', 'd+w'], function() {
    camera.position.x -= 5;
    camera.position.z += 5;
  });
  Mousetrap.bind(['s+a', 'a+s'], function() {
    camera.position.x += 5;
    camera.position.z -= 5;
  });
  */

  var camControls = new THREE.FirstPersonControls(camera); //oder eigene Controls machen wenn PointerLock nicht klappt
  camControls.lookSpeed = 0.5;
  camControls.movementSpeed = 20;
  camControls.noFly = true;
  camControls.lookVertical = true;
  camControls.constrainVertical = true;
  camControls.verticalMin = 1.0;
  camControls.verticalMax = 2.0;
  camControls.lon = -150;
  camControls.lat = 120;

  document.onclick = function(e) { //klappt nicht
    e.preventDefault();
  };

  var n = 0;
  var clock = new THREE.Clock();

  function draw() {
    var delta = clock.getDelta();
    meter.tickStart();
    renderer.render(scene, camera);

    camControls.update(delta);

    requestAnimationFrame(draw);

    meter.tick();
  }

  draw();
};
