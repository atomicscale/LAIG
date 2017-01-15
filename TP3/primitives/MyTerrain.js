function MyTerrain(scene, nrDiv, texture, heightmap) {
    MyPlane.call(this, scene, nrDiv);

    this.texture = texture;
    this.heightmap = heightmap;
}

MyTerrain.prototype = Object.create(MyPlane.prototype);
MyTerrain.prototype.constructor = MyTerrain;