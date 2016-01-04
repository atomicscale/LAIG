
 function MySphere(scene, slices, stacks, radius) {
 	CGFobject.call(this,scene);

   this.updatableTexCoords=false;
   this.slices=slices;
   this.stacks=stacks;
   this.radius=radius;
   this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

  var deg2rad=Math.PI/180.0;
  var ang1 = 360/this.slices;
  var a_rad1=ang1*deg2rad;
  var ang2 = 180/this.stacks;
  var a_rad2=ang2*deg2rad;
  var half_pi = Math.PI/2;

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.texCoords = [];



  //Normais e Vértices
  for(var j = 0; j <= this.stacks; j++){
    for(var i = 0; i <= this.slices; i++){
      this.vertices.push(this.radius * Math.cos(a_rad2*j-half_pi) * Math.cos(a_rad1*i), this.radius * Math.cos(a_rad2*j-half_pi) * Math.sin(a_rad1*i), this.radius*Math.sin(a_rad2*j-half_pi));
      this.normals.push(this.radius * Math.cos(a_rad2*j-half_pi) * Math.cos(a_rad1*i), this.radius * Math.cos(a_rad2*j-half_pi) * Math.sin(a_rad1*i), this.radius*Math.sin(a_rad2*j-half_pi));
      this.texCoords.push(-i/this.slices,j/this.stacks);

     }
   }

  //Indices
  for(var j = 0; j < this.stacks; j++){
    for(var i = 0; i < this.slices; i++){
      this.indices.push(i+1+(j+1)*(this.slices+1), i+j*(this.slices+1), i+1+j*(this.slices+1));
      this.indices.push(i+j*(this.slices+1), i+1+(j+1)*(this.slices+1), i+(j+1)*(this.slices+1));
   }
 }


  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();

};
