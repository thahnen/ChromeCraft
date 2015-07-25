/*
  * Es ist nicht meins :( Das muss ich noch implementieren :D
  * mit esc wird Maus nicht freigelassen :(
  * Fensterschluss muss mit q erzwungen werden
  * Scheiss (X|Y|Z) Format, d.h. Y entspricht der Höhe :(
*/

(function() {
  
  var clock;
  var meter;
  var scene, camera, renderer;
  var geometry, material, mesh;
  var havePointerLock = checkForPointerLock();
  var controls, controlsEnabled;
  var moveForward,
      moveBackward,
      moveLeft,
      moveRight,
      canJump;
  var velocity = new THREE.Vector3();
  
  var grass;
  
  var com = com || {};
  com.minecraft = com.minecraft || {};
  
  com.minecraft.main = function() {
    init();
    animate();
  };
  com.test = function() {
    console.log("Test");
  };
  
  com.minecraft.main();
  
  function init() {
    
    initControls();
    initPointerLock();

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb2e1f2, 0, 750);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 10;

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    
    // FPS Meter
    meter = new FPSMeter({
      interval: 500,
      show: "fps",
      maxFps: 100,
      theme: "transparent"
    });

    // Floor
    scene.add(createFloor());
    createObjects();
    
    //Block und Item können nicht in com.minecraft.Block bsp sein weil com.minecraft.? hierher stammt :/
    var tBlock = new src.minecraft.Block(scene, new THREE.Vector3(20, 25, 10), ["/assets/cube/grass_side.png"]);
    console.log(tBlock);
    var tItem = new src.minecraft.Item(null, null);
    console.log(tItem);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xb2e1f2);
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    meter.tickStart();
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
    meter.tick();
  }

  function createFloor() {
    /*geometry = new THREE.PlaneGeometry(2000, 2000, 5, 5);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    var texture = THREE.ImageUtils.loadTexture('assets/skybox/unten.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(64, 64);
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
    return new THREE.Mesh(geometry, material);
    */
    var floor_geometry = new THREE.PlaneGeometry(1000, 1000, 5, 5);
    floor_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    var floor_texture = THREE.ImageUtils.loadTexture("assets/cube/cobblestone.png");
    floor_texture.mapping = THREE.UVMapping();
    floor_texture.wrapS = THREE.RepeatWrapping;
    floor_texture.wrapT = THREE.RepeatWrapping;
    floor_texture.magFilter = THREE.NearestFilter;
    floor_texture.minFilter = THREE.NearestMipMapLinearFilter;
    floor_texture.repeat.set(128, 128);
    var floor = new THREE.Mesh(
      floor_geometry,
      new THREE.MeshBasicMaterial({map : floor_texture})
    );
    return floor;
  }
  
  function createObjects() {
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
    
    //Einseitiges Beispiel - Minecraft Cobblestone Block
    var cobble = new THREE.ImageUtils.loadTexture('/assets/cube/cobblestone.png');
    cobble.mapping = new THREE.UVMapping();
    cobble.wrapS = THREE.RepeatWrapping;
    cobble.wrapT = THREE.RepeatWrapping;
    cobble.magFilter = THREE.NearestFilter;
    cobble.minFilter = THREE.NearestMipMapLinearFilter;
  
    var cobblestone = new THREE.Mesh(
      new THREE.CubeGeometry(10, 10, 10),
      new THREE.MeshBasicMaterial({map : cobble})
    );
    scene.add(cobblestone);
    cobblestone.position.set(10, 5, 10);
    
    // Einseitiges Beispiel - Minecraft Stone Block
    var stone_texture = new THREE.ImageUtils.loadTexture("/assets/cube/stone.png");
    stone_texture.mapping = new THREE.UVMapping();
    stone_texture.wrapS = THREE.RepeatWrapping;
    stone_texture.wrapT = THREE.RepeatWrapping;
    stone_texture.magFilter = THREE.NearestFilter;
    stone_texture.minFilter = THREE.NearestMipMapLinearFilter;
  
    var stone = new THREE.Mesh(
      new THREE.CubeGeometry(10, 10, 10),
      new THREE.MeshBasicMaterial({map : stone_texture})
    );
    scene.add(stone);
    stone.position.set(20, 5, 10);
  
    //Mehrseitiges Beispiel - Minecraft Grass Block
    var oben = new THREE.ImageUtils.loadTexture('/assets/cube/grass_top.png');
    oben.mapping = new THREE.UVMapping();
    oben.wrapS = THREE.RepeatWrapping;
    oben.wrapT = THREE.RepeatWrapping;
    oben.magFilter = THREE.NearestFilter;
    oben.minFilter = THREE.NearestMipMapLinearFilter;
    var unten = new THREE.ImageUtils.loadTexture('/assets/cube/dirt.png');
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
      new THREE.MeshBasicMaterial({map : seite}),
      new THREE.MeshBasicMaterial({map : seite}),
      new THREE.MeshBasicMaterial({map : oben}), //oben
      new THREE.MeshBasicMaterial({map : unten}), //unten
      new THREE.MeshBasicMaterial({map : seite}),
      new THREE.MeshBasicMaterial({map : seite})
      ];
    grass = new THREE.Mesh(
      new THREE.CubeGeometry(10, 10, 10),
      new THREE.MeshFaceMaterial(materials)
    );
    scene.add(grass);
    grass.position.set(10, 15, 10);
  }

  function checkForPointerLock() {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  }
  
  function initPointerLock() {
    var element = document.body;
    if (havePointerLock) {
      var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || 
            document.mozPointerLockElement === element || 
            document.webkitPointerLockElement === element) {
          controlsEnabled = true;
          controls.enabled = true;
        } else {
          controls.enabled = false;
        }
      };

      var pointerlockerror = function (event) {
        element.innerHTML = 'PointerLock Error';
      };

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      var requestPointerLock = function(event) {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
      };

      element.addEventListener('click', requestPointerLock, false);
    } else {
      element.innerHTML = 'Bad browser; No pointer lock';
    }
  }
  
  Mousetrap.bind('q', function(e) { //noch nicht ganz schön gelöst :D vielleicht auch backspace oder so
    if (e.preventDefault) {
      e.preventDefault();
    }
    window.close();
  }, 'keyup');
  
  Mousetrap.bind('esc', function(e) { //irgendwie etwas verbuggt :O
    if (e.preventDefault) {
      e.preventDefault();
    }
    document.exitPointerLock =
      document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
    document.exitPointerLock();
  });
  
  Mousetrap.bind('m', function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    scene.remove(grass);
  });
  
  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true; 
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 250;
        canJump = false;
        break;
    }
  }

  function onKeyUp(e) {
    switch(e.keyCode) {
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
  }

  function initControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
  }

  function updateControls() {
    if (controlsEnabled) {
      var delta = clock.getDelta();
      var walkingSpeed = 750.0;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta;

      if (moveForward) velocity.z -= walkingSpeed * delta;
      if (moveBackward) velocity.z += walkingSpeed * delta;

      if (moveLeft) velocity.x -= walkingSpeed * delta;
      if (moveRight) velocity.x += walkingSpeed * delta;

      controls.getObject().translateX(velocity.x * delta);
      controls.getObject().translateY(velocity.y * delta);
      controls.getObject().translateZ(velocity.z * delta);
      
      // World Border
      if (controls.getObject().position.x < -256) {
        controls.getObject().position.x = -256;
      }
      if (controls.getObject().position.x > 255) {
        controls.getObject().position.x = 255;
      }
      if (controls.getObject().position.z < -256) {
        controls.getObject().position.z = -256;
      }
      if (controls.getObject().position.z > 255) {
        controls.getObject().position.z = 255;
      }
      
      if (controls.getObject().position.y < 7) {
        velocity.y = 0;
        controls.getObject().position.y = 7;
        canJump = true;
      }
    }
  }
})();