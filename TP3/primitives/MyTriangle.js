function MyTriangle(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) 
{
    CGFobject.call(this, scene);
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;
    
    this.initBuffers();
}
;

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() 
{
    
    this.vertices = [
    this.x1, this.x2, this.x3, 
    this.y1, this.y2, this.y3, 
    this.z1, this.z2, this.z3
    ];
    
    this.indices = [
    0, 1, 2, 
    ];
    
    var V1 = vec3.fromValues(this.y1 - this.x1, this.y2 - this.x2, this.y3 - this.x3);
    var V2 = vec3.fromValues(this.z1 - this.y1, this.z2 - this.y2, this.z3 - this.y3);
    var VN = vec3.create();
    vec3.cross(VN, V1, V2);
    vec3.normalize(VN, VN);
    
    this.normals = [
    VN[0], VN[1], VN[2], 
    VN[0], VN[1], VN[2], 
    VN[0], VN[1], VN[2]
    ];
    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;

MyTriangle.prototype.updateTex = function(s, t) 
{
    var CB = Math.sqrt(Math.pow((this.z1 - this.y1), 2) + Math.pow((this.z2 - this.y2), 2) + Math.pow((this.z3 - this.y3), 2));
    var AC = Math.sqrt(Math.pow((this.z1 - this.x1), 2) + Math.pow((this.z2 - this.x2), 2) + Math.pow((this.z3 - this.x3), 2));
    var AB = Math.sqrt(Math.pow((this.y1 - this.x1), 2) + Math.pow((this.y2 - this.x2), 2) + Math.pow((this.y3 - this.x3), 2));
    
    var cos_beta = (CB * CB - AC * AC + AB * AB) / 2 * CB * AB;
    var sin_beta = Math.sqrt(1 - cos_beta * cos_beta);
    this.texCoords = [
    0, 0, 
    AB / s, 0, 
    (AB - (CB * cos_beta)) / s, (CB * sin_beta) / t
    ]
    this.updateTexCoordsGLBuffers();
}
