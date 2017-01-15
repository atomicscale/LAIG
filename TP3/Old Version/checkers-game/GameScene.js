
/* GameScene */

function GameScene() {
    CGFscene.call(this);
    this.texture = null;
}

GameScene.prototype = Object.create(CGFscene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.initCameras();
  this.initLights();
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);
	this.enableTextures(true);

	this.tempo_inicio = 0;
	this.tempo_actual = 0;
  this.setUpdatePeriod(1000/60);

	this.SceneNode_id;

	this.LeafArray = [];
	this.NodeArray = [];
	this.TextureArray = [];
	this.MaterialArray = [];

	this.mvMatrixStack = [];

  /*
   * Game
   */

   this.game = new GameState(this);
   this.setPickEnabled(true);

};

GameScene.prototype.initLights = function () {

	for (var i = 0; i < 8; i++)
	{
    this.lights[i].setSpecular(0,0,0,0);
		this.lights[i].setAmbient(0,0,0,0);
		this.lights[i].setDiffuse(0,0,0,0);
		this.lights[i].update();
		this.lights[i].setVisible(false);
		this.lights[i].disable();
	}

};

GameScene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.01, 500, vec3.fromValues(20, 25, -60), vec3.fromValues(20, 0, 50));
  this.cameraDestination = [0,10,20];
  this.cameraTransition = false;
  this.transitionTime = 2000;
};

GameScene.prototype.setDefaultAppearance = function () {

	this.setAmbient(0.7, 0.7, 0.7, 1.0);
	this.setDiffuse(0.4, 0.4, 0.4, 1.0);
  this.setSpecular(0.4, 0.4, 0.4, 1.0);
  this.setShininess(10.0);

};


GameScene.prototype.onGraphLoaded = function () {

	this.Initials();
	this.Illumination();
	this.Lights();
	this.Materials();
	this.Textures();
  this.Leafs();
	this.Nodes();

};

GameScene.prototype.display = function () {

  /*
   * Game
   */

  this.game.logic();

  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.updateProjectionMatrix();
  this.loadIdentity();
	this.applyViewMatrix();
	this.setDefaultAppearance();

	/* Update Lights */

  for(var i = 0; i <= 7; i++)
		this.lights[i].update();

	if (this.graph.loadedOk && true)
	{
		this.pushMatrix();
		this.multMatrix(this.Initial_Transform);
		this.Display_Node(this.SceneNode_id);
    this.popMatrix();

    if (this.graph.loadedOk && this.graph.Parser.Initials.axis_length > 0)
			   this.axis == 0;
	}

this.displayGame();
};

GameScene.prototype.Initials = function (){

	this.camera.near = this.graph.Parser.Initials.view_near;
	this.camera.far = this.graph.Parser.Initials.view_far;

	var Transformation_Matrix = mat4.create();
	mat4.identity(Transformation_Matrix);

	this.transformMatrix_m4(Transformation_Matrix, 'translation',
					this.graph.Parser.Initials.view_translation_xx,
					this.graph.Parser.Initials.view_translation_yy,
					this.graph.Parser.Initials.view_translation_zz);

	this.transformMatrix_m4(Transformation_Matrix, 'rotation', 1,0,0, this.graph.Parser.Initials.view_rotation_xx);
	this.transformMatrix_m4(Transformation_Matrix, 'rotation', 0,1,0, this.graph.Parser.Initials.view_rotation_yy);
	this.transformMatrix_m4(Transformation_Matrix, 'rotation', 0,0,1, this.graph.Parser.Initials.view_rotation_zz);

	this.transformMatrix_m4(Transformation_Matrix, 'scale',
					this.graph.Parser.Initials.view_scale_xx,
					this.graph.Parser.Initials.view_scale_yy,
					this.graph.Parser.Initials.view_scale_zz);

	this.Initial_Transform = Transformation_Matrix;

	this.axis = new CGFaxis(this, this.graph.Parser.Initials.axis_length, 0.1);

}

GameScene.prototype.Illumination = function (){

	this.setGlobalAmbientLight(this.graph.Parser.Illumination.ambient[0],
								this.graph.Parser.Illumination.ambient[1],
								this.graph.Parser.Illumination.ambient[2],
								this.graph.Parser.Illumination.ambient[3]);

	this.gl.clearColor(	this.graph.Parser.Illumination.background[0],
						this.graph.Parser.Illumination.background[1],
						this.graph.Parser.Illumination.background[2],
						this.graph.Parser.Illumination.background[3]);
}


