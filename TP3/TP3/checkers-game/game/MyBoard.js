/*
 *    MyBoard File
 */

function MyBoard(scene) {

   CGFobject.call(this,scene);
   this.scene = scene;


   this.cells = [];

   this.cells[1] = new MySquare(this.scene,1);
   this.cells[2] = new MySquare(this.scene,2);
   this.cells[3] = new MySquare(this.scene,3);
   this.cells[4] = new MySquare(this.scene,4);
   this.cells[5] = new MySquare(this.scene,5);
   this.cells[6] = new MySquare(this.scene,6);
   this.cells[7] = new MySquare(this.scene,7);
   this.cells[8] = new MySquare(this.scene,8);
   this.cells[9] = new MySquare(this.scene,9);
   this.cells[10] = new MySquare(this.scene,10);
   this.cells[11] = new MySquare(this.scene,11);
   this.cells[12] = new MySquare(this.scene,12);
   this.cells[13] = new MySquare(this.scene,13);
   this.cells[14] = new MySquare(this.scene,14);
   this.cells[15] = new MySquare(this.scene,15);
   this.cells[16] = new MySquare(this.scene,16);
   this.cells[17] = new MySquare(this.scene,17);
   this.cells[18] = new MySquare(this.scene,18);
   this.cells[19] = new MySquare(this.scene,19);
   this.cells[20] = new MySquare(this.scene,20);
   this.cells[21] = new MySquare(this.scene,21);
   this.cells[22] = new MySquare(this.scene,22);
   this.cells[23] = new MySquare(this.scene,23);
   this.cells[24] = new MySquare(this.scene,24);
   this.cells[25] = new MySquare(this.scene,25);
   this.cells[26] = new MySquare(this.scene,26);
   this.cells[27] = new MySquare(this.scene,27);
   this.cells[28] = new MySquare(this.scene,28);
   this.cells[29] = new MySquare(this.scene,29);
   this.cells[30] = new MySquare(this.scene,30);
   this.cells[31] = new MySquare(this.scene,31);
   this.cells[32] = new MySquare(this.scene,32);
   this.cells[33] = new MySquare(this.scene,33);
   this.cells[34] = new MySquare(this.scene,34);
   this.cells[35] = new MySquare(this.scene,35);
   this.cells[36] = new MySquare(this.scene,36);
   this.cells[37] = new MySquare(this.scene,37);
   this.cells[38] = new MySquare(this.scene,38);
   this.cells[39] = new MySquare(this.scene,39);
   this.cells[40] = new MySquare(this.scene,40);
   this.cells[41] = new MySquare(this.scene,41);
   this.cells[42] = new MySquare(this.scene,42);
   this.cells[43] = new MySquare(this.scene,43);
   this.cells[44] = new MySquare(this.scene,44);
   this.cells[45] = new MySquare(this.scene,45);
   this.cells[46] = new MySquare(this.scene,46);
   this.cells[47] = new MySquare(this.scene,47);
   this.cells[48] = new MySquare(this.scene,48);
   this.cells[49] = new MySquare(this.scene,49);
   this.cells[50] = new MySquare(this.scene,50);
   this.cells[51] = new MySquare(this.scene,51);
   this.cells[52] = new MySquare(this.scene,52);
   this.cells[53] = new MySquare(this.scene,53);
   this.cells[54] = new MySquare(this.scene,54);
   this.cells[55] = new MySquare(this.scene,55);
   this.cells[56] = new MySquare(this.scene,56);
   this.cells[57] = new MySquare(this.scene,57);
   this.cells[58] = new MySquare(this.scene,58);
   this.cells[59] = new MySquare(this.scene,59);
   this.cells[60] = new MySquare(this.scene,60);
   this.cells[61] = new MySquare(this.scene,61);
   this.cells[62] = new MySquare(this.scene,62);
   this.cells[63] = new MySquare(this.scene,63);
   this.cells[64] = new MySquare(this.scene,64);



   this.cellAppearance = new CGFappearance(this.scene);
   this.cellAppearance.loadTexture("scenes/Textures/cell.jpg");

}

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.displayCell = function(id) {

  this.scene.pushMatrix();

  if(id <= 8){
    var incrementX = 0;
    var incrementY = 8 - id;
  } else if(id <= 16){
    var incrementX = 1;
    var incrementY = 16 - id;
  } else if(id <= 24){
    var incrementX = 2;
    var incrementY = 24 - id;
  } else if(id <= 32){
    var incrementX = 3;
    var incrementY = 32 -id;
  } else if(id <= 40){
    var incrementX = 4;
    var incrementY = 40 - id;
  } else if(id <= 48){
    var incrementX = 5;
    var incrementY = 48 -id;
  } else if(id <= 56){
    var incrementX = 6;
    var incrementY = 56 - id;
  } else if(id <= 64){
    var incrementX = 7;
    var incrementY = 64 - id;
  }

  this.scene.rotate(3 * Math.PI/2, 1, 0, 0);
  this.scene.scale(5, 5, 1);
  this.scene.translate(incrementX, incrementY - 8, 0);
  this.cellAppearance.apply();
  this.cells[id].display();


  this.scene.popMatrix();

}
