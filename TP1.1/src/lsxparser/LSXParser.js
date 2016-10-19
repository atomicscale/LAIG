function DSXParser(filename, _scene) {

    _scene.graph = this;

    this.config = {
        scene: _scene,
        camera: new LSXInitials(),
        illumination:{
            global: new LSXIllumination(),
            lights: []
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

    this.SuccessMSG("LSX loaded");

    var tempInfo = {
        "element": this.config.XML.data.xmlDoc.documentElement,
        "errorMessage":''
    };

    var parseFunc = [
                        this.parseCamera(tempInfo.element),
                        this.parseIllumination(tempInfo.element), 
                        this.parseLights(tempInfo.element),
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
            data: element.getElementsByTagName('ILLUMINATION')[0],
            error: 'ILLUMINATION element is missing.'
        },
        components: {
            ambient:{
                data: (element.getElementsByTagName('ILLUMINATION')[0]).getElementsByTagName('ambient')[0],
                error: 'ambient element is missing'
            },
            background:{
                data: (element.getElementsByTagName('ILLUMINATION')[0]).getElementsByTagName('background')[0],
                error: 'background element is missing'
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



DSXParser.prototype.parseLights = function(element) {

    var lightsStruct = {
        element: {
            data: element.getElementsByTagName('LIGHTS')[0],
            error: "<LIGHTS> element is missing."
        },
        lights: {
            data: element.getElementsByTagName('LIGHTS')[0].getElementsByTagName('LIGHT')
        }

    };

    if(!(this.validateObject(lightsStruct.element.data)))
            return "Lights parser Error.";

    for (var i = 0; i < lightsStruct.lights.data.length; i++) {

        var light = new LSXLight(this.config.XML.data.getString(lightsStruct.lights.data[i], 'id'));
        light.enabled = this.config.XML.data.getBoolean(lightsStruct.lights.data[i].getElementsByTagName('enable')[0], 'value');
        light.ambient = this.parseColor(lightsStruct.lights.data[i].getElementsByTagName('ambient')[0]);
        light.diffuse = this.parseColor(lightsStruct.lights.data[i].getElementsByTagName('diffuse')[0]);
        light.specular = this.parseColor(lightsStruct.lights.data[i].getElementsByTagName('specular')[0]);

        var aux = lightsStruct.lights.data[i].getElementsByTagName('position')[0];
        light.position.x = this.config.XML.data.getFloat(aux, 'x');
        light.position.y = this.config.XML.data.getFloat(aux, 'y');
        light.position.z = this.config.XML.data.getFloat(aux, 'z');
        light.position.w = this.config.XML.data.getFloat(aux, 'w');

        light.info();
        this.config.illumination.lights.push(light);
    }

    return null;
};

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
        var texture = new LSXTexture(texturesStruct.textures.data[i].getAttribute('id'));

        var relpath = texturesStruct.textures.data[i].getElementsByTagName('file')[0].getAttribute('path');
        texture.path = this.config.textures_path + relpath;

        var aux = texturesStruct.textures.data[i].getElementsByTagName('amplif_factor')[0];
        texture.amplif_factor.s = this.config.XML.data.getFloat(aux, 's');
        texture.amplif_factor.t = this.config.XML.data.getFloat(aux, 't');

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
            }
        },
        leaves: {
            data: element.getElementsByTagName('LEAVES')[0].getElementsByTagName('LEAF')
        }

    };

    if(!(this.validateObject(leavesStruct.element.data)))
            return "Leaves parser Error.";



    for (var i = 0; i < leavesStruct.leaves.data.length; i++) {
        var leaf = new LSXLeaf(leavesStruct.leaves.data[i].getAttribute('id'));
        leaf.type = this.config.XML.data.getItem(leavesStruct.leaves.data[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);

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
            data: element.getElementsByTagName('NODES')[0],
            error: "<NODES> element is missing."
        },
        root:{
            data: element.getElementsByTagName('NODES')[0].getElementsByTagName('ROOT')[0]
        },
        nodes:{
            data: element.getElementsByTagName('NODES')[0].getElementsByTagName('NODE')
        },
        transforms:{
            TRANSLATION:{
                apply: function(node, x,y,z){
                    var trans = [];
                    trans.push(x);
                    trans.push(y);
                    trans.push(z);
                    mat4.translate(node.matrix, node.matrix, trans);
                }
            },
            SCALE:{
                apply: function(node, sx, sy, sz){
                    var scale = [];
                    scale.push(sx);
                    scale.push(sy);
                    scale.push(sz);
                    mat4.scale(node.matrix, node.matrix, scale);
                }
            },
            ROTATION:{
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
        node.material = this.config.XML.data.getString(nodesStruct.nodes.data[i].getElementsByTagName('MATERIAL')[0], 'id');
        node.texture = this.config.XML.data.getString(nodesStruct.nodes.data[i].getElementsByTagName('TEXTURE')[0], 'id');

        // Transforms
        var children = nodesStruct.nodes.data[i].children;
        for (var j = 0; j < children.length; j++) 
            if(nodesStruct.transforms[children[j].tagName]){
                if(children[j].tagName == 'ROTATION')
                    nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getItem(children[j], "axis", ["x", "y", "z"]), (this.config.XML.data.getFloat(children[j], "angle") * deg2rad));
                else
                    if(children[j].tagName == 'TRANSLATION')
                        nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getFloat(children[j], "x"),this.config.XML.data.getFloat(children[j], "y"),this.config.XML.data.getFloat(children[j], "z"));
                    else
                        if(children[j].tagName == 'SCALE')
                            nodesStruct.transforms[children[j].tagName].apply(node, this.config.XML.data.getFloat(children[j], "sx"),this.config.XML.data.getFloat(children[j], "sy"),this.config.XML.data.getFloat(children[j], "sz"));

            }      


        //Descendants
        var desc = nodesStruct.nodes.data[i].getElementsByTagName('DESCENDANTS')[0];
        if (desc == null) return "No <DESCENDANTS> tag found";

        var d_list = desc.getElementsByTagName('DESCENDANT');
        if (d_list.length < 1) return "Need at least 1 <DESCENDANT>";

        for (var j = 0; j < d_list.length; j++) 
            node.descendants.push(d_list[j].getAttribute('id'));
        
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