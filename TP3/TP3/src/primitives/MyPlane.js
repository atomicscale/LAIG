function MyPlane(scene, args) {
    this.args = args || [1,1,20,20];
    this.dX = this.args[0];
    this.dY = this.args[1];
    this.partsX = this.args[2];
    this.partsY = this.args[3];

    

    var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1], [
        [ // U = 0 , V = 0..1;
            [-(this.dX)/2, -(this.dY)/2, 0.0, 1],
            [-(this.dX)/2,  (this.dY)/2, 0.0, 1]
        ],
        [ // U = 1 , V = 0..1;
            [(this.dX)/2, -(this.dY)/2, 0.0, 1],
            [(this.dX)/2,  (this.dY)/2, 0.0, 1]
        ]
    ]);
    var getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsX, this.partsY);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.updateTex = function(ampS, ampT) {};
