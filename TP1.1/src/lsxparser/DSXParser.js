function DSXParser(filename, _scene) {

    _scene.graph = this;

    this.config = {
        scene: _scene,
        camera: new LSXInitials(),
        illumination:{
            global: new LSXIllumination(),
            omniLights: [],
            spotLights: []
        },
        materials: [],
        textures: [],
        textures_path: ("scenes/" + filename).substring(0, ("scenes/" + filename).lastIndexOf("/")) + "/",
        XML:{
            data: new CGFXMLreader(),
            parsedTree:{
                root_id: null,
                nodes: [],
                leaves: []
            },
            path: "scenes/" + filename, 
            loaded: null
        }
    };

    this.config.XML.data.open(this.config.XML.path, this);
}

DSXParser.prototype.onXMLReady = function() {

    this.SuccessMSG("DSX loaded");

    var tempInfo = {
        "element": this.config.XML.data.xmlDoc.documentElement,
        "errorMessage":''
    };

    var parseFunc = [
                        this.parseCamera(tempInfo.element),
                        this.parseIllumination(tempInfo.element), 
                        this.loadLights(tempInfo.element),
                        this.parseTextures(tempInfo.element),
                        this.parseMaterials(tempInfo.element),
                        this.parseLeaves(tempInfo.element),
                        this.parseNodes(tempInfo.element)
    ];

    for(var i = 0; i < parseFunc.length; i++){
        tempInfo.errorMessage = parseFunc[i];

        if (tempInfo.errorMessage != null) {
            this.onXMLError(tempInfo.errorMessage);
            this.config.XML.loaded = false;
            return;
        }
    }

    this.config.XML.loaded = true;
    this.config.scene.onGraphLoaded();
};



DSXParser.prototype.parseCamera = function(element) {

    var cameraStruct = {
        element:{
            data: element.getElementsByTagName('INITIALS')[0],
            error: "views are missing."
        },
        components:{
            frustum:{
                data: element.getElementsByTagName('INITIALS')[0].getElementsByTagName('frustum')[0],
                far:  this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('frustum')[0], 'far'),
                near: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('frustum')[0], 'near'),
                error: "<frustum> element is missing"
            },
            translation: {
                data: element.getElementsByTagName('INITIALS')[0].getElementsByTagName('translation')[0],
                x: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('translation')[0], 'x'),
                y: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('translation')[0], 'y'),
                z: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('translation')[0], 'z'),
                error: "<translation> element is missing"
            },
            rotation: {
                data: element.getElementsByTagName('INITIALS')[0].getElementsByTagName('rotation'),
                error: "Needs 3 <rotation> elements"
            },
            scale: {
                data: element.getElementsByTagName('INITIALS')[0].getElementsByTagName('scale')[0],
                sx: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('scale')[0], 'sx'),
                sy: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('scale')[0], 'sy'),
                sz: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('scale')[0], 'sz'),
                error: "<scale> element is missing"
            },
            reference: {
                data: element.getElementsByTagName('INITIALS')[0].getElementsByTagName('reference')[0],
                lenght: this.config.XML.data.getFloat(element.getElementsByTagName('INITIALS')[0].getElementsByTagName('reference')[0], 'length'),
                error: "<reference> element is missing"
            }
        }
    };

    if(!(this.validateObject(cameraStruct.element.data) &&
        this.validateObject(cameraStruct.components.frustum.data) &&
        this.validateObject(cameraStruct.components.translation.data) &&
        this.validateObject(cameraStruct.components.scale.data) &&
        this.validateObject(cameraStruct.components.reference.data)) &&
        (cameraStruct.components.rotation.data.length != 3 && this.validateObject(cameraStruct.components.rotation.data)))
            return "Camera parse error.";


    this.config.camera.setFrustum(cameraStruct.components.frustum);
    this.config.camera.setTranslation(cameraStruct.components.translation);
    this.config.camera.setScale(cameraStruct.components.scale);
    this.config.camera.setReference(cameraStruct.components.reference);


    for (var i = 0; i < cameraStruct.components.rotation.data.length; i++) 
        this.config.camera.setRotation({
            axis: this.config.XML.data.getItem(cameraStruct.components.rotation.data[i], 'axis', ['x', 'y', 'z']),
            angle: this.config.XML.data.getFloat(cameraStruct.components.rotation.data[i], 'angle')
        });
    

    this.config.camera.info();

    return null;
};

