/**
 * Board
 * @constructor
 */
function Board(scene, matWOOD, matWHITE, matBLACK) {
 	CGFobject.call(this,scene);
	
 	this.scene=scene;
 	this.matWOOD=matWOOD;
 	this.matWHITE=matWHITE;
 	this.matBLACK=matBLACK;

	this.bottom = new MyRectangle(scene,-5.7,5.7,5.7,-5.7);
	this.bottom.updateTex(1,1);
	
    
    this.cells = [];
    for(i=0;i<64; i++) {
    	this.cells.push(new MyRectangle(scene,-0.65,0.65,0.65,-0.65))
    	this.cells[this.cells.length-1].updateTex(1,1);
    }
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function () {

 	for(i=0;i<8;i++)
 	{
 		for(j=0;j<8;j++)
 		{
			this.scene.pushMatrix();
 				this.scene.translate(i*1.30-(1.30*7)/2,0,(1.30*7)/2-j*1.30);
 				this.scene.rotate(-90*degToRad,1,0,0);
 				if((i%2==0 && j%2==0) || (i%2!=0 && j%2!=0) ) this.matWHITE.apply();
 				else this.matBLACK.apply();
 				this.scene.registerForPick(i*8+j+1, this.cells[i*8+j]);
 				this.cells[i*8+j].display();
 			this.scene.popMatrix();
 		}
 	}
};

Board.prototype.setMatWOOD = function (mat) {

	this.matWOOD = mat;
}