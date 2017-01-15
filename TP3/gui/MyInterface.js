/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	//  http://workshop.chromeexperiments.com/examples/gui
	this.gui = new dat.GUI();

	this.f1 = this.gui.addFolder('Environment Setup');

	this.f1.add(this.scene,"freeCam").name("Free Camera");
	this.f1.add(this.scene,"lockCam").name("Lock Camera");

	this.f1.add(this.scene,"alt_skin").name("Change Skin");

	this.f1.add(this.scene,"changeBackground").name("Change BG");

	this.f2 = this.gui.addFolder('Camera Setup');
	this.f2.add(this.scene,"cameraTimer").name("Score and Timer");

	this.f2.add(this.scene,"cameraBlack").name("Black Pieces");
	this.f2.add(this.scene,"cameraWhite").name("White Pieces");

	this.f2.add(this.scene,"cameraTopWhite").name("Top View");

	this.f3 = this.gui.addFolder('Game Options');

	this.f3.add(this.scene,"start_film").name("Start Film");

	this.f3.add(this.scene,"undo").name("Undo");

	this.gui.close();

	return true;
};

/**
 * processKeyDown
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	//CGFinterface.prototype.processKeyDown.call(this,event);

	var num = event.keyCode - 76;
	if(num<0 || num>7) num = event.keyCode - 76;
	if(num<0 || num>7) return;
	
	this.scene.lights[num].ena = !(this.scene.lights[num].ena);
	//this.scene.lights[num].setVisible(this.scene.lights[num].ena);
	console.log("LIGHT["+num+"] ("+this.scene.graph.lights[num].id+") toggled")

};

