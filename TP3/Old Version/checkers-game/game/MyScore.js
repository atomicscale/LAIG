function MyScore(scene, matWOOD, fontText) {
 	CGFobject.call(this,scene);
	
 	this.scene=scene;
 	this.matWOOD=matWOOD;

	this.sideTB = new MyRectangle(scene,-3,0.5,3,-0.5);
	this.sideTB.updateTex(1,1);
	this.sideLR = new MyRectangle(scene,-1.75,0.5,1.75,-0.5);
	this.sideLR.updateTex(1,1);
	this.borderTB = new MyRectangle(scene,-3,0.5,3,-0.5);
	this.borderTB.updateTex(1,1);
	this.borderLR = new MyRectangle(scene,-0.75,0.25,0.75,-0.25);
	this.borderLR.updateTex(1,1);
	this.bottom = new MyRectangle(scene,-3,1.75,3,-1.75);
	this.bottom.updateTex(1,1);

	this.rec = new MyRectangle(scene, -0.5, 1, 0.5, -1);
	this.rec.updateTex(1,2);

	this.appearance = scene.defaultApp;
	this.fontText = fontText;

	this.counterW=0;
	this.counterB=0;
};

MyScore.prototype = Object.create(CGFobject.prototype);
MyScore.prototype.constructor = MyScore;

MyScore.prototype.display = function () {

	this.scene.pushMatrix();

		this.scene.rotate(90*degToRad,1,0,0);

 		this.scene.pushMatrix(); //BOTTOM
 			this.scene.translate(0,-0.5,2);
 			this.matWOOD.apply();
 			this.sideTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //LEFT
 			this.scene.translate(0,0,0.25);
 			this.scene.rotate(90*degToRad,0,1,0);
 			this.scene.translate(0,-0.5,3);
 			this.matWOOD.apply();
 			this.sideLR.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //TOP
 			this.scene.rotate(180*degToRad,0,1,0);
 			this.scene.translate(0,-0.5,1.5);
 			this.matWOOD.apply();
 			this.sideTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //RIGHT
 			this.scene.translate(0,0,0.25);
 			this.scene.rotate(-90*degToRad,0,1,0);
 			this.scene.translate(0,-0.5,3);
 			this.matWOOD.apply();
 			this.sideLR.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //BACK
 			this.scene.translate(0,-1,0.25);
 			this.scene.rotate(90*degToRad,1,0,0);
 			this.matWOOD.apply();
 			this.bottom.display();
 		this.scene.popMatrix();

 		//INSIDE

 		this.scene.pushMatrix(); //TOP
 			this.scene.translate(0,-0.5,-0.5);
 			this.scene.scale(0.8325,1,1);
 			this.matWOOD.apply();
 			this.sideTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //RIGHT
 			this.scene.rotate(90*degToRad,0,1,0);
 			this.scene.translate(-0.25,-0.5,-2.5);
 			this.scene.scale(0.43,1,1);
 			this.matWOOD.apply();
 			this.sideLR.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //BOTTOM
 			this.scene.rotate(180*degToRad,0,1,0);
 			this.scene.translate(0,-0.5,-1);
 			this.scene.scale(0.8325,1,1);
 			this.matWOOD.apply();
 			this.sideTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //LEFT
 			this.scene.rotate(-90*degToRad,0,1,0);
 			this.scene.translate(0.25,-0.5,-2.5);
 			this.scene.scale(0.43,1,1);	
 			this.matWOOD.apply();
 			this.sideLR.display();
 		this.scene.popMatrix();

 		//BORDERS

		this.scene.pushMatrix(); //BOTTOM
 			this.scene.translate(0,0,1.5);
 			this.scene.rotate(-90*degToRad,1,0,0);
 			this.matWOOD.apply();
 			this.borderTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //RIGHT
 			this.scene.translate(0,0,0.25);
 			this.scene.rotate(90*degToRad,0,1,0);
 			this.scene.translate(0,0,2.75);
 			this.scene.rotate(-90*degToRad,1,0,0);
 			this.matWOOD.apply();
 			this.borderLR.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //TOP
 			this.scene.rotate(180*degToRad,0,1,0);
 			this.scene.translate(0,0,1);
 			this.scene.rotate(-90*degToRad,1,0,0);
 			this.matWOOD.apply();
 			this.borderTB.display();
 		this.scene.popMatrix();

 		this.scene.pushMatrix(); //LEFT
 			this.scene.translate(0,0,0.25);
 			this.scene.rotate(-90*degToRad,0,1,0);
 			this.scene.translate(0,0,2.75);
 			this.scene.rotate(-90*degToRad,1,0,0);
 			this.matWOOD.apply();
 			this.borderLR.display();
 		this.scene.popMatrix();

 		//TEXT
 		this.appearance.setTexture(this.fontText);
 		this.displayScore();

 	this.scene.popMatrix();
};

MyScore.prototype.displayScore = function () {
	
	this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		var decW = Math.floor(this.counterW/10);
		var uniW = this.counterW%10;

		var decB = Math.floor(this.counterB/10);
		var uniB = this.counterB%10;

		this.scene.translate(0,-0.2,0.25);

		this.scene.activeShader.setUniformsValues({'charCoords': [decB,5]});
		this.scene.pushMatrix();
			this.scene.translate(-2,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniB,5]});
		this.scene.pushMatrix();
			this.scene.translate(-1,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [1,4]});
		this.scene.pushMatrix();
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [decW,5]});
		this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniW,5]});
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	this.scene.popMatrix();
};

MyScore.prototype.setMatWOOD = function (mat) {

	this.matWOOD = mat;
};

MyScore.prototype.setFont = function (font) {

	this.fontText = font;
	this.appearance.setTexture(font);
};

MyScore.prototype.setCounters = function (w,b) {

	this.counterW=w;
	this.counterB=b;
};