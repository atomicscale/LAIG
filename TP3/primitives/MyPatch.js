function MyPatch(scene, degreeU, knotsU, degreeV, knotsV, controlVertexes) {

    CGFobject.call(this, scene);

    this.knots_a = [];

    for(var i = 0; i <= degreeU; i++){
    	this.knots_a.push(0);
    }

    for(var i = 0; i <= degreeU; i++){
    	this.knots_a.push(1);
    }

    this.knots_b = [];

    for(var i = 0; i <= degreeV; i++){
      this.knots_b.push(0);
    }

    for(var i = 0; i <= degreeV; i++){
      this.knots_b.push(1);
    }

   	var surface = new CGFnurbsSurface(degreeU, degreeV, this.knots_a, this.knots_b, controlVertexes);

   	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, knotsU, knotsV);
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function () {
	
   	this.obj.display();
};

MyPatch.prototype.updateTex = function(s, t){
  
}