DSXParser.prototype.parseIllumination = function(element) {

    var illuminationStruct = {
        element: {
            data: element.getElementsByTagName('illumination')[0],
            error: 'illumination element is missing.'
        },
        components: {
            ambient:{
                data: (element.getElementsByTagName('illumination')[0]).getElementsByTagName('ambient')[0],
                error: 'ambient element is missing'
            },
            background:{
                data: (element.getElementsByTagName('illumination')[0]).getElementsByTagName('background')[0],
                error: 'background element is missing'
            },
            doublesided:{
                data:(element.getElementsByTagName('illumination')[0]).getAttribute('doublesided'),
                error:'doublesided element is missing'
            },
            doublesided:{
                data:(element.getElementsByTagName('illumination')[0]).getAttribute('local'),
                error:'local element is missing'
            }
        }


    };

    if(!(this.validateObject(illuminationStruct.element.data) &&
        this.validateObject(illuminationStruct.components.ambient.data) &&
        this.validateObject(illuminationStruct.components.background.data)))
            return "Illumination parser Error.";

    this.config.illumination.global.setComponents(this.parseColor(illuminationStruct.components.ambient.data), this.parseColor(illuminationStruct.components.background.data));
    this.config.illumination.global.info();
    

    return null;
};




DSXParser.prototype.loadLights = function(rootElement) {
    var lightElements = rootElement.getElementsByTagName('lights')[0];

    if (lightElements == null) {
        this.onXMLError("Error loading Lights. No Lights Tag");
        return 1;
    }

    this.loadOmniLights(lightElements);
    this.loadSpotLights(lightElements);

    if (this.config.illumination.omniLights.length == 0 && this.config.illumination.spotLights.length == 0) {
        onXMLError("Error No lights defined.");
        return 1;
    }
}


DSXParser.prototype.loadOmniLights = function(lightElements) {
    var omniElements, lightElement, locationElement, location;

    omniElements = lightElements.getElementsByTagName('omni');

    for (var omniElement of omniElements) {
        lightElement = this.loadLightsCommon(omniElement);

        locationElement = omniElement.getElementsByTagName('location')[0];
        location = new Point3W(this.config.XML.data.getFloat(locationElement, 'x'), this.config.XML.data.getFloat(locationElement, 'y'),
            this.config.XML.data.getFloat(locationElement, 'z'), this.config.XML.data.getFloat(locationElement, 'w'));

        this.config.illumination.omniLights.push(new Omni(lightElement, location));
    }
}


DSXParser.prototype.loadSpotLights = function(lightElements) {
    var spotElements, lightElement, angle, exponent, target, location;

    var spotElements = lightElements.getElementsByTagName('spot');

    for (var spotElement of spotElements) {
        lightElement = this.loadLightsCommon(spotElement);
        angle = this.config.XML.data.getFloat(spotElement, 'angle');
        exponent = this.config.XML.data.getFloat(spotElement, 'exponent');
        target = this.getPoint3Element(spotElement.getElementsByTagName('target')[0]);
        location = this.getPoint3Element(spotElement.getElementsByTagName('location')[0]);

        this.config.illumination.spotLights.push(new Spot(lightElement, angle * this.degToRad, exponent, target, location));
    }
}


DSXParser.prototype.loadLightsCommon = function(lightElement) {
    var id, enabled, ambient, diffuse, specular;

    id = this.config.XML.data.getString(lightElement, 'id');
    enabled = this.config.XML.data.getBoolean(lightElement, 'enabled');
    ambient = this.parseColor(lightElement.getElementsByTagName('ambient')[0]);
    diffuse = this.parseColor(lightElement.getElementsByTagName('diffuse')[0]);
    specular = this.parseColor(lightElement.getElementsByTagName('specular')[0]);

    return new Light(id, enabled, ambient, diffuse, specular);
}

DSXParser.prototype.parseTextures = function(element) {

    var texturesStruct = {
        element: {
            data: element.getElementsByTagName('textures')[0],
            error: "<textures> element is missing."
        },
        textures: {
            data: element.getElementsByTagName('textures')[0].getElementsByTagName('texture')
        }

    };

    if(!(this.validateObject(texturesStruct.element.data)))
            return "Textures parser Error.";


    for (var i = 0; i < texturesStruct.textures.data.length; i++) {
        var texture = new DSXTexture(texturesStruct.textures.data[i].getAttribute('id'));

        var relpath = texturesStruct.textures.data[i].getAttribute('file');
        texture.path = this.config.textures_path + relpath;

        texture.leng.s = texturesStruct.textures.data[i].getAttribute('length_s');
        texture.leng.t = texturesStruct.textures.data[i].getAttribute('length_t');

        texture.info();
        this.config.textures.push(texture);
    }

    return null;
};

