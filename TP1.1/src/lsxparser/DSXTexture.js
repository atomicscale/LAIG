function DSXTexture(id) {
    this.id = id;
    this.path = "";
    this.leng = {
        s: 0.0,
        t: 0.0
    };

    this.info = function() {
        console.log("Texture " + this.id + " Path:" + this.path + " length_s:" + this.leng.s + " length_t:" + this.leng.t);
    };
}
