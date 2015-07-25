/* Basis-Klasse für Items in Minecraf.js */

var src = src || {};
src.minecraft = src.minecraft || {};

src.minecraft.Item = function(pCamera, pTexturen) {
  if (this instanceof src.minecraft.Item) {
    this.camera = pCamera;
    this.texturen = pTexturen;
  } else {
    return new src.minecraft.Item(pCamera, pTexturen);
  }
};

src.minecraft.Item.prototype.render = function() {
  console.log(this.camera);
};