DSXParser.prototype.parseMaterials = function(element) {

    var materialsStruct = {
        element: {
            data: element.getElementsByTagName('materials')[0],
            error: "<materials> element is missing."
        },
        materials: {
            data: element.getElementsByTagName('materials')[0].getElementsByTagName('material')
        }

    };

    if(!(this.validateObject(materialsStruct.element.data)))
            return "Materials parser Error.";

    for (var i = 0; i < materialsStruct.materials.data.length; i++) {
        var mat = new LSXMaterial(materialsStruct.materials.data[i].getAttribute('id'));
        mat.ambient = this.parseColor(materialsStruct.materials.data[i].getElementsByTagName('ambient')[0]);
        mat.diffuse = this.parseColor(materialsStruct.materials.data[i].getElementsByTagName('diffuse')[0]);
        mat.specular = this.parseColor(materialsStruct.materials.data[i].getElementsByTagName('specular')[0]);
        mat.emission = this.parseColor(materialsStruct.materials.data[i].getElementsByTagName('emission')[0]);

        mat.shininess = this.config.XML.data.getFloat(materialsStruct.materials.data[i].getElementsByTagName('shininess')[0], 'value');

        mat.info();
        this.config.materials.push(mat);
    }

    return null;
};

DSXParser.prototype.parseLeaves = function(element) {
    var leavesStruct = {
        element: {
            data: element.getElementsByTagName('primitives')[0],
            error: "<primitives> element is missing."
        },
        shapes:{
            rectangle:{
                setArgs: function(args, _args){
                    if (_args.length != 4)
                        return "Invalid number of arguments for type 'rectangle'";

                    for (var i = 0; i < _args.length; i++)
                        args.push(parseFloat(_args[i]));
                }
            },
            triangle:{
                setArgs: function(args, _args){
                    if (_args.length != 9)
                    return "Invalid number of arguments for type 'triangle'";

                for (var i = 0; i < _args.length; i++)
                    args.push(parseFloat(_args[i]));
                }
            },
            cylinder:{
                setArgs: function(args, _args){
                    if (_args.length != 5)
                    return "Invalid number of arguments for type 'cylinder'";

                    args.push(parseFloat(_args[0]));
                    args.push(parseFloat(_args[1]));
                    args.push(parseFloat(_args[2]));
                    args.push(parseInt(_args[3]));
                    args.push(parseInt(_args[4]));
                }
            },
            sphere:{
                setArgs: function(args, _args){
                    if (_args.length != 3)
                        return "Invalid number of arguments for type 'sphere'";

                    args.push(parseFloat(_args[0]));
                    args.push(parseInt(_args[1]));
                    args.push(parseInt(_args[2]));
                }
            },
            torus:{
                setArgs: function(args, _args){
                    if (_args.length != 4)
                    return "Invalid number of arguments for type 'torus'";

                    args.push(parseFloat(_args[0]));
                    args.push(parseFloat(_args[1]));
                    args.push(parseInt(_args[2]));
                    args.push(parseInt(_args[3]));
                }
            }
        },
        leaves: {
            data: element.getElementsByTagName('primitives')[0].getElementsByTagName('primitive')
        }

    };

    if(!(this.validateObject(leavesStruct.element.data)))
            return "Leaves parser Error.";



    for (var i = 0; i < leavesStruct.leaves.data.length; i++) {
        var leaf = new LSXLeaf(leavesStruct.leaves.data[i].getAttribute('id'));
        leaf.type = this.config.XML.data.getItem(leavesStruct.leaves.data[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'torus']);

        var args_aux = leavesStruct.leaves.data[i].getAttribute('args').split(" ");
        for (var j = 0; j < args_aux.length; j++) {
            if (args_aux[j] === ""){
                args_aux.splice(j, 1);
                --j;
            }
        }

        leavesStruct.shapes[leaf.type].setArgs(leaf.args, args_aux);

        leaf.info();
        this.config.XML.parsedTree.leaves.push(leaf);
    }

    return null;
};

