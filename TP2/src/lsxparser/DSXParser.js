function DSXParser(filename, _scene) {

    _scene.graph = this;

    this.degToRad = Math.PI / 180.0;

    this.config = {
        scene: _scene,
        perspectives: [],
        illumination:{
            global: new LSXIllumination(),
            omniLights: [],
            spotLights: []
        },
        materials: [],
        animations: [],
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
                        this.loadViews(tempInfo.element),
                        this.parseIllumination(tempInfo.element), 
                        this.loadLights(tempInfo.element),
                        this.parseTextures(tempInfo.element),
                        this.parseMaterials(tempInfo.element),
                        this.parseLeaves(tempInfo.element),
                        this.parseNodes(tempInfo.element),
                        this.parseAnimations(tempInfo.element)
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


DSXParser.prototype.loadViews = function(element) {
    var viewElement, perspectiveElements, id, near, far, angle, from, to;

    viewElement = element.getElementsByTagName('views')[0];
    if (viewElement == null) {
        this.onXMLError("Error loading view. No views Tag");
        return 1;
    }


    perspectiveElements = viewElement.getElementsByTagName('perspective');

    if (perspectiveElements.length == 0) {
        this.onXMLError("at least one perspective should be declared");
        return 1;
    }

    for (var perspectiveElement of perspectiveElements) {
        id = this.config.XML.data.getString(perspectiveElement, 'id');
        near = this.config.XML.data.getFloat(perspectiveElement, 'near');
        far = this.config.XML.data.getFloat(perspectiveElement, 'far');
        angle = this.config.XML.data.getFloat(perspectiveElement, 'angle');
        from = this.getPoint3Element(perspectiveElement.getElementsByTagName('from')[0]);
        to = this.getPoint3Element(perspectiveElement.getElementsByTagName('to')[0]);


        this.config.perspectives.push(new CGFcamera(angle * this.degToRad, near, far,
            vec3.fromValues(from.x, from.y, from.z),
            vec3.fromValues(to.x, to.y, to.z)))
    }
    console.log("perspetivasssssssssssssssssssssssssssss");
    console.log(this.config.perspectives);
    
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

DSXParser.prototype.parseAnimations = function(mainElement) {

var animations_list = mainElement.getElementsByTagName('animations')[0];
    if (animations_list == null) return "<animations> element is missing.";

    var animations = animations_list.getElementsByTagName('animation');

    for (var i = 0; i < animations.length; ++i) {
        var id = animations[i].getAttribute('id');
        var span = this.config.XML.data.getFloat(animations[i], 'span');
        var type = this.config.XML.data.getString(animations[i], 'type');
        var args = [];

        if (type == "linear") {
            var cps = animations[i].getElementsByTagName('controlpoint');
            for (var k = 0; k < cps.length; ++k) {
                var cp = [];
                cp.push(this.config.XML.data.getFloat(cps[k], 'xx'));
                cp.push(this.config.XML.data.getFloat(cps[k], 'yy'));
                cp.push(this.config.XML.data.getFloat(cps[k], 'zz'));

                args.push(cp);
            }
        } else if (type == "circular") {
            args["center"] = this.config.XML.data.getVector3(animations[i], 'center');
            args["radius"] = this.config.XML.data.getFloat(animations[i], 'radius');
            args["startang"] = this.config.XML.data.getFloat(animations[i], 'startang');
            args["rotang"] = this.config.XML.data.getFloat(animations[i], 'rotang');
        }

        this.config.animations.push(new LSXAnimation(id, span, type, args));

    }

};

DSXParser.prototype.parseLeaves = function(element) {
   var leaves_list = element.getElementsByTagName('primitives')[0];
    
    if (leaves_list == null) 
        return "<primitives> element is missing.";

    var leaves = leaves_list.getElementsByTagName('primitive');

    for (i = 0; i < leaves.length; i++) {
        var leaf = new LSXLeaf(leaves[i].getAttribute('id'));
        leaf.type = this.config.XML.data.getString(leaves[i], 'type');

        var noargslist = ['terrain', 'plane', 'patch', 'chessboard', 'vehicle'];

        if (noargslist.indexOf(leaf.type) < 0) {
            var args_aux = leaves[i].getAttribute('args').split(" ");
            for (var j = 0; j < args_aux.length; j++) {
                if (args_aux[j] === "") {
                    args_aux.splice(j, 1);
                    --j;
                }
            }
        }

        switch (leaf.type) {
            case "rectangle":
                if (args_aux.length != 4)
                    return "Invalid number of arguments for type 'rectangle'";

                for (var j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            case "cylinder":
                if (args_aux.length != 5)
                    return "Invalid number of arguments for type 'cylinder'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseFloat(args_aux[1]));
                leaf.args.push(parseFloat(args_aux[2]));
                leaf.args.push(parseInt(args_aux[3]));
                leaf.args.push(parseInt(args_aux[4]));
                break;
            case "sphere":
                if (args_aux.length != 3)
                    return "Invalid number of arguments for type 'sphere'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseInt(args_aux[1]));
                leaf.args.push(parseInt(args_aux[2]));
                break;
            case "triangle":
                if (args_aux.length != 9)
                    return "Invalid number of arguments for type 'triangle'";

                for (j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            case "torus":
                if (args_aux.length != 4)
                    return "Invalid number of arguments for type 'torus'";

                for (j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));
                
                break;
            case "plane":
                if (args_aux.length != 4)
                    return "Invalid number of arguments for type 'plane'";

                var dX = this.config.XML.data.getFloat(leaves[i], 'dimX');
                var dY = this.config.XML.data.getFloat(leaves[i], 'dimY');
                var partsX = this.config.XML.data.getInteger(leaves[i], 'partsX');
                var partsY = this.config.XML.data.getInteger(leaves[i], 'partsY');
                leaf.args.push(dX);
                leaf.args.push(dY);
                leaf.args.push(partsX);
                leaf.args.push(partsY);
                
                break;
            case "patch":
                var orderU = this.config.XML.data.getInteger(leaves[i], 'orderU');
                var orderV = this.config.XML.data.getInteger(leaves[i], 'orderV');
                leaf.args.push(orderU);
                leaf.args.push(orderV);
                leaf.args.push(this.config.XML.data.getInteger(leaves[i], 'partsU'));
                leaf.args.push(this.config.XML.data.getInteger(leaves[i], 'partsV'));
                var cps = [];
                var cps_list = leaves[i].getElementsByTagName('controlpoint');
                for (var k = 0; k < cps_list.length; ++k) {
                    var cp = [];
                    cp[0] = this.config.XML.data.getFloat(cps_list[k], 'x');
                    cp[1] = this.config.XML.data.getFloat(cps_list[k], 'y');
                    cp[2] = this.config.XML.data.getFloat(cps_list[k], 'z');
                    cp[3] = 1;
                    cps.push(cp);
                }
                if (cps.length != 12) return "Invalid number of control points";
                leaf.args.push(cps);
                break;
            case "chessboard":
                var du = this.config.XML.data.getFloat(leaves[i], 'du');
                var dv = this.config.XML.data.getFloat(leaves[i], 'dv');
                var textureref = this.config.textures_path;
                textureref += this.config.XML.data.getString(leaves[i], 'textureref');
                var su = this.config.XML.data.getFloat(leaves[i], 'su');
                var sv = this.config.XML.data.getFloat(leaves[i], 'sv');
                leaf.args.push(du);
                leaf.args.push(dv);
                leaf.args.push(textureref);
                leaf.args.push(su);
                leaf.args.push(sv);
                

                var c1s = [];
                var c1s_list = leaves[i].getElementsByTagName('c1');
                for (var k = 0; k < c1s_list.length; ++k) {
                    var c1 = [];
                    c1[0] = this.config.XML.data.getFloat(c1s_list[k], 'r');
                    c1[1] = this.config.XML.data.getFloat(c1s_list[k], 'g');
                    c1[2] = this.config.XML.data.getFloat(c1s_list[k], 'b');
                    c1[3] = this.config.XML.data.getFloat(c1s_list[k], 'a');;
                    c1s.push(c1);
                }
                leaf.args.push(c1s);

                var c2s = [];
                var c2s_list = leaves[i].getElementsByTagName('c2');
                for (var k = 0; k < c2s_list.length; ++k) {
                    var c2 = [];
                    c2[0] = this.config.XML.data.getFloat(c2s_list[k], 'r');
                    c2[1] = this.config.XML.data.getFloat(c2s_list[k], 'g');
                    c2[2] = this.config.XML.data.getFloat(c2s_list[k], 'b');
                    c2[3] = this.config.XML.data.getFloat(c2s_list[k], 'a');;
                    c2s.push(c2);
                }
                leaf.args.push(c2s);

                var c3s = [];
                var c3s_list = leaves[i].getElementsByTagName('cs');
                for (var k = 0; k < c3s_list.length; ++k) {
                    var c3 = [];
                    c3[0] = this.config.XML.data.getFloat(c3s_list[k], 'r');
                    c3[1] = this.config.XML.data.getFloat(c3s_list[k], 'g');
                    c3[2] = this.config.XML.data.getFloat(c3s_list[k], 'b');
                    c3[3] = this.config.XML.data.getFloat(c3s_list[k], 'a');;
                    c3s.push(c3);
                }
                leaf.args.push(c3s);
                break;
                case "vehicle":
                break;

            }
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

    var node_anims = nodesStruct.nodes.data[i].getElementsByTagName('animationref');

        for (var j = 0; j < node_anims.length; ++j) {
            var anim_id = node_anims[j].getAttribute("id");
            node.anims.push(anim_id);
        }
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

DSXParser.prototype.getRGBAElement = function(element) {
    if (element == null) {
        this.onXMLError("Error loading 'RGBA' element .");
        return 1;
    }

    var res = new ColorRGBA(this.config.XML.getFloat(element, 'r'), this.config.XML.getFloat(element, 'g'),
        this.config.XML.getFloat(element, 'b'), this.config.XML.getFloat(element, 'a'));

    return res;
}

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

