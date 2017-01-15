/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, height, bRadius, tRadius, stacks, slices) {
    CGFobject.call(this, scene);
    
    this.height = height;
    this.bRadius = bRadius;
    this.tRadius = tRadius;
    this.stacks = stacks;
    this.slices = slices;
    
    this.initBuffers();
}
;

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];
    
    var deg2rad = Math.PI / 180.0;
    
    var ang = (360 / this.slices) * deg2rad;
    
    var dRadius = this.tRadius - this.bRadius;
    var dHeight = dRadius / this.stacks;
    
    var radius = parseFloat(this.bRadius);
    
    for (var i = 0; i <= this.stacks; i++) {
        for (var k = 0; k < this.slices; k++) {
            this.vertices.push(radius * Math.cos(k * ang), radius * Math.sin(k * ang), (this.height * i / this.stacks));
            this.normals.push(radius * Math.cos(k * ang), radius * Math.sin(k * ang), 0);
        }
        radius += dHeight;
    }
    
    for (var m = 0; m < this.stacks; m++) {
        for (var n = 0; n < this.slices; n++) {
            if (n == this.slices - 1) 
            {
                this.indices.push(m * this.slices + n, m * this.slices, (m + 1) * this.slices + n);
                this.indices.push(m * this.slices, (m + 1) * this.slices, (m + 1) * this.slices + n);
            } 
            else 
            {
                this.indices.push(m * this.slices + n, m * this.slices + n + 1, (m + 1) * this.slices + n);
                this.indices.push(m * this.slices + n + 1, (m + 1) * this.slices + n + 1, (m + 1) * this.slices + n);
            }
        }
    }
    
    
    var texS = 1 / this.slices;
    var textT = 1 / this.stacks;
    
    for (var x = 0; x < this.stacks; x++) {
        for (var y = 0; y < this.slices; y++) {
            this.texCoords.push(y * texS, x * textT);
            
            this.texCoords.push(y * texS, (x + 1) * textT);
        }
    }
    
    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;

MyCylinder.prototype.updateTex = function(s, t) {
}
;