GameScene.prototype.Lights = function () {

	for (var i = 0; i < this.graph.Parser.Lights.length; i++) {

	  this.lights[i].setPosition(this.graph.Parser.Lights[i].position[0],
									this.graph.Parser.Lights[i].position[1],
									this.graph.Parser.Lights[i].position[2],
									this.graph.Parser.Lights[i].position[3]);

		this.lights[i].setAmbient(this.graph.Parser.Lights[i].ambient[0],
									this.graph.Parser.Lights[i].ambient[1],
									this.graph.Parser.Lights[i].ambient[2],
									this.graph.Parser.Lights[i].ambient[3]);
		this.lights[i].setDiffuse(this.graph.Parser.Lights[i].diffuse[0],
									this.graph.Parser.Lights[i].diffuse[1],
									this.graph.Parser.Lights[i].diffuse[2],
									this.graph.Parser.Lights[i].diffuse[3]);
		this.lights[i].setSpecular(this.graph.Parser.Lights[i].specular[0],
									this.graph.Parser.Lights[i].specular[1],
									this.graph.Parser.Lights[i].specular[2],
									this.graph.Parser.Lights[i].specular[3]);

		if (this.graph.Parser.Lights[i].enabled){
			this.lights[i].enable();
			this.lights[i].setVisible(true);
    }
		else
		  this.lights[i].disable();

		this.lights[i].update();

	}


}

GameScene.prototype.Textures = function (){

	for (var i = 0; i < this.graph.Parser.Textures.length; i++)
	{
		var newText = new CGFtexture(this, this.graph.Parser.Textures[i].path);
	  newText.id = this.graph.Parser.Textures[i].id;
		newText.factor_s = this.graph.Parser.Textures[i].factor_s;
		newText.factor_t = this.graph.Parser.Textures[i].factor_t;
		this.TextureArray[newText.id] = newText;
	}

}


GameScene.prototype.Materials = function (){

	//Material Default
	var defMat = new CGFappearance(this);
	defMat.id="SceneDefaultMaterial";
	defMat.setAmbient(0.7, 0.7, 0.7, 1.0);
	defMat.setDiffuse(0.4, 0.4, 0.4, 1.0);
	defMat.setSpecular(0.4, 0.4, 0.4, 1.0);
	defMat.setShininess(10.0);
	defMat.setEmission(0, 0, 0, 1);
	this.MaterialArray.push(defMat);

	//Materiais do LSX
	for (var i = 0; i < this.graph.Parser.Materials.length; i++){

		var newMat = new CGFappearance(this);

		newMat.id = this.graph.Parser.Materials[i].id;

		newMat.setAmbient(this.graph.Parser.Materials[i].ambient[0],
									this.graph.Parser.Materials[i].ambient[1],
									this.graph.Parser.Materials[i].ambient[2],
									this.graph.Parser.Materials[i].ambient[3]);

		newMat.setDiffuse(this.graph.Parser.Materials[i].diffuse[0],
									this.graph.Parser.Materials[i].diffuse[1],
									this.graph.Parser.Materials[i].diffuse[2],
									this.graph.Parser.Materials[i].diffuse[3]);

		newMat.setSpecular(this.graph.Parser.Materials[i].specular[0],
									this.graph.Parser.Materials[i].specular[1],
									this.graph.Parser.Materials[i].specular[2],
									this.graph.Parser.Materials[i].specular[3]);

		newMat.setShininess(this.graph.Parser.Materials[i].shininess);

		newMat.setEmission(this.graph.Parser.Materials[i].emission[0],
							this.graph.Parser.Materials[i].emission[1],
							this.graph.Parser.Materials[i].emission[2],
							this.graph.Parser.Materials[i].emission[3]);

		newMat.setTextureWrap('REPEAT', 'REPEAT');

		this.MaterialArray[newMat.id] = newMat;
	}

}