DSXParser.prototype.parseNodes = function(element) {

    var nodesStruct = {
        element: {
            data: element.getElementsByTagName('components')[0],
            error: "<components> element is missing."
        },
        root:{
            data: element.getElementsByTagName('components')[0].getElementsByTagName('root')[0]
        },
        nodes:{
            data: element.getElementsByTagName('components')[0].getElementsByTagName('component')
        },
        transforms:{
            translate:{
                apply: function(node, x,y,z){
                    var trans = [];
                    trans.push(x);
                    trans.push(y);
                    trans.push(z);
                    mat4.translate(node.matrix, node.matrix, trans);
                }
            },
            scale:{
                apply: function(node, sx, sy, sz){
                    var scale = [];
                    scale.push(sx);
                    scale.push(sy);
                    scale.push(sz);
                    mat4.scale(node.matrix, node.matrix, scale);
                }
            },
            rotate:{
                apply: function(node, axis, angle){
                    var rot = [0, 0, 0];
                    rot[["x", "y", "z"].indexOf(axis)] = 1;
                    mat4.rotate(node.matrix, node.matrix, angle, rot);
                }
            }
        }
    };

    if(!(this.validateObject(nodesStruct.element.data)))
            return "Nodes parser Error.";

    this.config.XML.parsedTree.root_id = this.config.XML.data.getString(nodesStruct.root.data, 'id');
    console.log("ROOT Node: " + this.config.XML.parsedTree.root_id);


    for (var i = 0; i < nodesStruct.nodes.data.length; i++) {
        var node = new LSXNode(nodesStruct.nodes.data[i].getAttribute('id'));
        node.material = this.config.XML.data.getString(nodesStruct.nodes.data[i].getElementsByTagName('material')[0], 'id');
        node.texture = this.config.XML.data.getString(nodesStruct.nodes.data[i].getElementsByTagName('texture')[0], 'id');


        // Transforms
        var children = nodesStruct.nodes.data[i].children;
        for (var j = 0; j < children.length; j++) 
            if(nodesStruct.transforms[children[j].tagName]){
                if(children[j].tagName == 'rotate')
                    nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getItem(children[j], "axis", ["x", "y", "z"]), (this.config.XML.data.getFloat(children[j], "angle") * deg2rad));
                else
                    if(children[j].tagName == 'translate')
                        nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getFloat(children[j], "x"),this.config.XML.data.getFloat(children[j], "y"),this.config.XML.data.getFloat(children[j], "z"));
                    else
                        if(children[j].tagName == 'scale')
                            nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getFloat(children[j], "sx"),this.config.XML.data.getFloat(children[j], "sy"),this.config.XML.data.getFloat(children[j], "sz"));

            }      


        //Descendants
         var desc = nodesStruct.nodes.data[i].getElementsByTagName('children')[0];
        if (desc == null) return "No <children> tag found";

        var d_list = desc.getElementsByTagName('primitiveref');
        var p_list = desc.getElementsByTagName('componentref');

        for (var j = 0; j < d_list.length; j++) 
            node.descendants.push(d_list[j].getAttribute('id'));

        for (var j = 0; j < p_list.length; j++)
            node.descendants.push(p_list[j].getAttribute('id'));
        
        this.config.XML.parsedTree.nodes.push(node);
    }
    return null;
};

DSXParser.prototype.parseColor = function(element) {
    var color = {};
    color.r = this.config.XML.data.getFloat(element, 'r');
    color.g = this.config.XML.data.getFloat(element, 'g');
    color.b = this.config.XML.data.getFloat(element, 'b');
    color.a = this.config.XML.data.getFloat(element, 'a');
    return color;
};
DSXParser.prototype.getPoint3Element = function(element) {
    if (element == null) {
        this.onXMLError("Error loading 'Point3' element .");
        return 1;
    }

    var res = new Point3(this.config.XML.data.getFloat(element, 'x'), this.config.XML.data.getFloat(element, 'y'),
        this.config.XML.data.getFloat(element, 'z'));

    return res;
}
DSXParser.prototype.findNode = function(id) {
    for (i = 0; i < this.config.XML.parsedTree.nodes.length; i++)
        if (this.config.XML.parsedTree.nodes[i].id == id) return this.config.XML.parsedTree.nodes[i];

    return null;
};

function printColor(c) {
    return "(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
}
DSXParser
DSXParser.prototype.validateObject = function(data){
    if (data == null){ 
        console.log(data.error);
        return 0;
    }
    else
        return 1;
}

DSXParser.prototype.SuccessMSG = function(message){
    console.log("Operation succeeded. " + message);
}
DSXParser.prototype.onXMLError = function(message) {
    console.error("Operation failed.\nError: " + message);
};

class Light {
  constructor(id, enabled, ambient, diffuse, specular) {
    this.id = id;
    this.enabled = enabled;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
  }
}


class Omni extends Light {
  constructor(light, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.location = location;
  }
}


class Spot extends Light{
  constructor(light, angle, exponent, target, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.angle = angle;
    this.exponent = exponent;
    this.location = location;
    this.direction = new Point3(target.x - location.x, target.y - location.y, target.z - location.z);
  }
}

class Point3W {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
}
class Point3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}