function LSXIllumination() {
    this.ambient = {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
    };
    this.background = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
    };

    this.defaultValues = true;

    this.setComponents = function(ambient, background){
        this.ambient    = ambient;
        this.background = background;
        this.defaultValues    = false
    }

    this.info = function() {
        if(this.defaultValues)
            console.log('illumination - Default values\n');
        else
            console.log('illumination - Not default values\n');

        console.log('{\n ambient: (' + this.ambient.r + ',' + this.ambient.g + ',' + this.ambient.b + ',' + this.ambient.a + '),\n   background: (' + this.background.r + ',' + this.background.g + ',' + this.background.b + ',' + this.background.a + ')\n}');
    };
}
