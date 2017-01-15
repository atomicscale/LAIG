function Terrain(scene, nrDiv, texture, heightmap) {
    Plane.call(this, scene, nrDiv);

    this.texture = texture;
    this.heightmap = heightmap;
}

Terrain.prototype = Object.create(Plane.prototype);
Terrain.prototype.constructor = Terrain;