GameScene.prototype.Leafs = function (){

	for (var i = 0; i < this.graph.Parser.Leaves.length; i++)
	{
		if (this.graph.Parser.Leaves[i].type == "rectangle")
		{
			var newRectangle = new MySquare(this, this.graph.Parser.Leaves[i].lt_x,
														this.graph.Parser.Leaves[i].lt_y,
														this.graph.Parser.Leaves[i].rb_x,
														this.graph.Parser.Leaves[i].rb_y);
			newRectangle.type = "rectangle";
			newRectangle.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newRectangle.id] = newRectangle;

		}


		if (this.graph.Parser.Leaves[i].type == "cylinder")
		{
			var newCylinder = new MyCylinder(this, this.graph.Parser.Leaves[i].parts,
														this.graph.Parser.Leaves[i].sections,
														this.graph.Parser.Leaves[i].height,
														this.graph.Parser.Leaves[i].bot_radius,
														this.graph.Parser.Leaves[i].top_radius);
			newCylinder.type = "cylinder";
			newCylinder.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newCylinder.id] = newCylinder;
		}


		if (this.graph.Parser.Leaves[i].type == "sphere")
		{
			var newSphere = new MySphere(this,
												this.graph.Parser.Leaves[i].parts,
												this.graph.Parser.Leaves[i].sections,
												this.graph.Parser.Leaves[i].radius);
			newSphere.type = "sphere";
			newSphere.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newSphere.id] = newSphere;
		}


		if (this.graph.Parser.Leaves[i].type == "triangle")
		{
			var newTriangle = new MyTriangle(this,
												this.graph.Parser.Leaves[i].p1_x,
												this.graph.Parser.Leaves[i].p1_y,
												this.graph.Parser.Leaves[i].p1_z,
												this.graph.Parser.Leaves[i].p2_x,
												this.graph.Parser.Leaves[i].p2_y,
												this.graph.Parser.Leaves[i].p2_z,
												this.graph.Parser.Leaves[i].p3_x,
												this.graph.Parser.Leaves[i].p3_y,
												this.graph.Parser.Leaves[i].p3_z);
			newTriangle.type = "triangle";
			newTriangle.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newTriangle.id] = newTriangle;
		}

		if (this.graph.Parser.Leaves[i].type == "plane")
		{
			var newPlane = new Plane(this,
												this.graph.Parser.Leaves[i].parts);
			newPlane.type = "plane";
			newPlane.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newPlane.id] = newPlane;
		}

		if (this.graph.Parser.Leaves[i].type == "patch")
		{
			var newPatch = new Patch(this,
												this.graph.Parser.Leaves[i].order,
												this.graph.Parser.Leaves[i].partsU,
												this.graph.Parser.Leaves[i].partsV,
												this.graph.Parser.Leaves[i].controlpoints
												);
			newPatch.type = "patch";
			newPatch.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newPatch.id] = newPatch;
		}

		if (this.graph.Parser.Leaves[i].type == "terrain")
		{
			var newTerrain = new Terrain(this, this.graph.Parser.Leaves[i].texture_path,this.graph.Parser.Leaves[i].heightmap_path);
			newTerrain.type = "terrain";
			newTerrain.id = this.graph.Parser.Leaves[i].id;
			this.LeafArray[newTerrain.id] = newTerrain;
		}

    if (this.graph.Parser.Leaves[i].type == "gamescene")
    {
      var newGameScene = new GameState(this);
      newGameScene.type = "gamescene";
      newGameScene.id = this.graph.Parser.Leaves[i].id;
      this.LeafArray[newGameScene.id] = newGameScene;
    }

	}
}


