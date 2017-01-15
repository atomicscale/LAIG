var deg2rad = Math.PI / 180.0;

/**
 * MyCircle
 * @constructor
 */
function MyCircle(scene, radius, slices) {
    CGFobject.call(this, scene);
    
    this.radius = radius || 1;
    this.slices = slices || 24;
    
    this.initBuffers();
}
;

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {
    
    this.vertices = [
    0, 0, 0 //, 2, 0, 0, 2, 2, 0
    ];
    
    this.normals = [
    0, 0, 1 //, 0, 0, 1,  0, 0, 1
    ];
    
    this.texCoords = [
    0.5, 0.5 //, 0, 0, 1, 0
    ];
    
    this.indices = [0];
    
    var i;
    var deg2rad = Math.PI / 180.0;
    var fatia = ((360 * deg2rad) / this.slices);
    
    for (i = 0; i < this.slices; i++) {
        var a = i * fatia;
        this.vertices.push(this.radius * Math.cos(a), this.radius * Math.sin(a), 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5 + (Math.cos(a) / 2), 0.5 - (Math.sin(a) / 2));
    }
    
    
    for (i = 1; i <= this.slices; i++) {
        this.indices.push(i);
    }
    
    this.indices.push(1);
    
    this.primitiveType = this.scene.gl.TRIANGLE_FAN;
    this.initGLBuffers();
}
;

MyCircle.prototype.updateTex = function(s, t) {
}
;
