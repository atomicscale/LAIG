function Patch(scene, degree, knotsU, knotsV, controlVertexes) {

    CGFobject.call(this, scene);

    this.knots = [];

    for(var i = 0; i <= degree; i++){
    	this.knots.push(0);
    }

    for(var i = 0; i <= degree; i++){
    	this.knots.push(1);
    }

   	var surface = new CGFnurbsSurface(degree, degree, this.knots, this.knots, controlVertexes);

   	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, knotsU, knotsV);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.display = function () {
	
   	this.obj.display();
};

Patch.prototype.updateTex = function(s, t){
  
}