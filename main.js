window.onload = function() {
  // This is where stuff in our game will happen:
  var scene = new THREE.Scene();

  // This is what sees the stuff:
  var aspect_ratio = viewportSize.getWidth() / viewportSize.getHeight();
  var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
  camera.position.z = 100;
  scene.add(camera);

  // This will draw what the camera sees onto the screen:
  var renderer = new THREE.WebGLRenderer({alpha : false});
  renderer.setSize(viewportSize.getWidth(), viewportSize.getHeight());
  document.body.appendChild(renderer.domElement);

  // ******** START CODING ON THE NEXT LINE ********

  var bottom = new THREE.CubeGeometry(100, 10, 100);
  var cover = new THREE.MeshNormalMaterial();
  var box = new THREE.Mesh(bottom, cover);
  scene.add(box);

  // UTIL STUFF

  function wait(millis) {
    var date = new Date();
    var curDate = null;
    do {
      curDate = new Date();
    } while (curDate - date < millis);
  }

  var meter = new FPSMeter({
    interval: 500,
    show: "fps",
    maxFps: 100,
    theme: "transparent"
  });

  Mousetrap.bind('esc', function() { //noch nicht ganz schön gelöst :D vielleicht auch backspace oder so
    meter.destroy();
    window.close();
  }, 'keyup');

  var n = 0;

  function draw() {
    meter.tickStart();
    renderer.render(scene, camera);

    request = requestAnimationFrame(draw);

    box.rotation.set(n, n, n);
    n = n + 0.05;
    meter.tick();
  }

  draw();
};