GameScene.prototype.Nodes = function (){

	//Guardar root em this.SceneNode_id
	this.SceneNode_id = this.graph.Parser.Root_id;

	// Certificar-se que root é encontrado
	var found = false;

	for (var i = 0; i < this.graph.Parser.Nodes.length; i++)
	{
		if (this.graph.Parser.Nodes[i].id == this.graph.Parser.Root_id)
			found = true;

		var newNode = {};

		// id
		newNode.id = this.graph.Parser.Nodes[i].id;

		//Material
		newNode.materialID = this.graph.Parser.Nodes[i].material_id;

		//Texture
		newNode.textureID = this.graph.Parser.Nodes[i].texture_id;

		//Transformation Matrix
		var newMatrix = mat4.create();
		mat4.identity(newMatrix);
		for (var j = 0; j < this.graph.Parser.Nodes[i].Transform.length; j++)
		{
			switch(this.graph.Parser.Nodes[i].Transform[j].type)
			{
			case 'translation':
				this.transformMatrix_m4(newMatrix, 'translation',
								this.graph.Parser.Nodes[i].Transform[j].translation_x,
								this.graph.Parser.Nodes[i].Transform[j].translation_y,
								this.graph.Parser.Nodes[i].Transform[j].translation_z);
				break;
			case 'rotation':
					if(this.graph.Parser.Nodes[i].Transform[j].axis == 'x')
							this.transformMatrix_m4(newMatrix, 'rotation', 1,0,0, this.graph.Parser.Nodes[i].Transform[j].angle);
						if(this.graph.Parser.Nodes[i].Transform[j].axis == 'y')
							this.transformMatrix_m4(newMatrix, 'rotation', 0,1,0, this.graph.Parser.Nodes[i].Transform[j].angle);
						if(this.graph.Parser.Nodes[i].Transform[j].axis == 'z')
							this.transformMatrix_m4(newMatrix, 'rotation', 0,0,1, this.graph.Parser.Nodes[i].Transform[j].angle);
				break;

			case 'scale':
				this.transformMatrix_m4(newMatrix, 'scale',
							this.graph.Parser.Nodes[i].Transform[j].scale_x,
							this.graph.Parser.Nodes[i].Transform[j].scale_y,
							this.graph.Parser.Nodes[i].Transform[j].scale_z);
				break;

      default:
				break;
			}
		}
		newNode.transformationMatrix = newMatrix;

		//Animations
		newNode.Animations = [];
		var time_animations = 0;
		for(var j = 0; j < this.graph.Parser.Nodes[i].Animations.length; j++)
		{
			for(var k = 0; k < this.graph.Parser.Animations.length; k++)
			{
				if (this.graph.Parser.Animations[k].id == this.graph.Parser.Nodes[i].Animations[j])
				{
					var newAnimation;
					if (this.graph.Parser.Animations[k].type == "linear")
					{
						newAnimation = new LinearAnimation(
															this.graph.Parser.Animations[k].id,
															this.graph.Parser.Animations[k].span,
															time_animations,
															"linear",
															this.graph.Parser.Animations[k].controlpoints);

						newNode.Animations.push(newAnimation);
					}
					if (this.graph.Parser.Animations[k].type == "circular")
					{
						newAnimation = new CircularAnimation(
															this.graph.Parser.Animations[k].id,
															this.graph.Parser.Animations[k].span,
															time_animations,
															"circular",
															this.graph.Parser.Animations[k].center,
															this.graph.Parser.Animations[k].radius,
															this.graph.Parser.Animations[k].startang,
															this.graph.Parser.Animations[k].rotang
															);

						newNode.Animations.push(newAnimation);
					}
					time_animations += this.graph.Parser.Animations[k].span;
				}
			}
		}

		//Descendents
		newNode.childIDs = [];
		for (var j = 0; j < this.graph.Parser.Nodes[i].Descendants.length; j++)
			newNode.childIDs.push(this.graph.Parser.Nodes[i].Descendants[j]);


		this.NodeArray[newNode.id] = newNode;
	}

	if (!found)
		console.log("There was no node with the Scene node's id!");
	else
		console.log("The Scene Graph is now loaded onto the Scene object. Length: ");

}

var degToRad = Math.PI / 180.0;

GameScene.prototype.Display_Node = function(NodeID, parentMatID, parentTexID, MaterialObject, TextureObject){

	if (typeof this.NodeArray[NodeID] === "undefined") //Node is found, function starts and ends within this clause
	{
		console.log("Node of ID:" + NodeID + ", is missing. That can't be good!");
		return;
	}

	var MaterialUsed = null;
	var TextureUsed = null;
	var Texture_ID_sent = null;

	// Materials
	if (NodeID == this.SceneNode_id && this.NodeArray[NodeID].materialID == 'null')
		MaterialUsed = this.MaterialArray[0];
	else
		if (this.NodeArray[NodeID].materialID == 'null')
			MaterialUsed = MaterialObject;
		else
			MaterialUsed = this.MaterialArray[this.NodeArray[NodeID].materialID];


	// Textures
	if(this.NodeArray[NodeID].textureID == 'clear')
		TextureUsed = null;
	else if(this.NodeArray[NodeID].textureID == 'null' && NodeID != this.SceneNode_id)
		TextureUsed = TextureObject;
	else
		TextureUsed = this.TextureArray[this.NodeArray[NodeID].textureID];

	if (TextureUsed == null)
		Texture_ID_sent = null;
	else
		Texture_ID_sent = TextureUsed.id;



	// Transformations
	this.multMatrix(this.NodeArray[NodeID].transformationMatrix);



	// Animations
	var mostrecentanimation;
	for(var i = 0; i < this.NodeArray[NodeID].Animations.length; i++)
	{
		if (!this.NodeArray[NodeID].Animations[i].done)
		{
			mostrecentanimation = this.NodeArray[NodeID].Animations[i].getMatrix();
			i = this.NodeArray[NodeID].Animations.length;
		}

		if (i == this.NodeArray[NodeID].Animations.length-1 && mostrecentanimation == null)
		{
			mostrecentanimation = this.NodeArray[NodeID].Animations[i].getMatrix();
		}

	}
	if (mostrecentanimation != null)
		this.multMatrix(mostrecentanimation);


	// Children

	for(var j = 0; j < this.NodeArray[NodeID].childIDs.length; j++)
	{
		var Selected_Child_ID = this.NodeArray[NodeID].childIDs[j];
		var found = false;

		//Child é um node

		if (typeof this.NodeArray[Selected_Child_ID] != "undefined")
		{
			this.pushMatrix();
			this.Display_Node(Selected_Child_ID,
						MaterialUsed.id,
						Texture_ID_sent,
						MaterialUsed,
						TextureUsed);
			found = true;
			this.popMatrix();
		}

		//Child é uma leaf
		if (typeof this.LeafArray[Selected_Child_ID] != "undefined")
		{
			this.pushMatrix();
			this.Display_Leaf(Selected_Child_ID,
						MaterialUsed,
						TextureUsed);
			found = true;
			this.popMatrix();
		}


		if (!found)
			console.log("A child in node "+ NodeID + " with the id: " + Selected_Child_ID + " wasnt found in the graph!");
	}

}


