function Plane(scene, nrDiv){

	var controlVertexes = [	// U = 0
						[ // V = 0..1;
							 [-1.0, 0.0, -1.0, 1],
							 [1.0,  0.0, -1.0, 1]
							
						],
						// U = 1
						[ // V = 0..1
							 [-1.0, 0.0, 1.0, 1],
							 [1.0, 0.0, 1.0, 1]							 
						]
	];

    Patch.call(this, scene, 1, nrDiv, nrDiv, controlVertexes);
}


Plane.prototype = Object.create(Patch.prototype);
Plane.prototype.constructor = Plane;