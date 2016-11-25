function Patch(scene, order,partsU,partsV,controlpoints) {

	this.scene = scene;
 	CGFobject.call(this,scene);
    this.surface;
    this.ready=false;
    this.makeSurface(order,partsU,partsV,controlpoints);
    this.initBuffers();
 };

 Patch.prototype = Object.create(CGFobject.prototype);
 Patch.prototype.constructor = Patch;


Patch.prototype.makeSurface = function (order,partsU,partsV,controlpoints) {

	var nurbsSurface;

	for (var i = 0; i < controlpoints.length; i++)
	{
		controlpoints[i].push(1);
	}

	switch(order)
	{
	case 1:
		nurbsSurface = new CGFnurbsSurface(order, order, [0, 0, 1, 1], [0, 0, 1, 1],
						[	// U = 0
						[ // V = 0..1;
							 controlpoints[0],
							 controlpoints[1],

						],
						// U = 1
						[ // V = 0..1
							 controlpoints[2],
							 controlpoints[3]
						]
					]);
		break;
	case 2:
		nurbsSurface = new CGFnurbsSurface(order, order,[0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1],
						[	// U = 0
						[ // V = 0..1;
							 controlpoints[0],
							 controlpoints[1],
							 controlpoints[2]

						],
						// U = 1
						[ // V = 0..1
							 controlpoints[3],
							 controlpoints[4],
							 controlpoints[5]
						],
						// U = 2
						[ // V = 0..1
							 controlpoints[6],
							 controlpoints[7],
							 controlpoints[8]
						]
					]);
		break;
	case 3:
	nurbsSurface = new CGFnurbsSurface(order, order, [0, 0, 0, 0, 1, 1, 1, 1],[0, 0, 0, 0, 1, 1, 1, 1],
						[	// U = 0
						[ // V = 0..1;
							 controlpoints[0],
							 controlpoints[1],
							 controlpoints[2],
							 controlpoints[3]

						],
						// U = 1
						[ // V = 0..1
							 controlpoints[4],
							 controlpoints[5],
							 controlpoints[6],
							 controlpoints[7]
						],
						// U = 2
						[ // V = 0..1;
							 controlpoints[8],
							 controlpoints[9],
							 controlpoints[10],
							 controlpoints[11]

						],
						// U = 3
						[ // V = 0..1
							 controlpoints[12],
							 controlpoints[13],
							 controlpoints[14],
							 controlpoints[15]
						]
					]);
		break;
	default:
		break;

	}

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, partsU, partsV );
	this.ready = true;


};

Patch.prototype.initBuffers = function() {
  	this.surface.initBuffers();
};



Patch.prototype.display= function()
{
	if(this.ready)
		this.surface.display();

};
