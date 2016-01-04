/**
 * MyPrism
 * @constructor
 */
function MyCylinder(scene, slices, stacks, size, botradius, topradius) {
  CGFobject.call(this,scene);

  this.slices=slices;
  this.stacks=stacks;
  this.size=size;
  this.botradius=botradius;
  this.topradius=topradius;
  this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {


  var deg2rad = Math.PI / 180.0;
  var ang = 360 / this.slices;
  var a_rad = ang * deg2rad;
  var aux = a_rad / 2;
  var razao = (this.topradius-this.botradius)/this.stacks;
  var z_norm = (this.topradius-this.botradius)/Math.sqrt((this.topradius-this.botradius)*(this.topradius-this.botradius) + this.size*this.size);
  //vertices, normals, indices e texCoords
  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.texCoords = [];

  //Normais , Vertices e TextCoords
  for(var j = 0; j < this.stacks+1; j++){
    for(var i = 0; i < this.slices+1; i++){
     this.vertices.push(Math.cos(a_rad*i)*this.botradius + Math.cos(a_rad*i)*(razao*j),Math.sin(a_rad*i)*this.botradius + Math.sin(a_rad*i)*(razao*j), (j/this.stacks)*this.size);
     this.normals.push(Math.cos(a_rad*i),Math.sin(a_rad*i),-z_norm);
     this.texCoords.push((-ang*i)/360, j/this.stacks);
    }
 }

 //Indices
 for(var j = 0; j < this.stacks; j++){
   for(var i = 0; i < this.slices; i++){
    this.indices.push(i + j*(this.slices + 1),i + j*(this.slices + 1) + 1, i + (j + 1)*(this.slices + 1) + 1);
    this.indices.push(i + j*(this.slices + 1),i + (j + 1)*(this.slices + 1) + 1, i + (j + 1)*(this.slices + 1));
   }
 }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
