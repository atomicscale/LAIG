function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * Function that adds a button to control the scene lights.
 * Note: It's called when lights are created and added to the scene
 */
Interface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.omni = this.gui.addFolder("Omnilights");
    this.omni.open();

    this.spot = this.gui.addFolder("Spotlights");
    this.spot.open();

    return true;
};

Interface.prototype.addLight = function(type, i, name) {
    if (type == "omni")
        this.omni.add(this.scene.lightsStatus, i, this.scene.lightsStatus[i]).name(name);
    else
        this.spot.add(this.scene.lightsStatus, i, this.scene.lightsStatus[i]).name(name);

}
