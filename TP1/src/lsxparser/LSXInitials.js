function LSXInitials() {
    this.frustum = {
        near: 0.0,
        far: 0.0
    };
    this.translation = {
        x: 0.0,
        y: 0.0,
        z: 0.0
    };
    this.rotations = [];
    this.scale = {
        sx: 1.0,
        sy: 1.0,
        sz: 1.0
    };

    this.defaultValues = true;

    this.reference = 0.0;

    this.setFrustum = function(data){
        this.frustum.near = data.near;
        this.frustum.far = data.far;
        this.defaultValues = false;
    };

    this.setTranslation = function(data){
        this.translation.x = data.x;
        this.translation.y = data.y;
        this.translation.z = data.z;
        this.defaultValues = false;
    };

    this.setScale = function(data){
        this.scale.sx = data.sx;
        this.scale.sy = data.sy;
        this.scale.sz = data.sz;
        this.defaultValues = false;
    };

    this.setReference = function(data){
        this.reference = data.length;
        this.defaultValues = false;
    };

    this.setRotation = function(data){
        this.rotations.push(data);
        this.defaultValues = false;
    }

    this.info = function() {
        if(this.defaultValues)
            console.log('Camera - Default values\n');
        else
            console.log('Camera - Not default values\n');

        console.log("Frustum: {\n   near: " + this.frustum.near + "\n   far: " + this.frustum.far + '}');
        console.log("Translation: (" + this.translation.x + " " + this.translation.y + " " + this.translation.z + ')');
        for (i = 0; i < this.rotations.length; i++)
            console.log("Rotation " + (i + 1) + ": " + this.rotations[i].axis + "> " + this.rotations[i].angle);
        console.log("Scale: " + this.scale.sx + " " + this.scale.sy + " " + this.scale.sz);
        console.log("Reference: " + this.reference);

    };
}
