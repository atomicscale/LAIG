
 function MyTriangle(scene, p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z) {
 	CGFobject.call(this, scene);


	this.pAx = p1x;
   	this.pAy = p1y; //(0,0)
   	this.pAz = p1z;
   	this.pBx = p2x;
   	this.pBy = p2y; //(0,1)
   	this.pBz = p2z;
   	this.pCx = p3x;
   	this.pCy = p3y;
   	this.pCz = p3z;

   	this.a = Math.sqrt(
   	(this.pCx - this.pBx) * (this.pCx - this.pBx) +
   	(this.pCy - this.pBy) * (this.pCy - this.pBy) +
   	(this.pCz - this.pBz) * (this.pCz - this.pBz)
   	);
   	this.b = Math.sqrt(
   	(this.pAx - this.pCx) * (this.pAx - this.pCx) +
   	(this.pAy - this.pCy) * (this.pAy - this.pCy) +
   	(this.pAz - this.pCz) * (this.pAz - this.pCz)
   	);
   	this.c = Math.sqrt(
   	(this.pBx - this.pAx) * (this.pBx - this.pAx) +
   	(this.pBy - this.pAy) * (this.pBy - this.pAy) +
   	(this.pBz - this.pAz) * (this.pBz - this.pAz)
   	);


   	this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
	this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);

	this.beta = Math.acos(this.cosBeta);
	this.alpha = Math.acos(this.cosAlpha);
	this.gamma = Math.acos(this.cosGamma);

  this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {

   this.primitiveType = this.scene.gl.TRIANGLES;

   this.vertices = [
        this.pAx, this.pAy, this.pAz,
        this.pBx, this.pBy, this.pBz,
        this.pCx, this.pCy, this.pCz
			];

   this.indices = [
            0,1,2
        ];

    this.Ux = this.pBx - this.pAx;
    this.Uy = this.pBy - this.pAy;
    this.Uz = this.pBz - this.pAz;

    this.Vx = this.pCx - this.pAx;
    this.Vy = this.pCy - this.pAy;
    this.Vz = this.pCz - this.pAz;

    this.Nx = ( this.Uy * this.Vz ) - ( this.Uz * this.Vy );
    this.Ny = ( this.Uz * this.Vx ) - ( this.Ux * this.Vz );
    this.Nz = ( this.Ux * this.Vy ) - ( this.Uy * this.Vx );

   this.normals = [
			this.Nx,  this.Ny, this.Nz,
			this.Nx,  this.Ny, this.Nz,
			this.Nx,  this.Ny, this.Nz
		];
		// E se o triangulo for inclinado?

   this.texCoords = [
			0, 1,
			this.c, 1,
   			this.c - this.a*Math.cos(this.beta), 1-this.alpha*Math.sin(this.b)
			];

   this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function (ampS, ampT) {

	this.texCoords = [ //HELP???? http://i.imgur.com/cE44X18.png

			0, 1/ampT,
			this.c/ampS, 1/ampT,
   			(this.c - this.a*Math.cos(this.beta))/ampS, (1-this.alpha*Math.sin(this.b))/ampT
			];

	this.updateTexCoordsGLBuffers();
};
