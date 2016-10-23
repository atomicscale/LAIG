function SceneObject(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = null;
    this.primitive = null;
}

SceneObject.prototype.updateTex = function() {
    this.material.setTexture(this.texture);

    if (this.texture == null) return;

    this.primitive.updateTex(this.texture.leng.s, this.texture.leng.t);
};

SceneObject.prototype.draw = function(scene) {
    scene.pushMatrix();
    this.updateTex();
    this.material.apply();
    scene.multMatrix(this.matrix);
    this.primitive.display();
    scene.popMatrix();
};
