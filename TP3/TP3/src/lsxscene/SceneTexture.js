function SceneTexture(scene, id, path, leng) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.leng = leng;
}
SceneTexture.prototype = Object.create(CGFtexture.prototype);
SceneTexture.prototype.constructor = SceneTexture;
