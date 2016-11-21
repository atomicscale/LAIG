function MyChessboard(scene,args) {
    CGFobject.call(this, scene);
    this.args = args;

    this.du = this.args[0];
    this.dv = this.args[1];
    this.texture = new CGFtexture(scene, this.args[2]);

    this.su = this.args[3];
    this.dv = this.args[4];

    this.c1 = this.args[5];
    this.c2 = this.args[6];
    this.cs = this.args[7];

    this.shader = new CGFshader(scene.gl, "shaders/texture1.vert", "shaders/texture1.frag");
    this.plane = new MyPlane(scene, [1, 1, this.du*5, this.dv*5]);

    this.sv=this.dv-(this.sv+1);

    this.shader.setUniformsValues({uSampler : 0,
                                  color1 : [this.c1[0][0], this.c1[0][1], this.c1[0][2], this.c1[0][3]],
                                  color2 : [this.c2[0][0], this.c2[0][1], this.c2[0][2], this.c2[0][3]],
                                  colorMark : [this.cs[0][0], this.cs[0][1], this.cs[0][2], this.cs[0][3]],
                                  divU:parseInt(this.du)*1.0,
                                  divV:parseInt(this.dv)*1.0,
                                  sU:parseInt(this.su)*1.0,
                                  sV:parseInt(this.sv)*1.0
                                  });

};


MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function() {

    this.texture.bind(0);

    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

};