GameScene.prototype.Display_Leaf = function (id, MaterialObject, TextureObject){

	//Material
	MaterialObject.apply();

	//Texture
	if (TextureObject != null)
	{
		if(this.LeafArray[id].type == "rectangle" || this.LeafArray[id].type == "triangle")
			this.LeafArray[id].updateTexCoords(TextureObject.factor_s, TextureObject.factor_t);
		TextureObject.bind();
	}
	if (this.LeafArray[id].type == 'sphere')
		this.rotate(90*degToRad,1,0,0);


	//Display
	this.LeafArray[id].display();
}


GameScene.prototype.displayGame = function(){

  this.pushMatrix();

  this.clearPickRegistration();

  /* Blacks Picking */
  for(var i = 1; i <= 8; i++){

    this.pushMatrix();

    if(this.game.state == 1)
    {
      this.clearPickRegistration();

      if(i == this.game.BlackPieces[i].getid()){
        this.registerForPick(i, this.game.BlackPieces[i]);
      }

    }

    this.game.BlackPieces[i].display();

    this.popMatrix();
  }



  /* Whites Picking  */
  for(var i = 9; i <= 16; i++){


    this.pushMatrix();

    if(this.game.state == 1)
    {
      this.clearPickRegistration();

      if(i == this.game.WhitePieces[i].getid()){
        this.registerForPick(i, this.game.WhitePieces[i]);
      }

    }

    this.game.WhitePieces[i].display();

    this.popMatrix();
  }


  /* Board Picking */
	for (var i = 1; i <= 64; i++){

      this.pushMatrix();

      /*Allow picking*/
			if(this.game.state == 2)
			{
				this.clearPickRegistration();

				if (i == this.game.board.cells[i].getid())
					this.registerForPick(i, this.game.board.cells[i]);
			}

      var idCell = this.game.board.cells[i].getid();

			this.game.board.displayCell(idCell);

			this.popMatrix();
	 }


  this.popMatrix();
}


GameScene.prototype.transformMatrix_m4 = function(matrix, transformtype, value_x, value_y, value_z, angle) {

	switch(transformtype)
	{
	case 'translation':
		mat4.translate(matrix, matrix, [value_x,value_y,value_z]);
		break;
	case 'rotation':
		mat4.rotate(matrix, matrix, angle*degToRad, [value_x,value_y,value_z]);
		break;
	case 'scale':
		mat4.scale(matrix, matrix, [value_x,value_y,value_z]);
		break;
	default:
		throw "Invalid transformation!";
		break;
	}

}

GameScene.prototype.update = function(currTime) {
	if(this.tempo_inicio == 0)
	{
		this.tempo_inicio = currTime;
	} else
	{
		this.tempo_actual = currTime - this.tempo_inicio ;
	}

	if (this.graph.loadedOk)
	{
		this.updateAnimationNodes(this.NodeArray[this.SceneNode_id])
	}
}

GameScene.prototype.updateAnimationNodes = function(Node){

	for(var i = 0; i < Node.Animations.length; i++)
		 Node.Animations[i].updateMatrix(this.tempo_actual);


	for(var i = 0; i < Node.childIDs.length; i++)
	{
		if (typeof this.NodeArray[Node.childIDs[i]] != "undefined")
		{
			this.updateAnimationNodes(this.NodeArray[Node.childIDs[i]])
		}

	}
}
