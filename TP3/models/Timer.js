/**
 * Timer
 * @constructor
 */
function Timer(scene, matWOOD, fontText) {
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

	this.minutes=0;
	this.seconds=0;
	this.timeBeg=null;
	this.paused=false;
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.display = function () {

	this.scene.pushMatrix();

		this.scene.rotate(90*degToRad,1,0,0);

 		//TEXT
 		this.appearance.setTexture(this.fontText);
 		if(this.paused) this.displayPaused();
 		else this.displayTime();

 	this.scene.popMatrix();
};

Timer.prototype.displayTime = function () {
	
	this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		var decM = Math.floor(this.minutes/10);
		if(decM>=10) decM%=10;
		var uniM = this.minutes%10;

		var decS = Math.floor(this.seconds/10);
		var uniS = this.seconds%10;

		this.scene.translate(0,-0.2,0.25);

		this.scene.activeShader.setUniformsValues({'charCoords': [decM,5]});
		this.scene.pushMatrix();
			this.scene.translate(-5,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniM,5]});
		this.scene.pushMatrix();
			this.scene.translate(-4,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [5,3]});
		this.scene.pushMatrix();
		this.scene.translate(-3,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [decS,5]});
		this.scene.pushMatrix();
			this.scene.translate(-2,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniS,5]});
		this.scene.pushMatrix();
			this.scene.translate(-1,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	this.scene.popMatrix();
};

Timer.prototype.displayPaused = function () {
	
	this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		this.scene.translate(0,-0.2,0.25);

		this.scene.activeShader.setUniformsValues({'charCoords': [5,1]});
		this.scene.pushMatrix();
			this.scene.translate(-2,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [0,0]});
		this.scene.pushMatrix();
			this.scene.translate(-1,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [0,2]});
		this.scene.pushMatrix();
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [8,1]});
		this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [4,0]});
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			this.scene.rotate(-90*degToRad,1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	this.scene.popMatrix();
};

Timer.prototype.setMatWOOD = function (mat) {

	this.matWOOD = mat;
};

Timer.prototype.setFont = function (font) {

	this.fontText = font;
	this.appearance.setTexture(font);
};

Timer.prototype.updateTime = function (currTime) {

	var time_since_start = currTime - this.timeBeg;
	var total_seconds = Math.floor(time_since_start/1000);
	this.minutes=Math.floor(total_seconds/60);
	this.seconds=Math.floor(total_seconds%60);
};

Timer.prototype.setPaused = function (bool) {

	this.paused=bool;
};