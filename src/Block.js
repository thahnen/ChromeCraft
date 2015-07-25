/* Basis-Klasse für Blöcke in Minecraft.js */

/* 
  Die (X|Y|Z) Koordinaten befinden sich in der Mitte des Blocks, das heisst:
  - die Kanten liegen bei x +/- 0.5*Breite, y +/- 0.5*Hoehe, z +/- 0.5*Laenge
  - Collision direkt oder per Manager-Klasse ?
*/

var src = src || {};
src.minecraft = src.minecraft || {};

src.minecraft.Block = function(pScene, pPos, pTexture) {
  if (this instanceof src.minecraft.Block) {
    this.scene = pScene;
    this.pos = pPos;
    this.size = 10;
    this.texture = pTexture;
    if (pTexture.length == 1) {
      var tex = new THREE.ImageUtils.loadTexture(pTexture[0]);
      tex.mapping = new THREE.UVMapping();
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestMipMapLinearFilter;
      this.mesh = new THREE.Mesh(
        new THREE.CubeGeometry(this.size, this.size, this.size),
        new THREE.MeshBasicMaterial({map : tex})
      );
      this.scene.add(this.mesh);
      console.log(this.mesh);
      this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    } else if (pTexture.length == 3) {
      
    } else if (pTexture.length == 6) {
      
    } else {
      // throw irgend einen Fehler
    }
  } else {
    return new com.minecraft.Block(pScene, pPos, pTexture);
  }
};

src.minecraft.Block.prototype.add = function() {
  scene.add(this);
};

src.minecraft.Cobblestone = function(pScene, pPos) {
  if (this instanceof src.minecraft.Cobblestone) {
    this.base = new src.minecraft.Block(pScene, pPos, ["/assets/cube/cobblestone.png"]);
  } else {
    return new com.minecraft.Cobblestone(pScene, pPos);
  }
};

src.minecraft.Cobblestone.add = function() {
  this.scene.add(base);
};

src.minecraft.Cobblestone.remove = function() {
  this.scene.remove(base);
};