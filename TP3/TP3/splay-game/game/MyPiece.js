/*
 * MyPiece File
 */


function MyPiece(scene, id, type, row, col, height){

  this.scene = scene;
  this.id = id;
  this.type = type;

  this.row = row;
  this.col = col;
  this.height = height;

  this.cylinder = new MyFullCylinder(scene,[1,1.75,1.75,16,16]);

  this.white = new CGFappearance(this.scene);
  this.white.setAmbient(1,1,1,1);
  this.white.setDiffuse(1,1,1,1);
  this.white.setSpecular(1,1,1,1);
  this.white.setShininess(50);


  this.black = new CGFappearance(this.scene);
  this.black.setAmbient(0,0,0,0);
  this.black.setDiffuse(0,0,0,0);
  this.black.setSpecular(0,0,0,0);
  this.black.setShininess(50);

}


MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.display = function() {

  if(this.type == 0){           /* Black piece */

      this.scene.pushMatrix();
      this.scene.rotate(Math.PI/2, 1, 0, 0);
      this.scene.translate(0, 0, -1);
      this.scene.translate(5*this.row + 2.4, 5*this.col + 2.4, -this.height*1.05);
      this.black.apply();
      this.cylinder.display();
      this.scene.popMatrix();

  } else if (this.type == 1 && this.id < 37){   /* White Piece */

      this.scene.pushMatrix();
      this.scene.rotate(Math.PI/2, 1, 0, 0);
      this.scene.translate(0, 0, -1);
      this.scene.translate(5*this.row + 2.4, 5*this.col + 2.4, -this.height*1.05);
      this.white.apply();
      this.cylinder.display();
      this.scene.popMatrix();

  } else {                      /* EmptyCell */

  }

}

MyPiece.prototype.getType = function(){
  return this.type;
}

MyPiece.prototype.getid = function(){
	return this.id;
}

MyPiece.prototype.getRow = function(){
  return this.row;
}

MyPiece.prototype.getCol = function(){
  return this.col;
}

MyPiece.prototype.getHeight = function(){
  return this.height;
}


MyPiece.prototype.setRow = function(newRow){
  this.row = newRow;
}

MyPiece.prototype.setCol = function(newCol){
   this.col = newCol;
}

MyPiece.prototype.setHeight = function(newH){
  this.height = newH;
}




MyPiece.prototype.objectName = function(){

	if(this.type == 0)
    return "BlackPiece";
  else if(this.type == 1)
    return "WhitePiece";
  else
    return "EmptyPiece";

}
