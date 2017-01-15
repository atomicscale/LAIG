function MyPlane(scene, nrDiv){

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

    MyPatch.call(this, scene, 1, nrDiv, 1, nrDiv, controlVertexes);
}


MyPlane.prototype = Object.create(MyPatch.prototype);
MyPlane.prototype.constructor = MyPlane;