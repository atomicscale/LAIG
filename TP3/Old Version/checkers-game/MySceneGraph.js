
/* Parsing elemntos do lsx */

function MySceneGraph(filename, scene) {

	this.loadedOk = null;
	this.scene = scene;	// Estabelece referencias bidirecionais entre o graph e a cena
	scene.graph=this;
	this.reader = new CGFXMLreader();
	this.reader.open('scenes/'+filename, this);
}


MySceneGraph.prototype.onXMLReady=function()
{
	console.log("LSX Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	var error = this.parseLSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk = true;
	this.scene.onGraphLoaded(); //Se o graph tiver sido lido com sucesso
};


MySceneGraph.prototype.parseLSX= function(rootElement){

	this.Parser = {};

	console.log(" <-- Initials -->");
	var error = this.parseInitials(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Illumination -->");
	error = this.parseIllumination(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Lights -->");
	error = this.parseLights(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Textures -->");
	error = this.parseTextures(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Materials -->");
	error = this.parseMaterials(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Animations -->");
	error = this.parseAnimations(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Leaves -->");
	error = this.parseLeaves(rootElement);
	if (error != null)
		return error;

	console.log(" <-- Nodes -->");
	error = this.parseNodes(rootElement);
	if (error != null)
		return error;
	}

MySceneGraph.prototype.parseInitials= function(rootElement) {

	this.Parser.Initials = {};

	var tempInitials = rootElement.getElementsByTagName('INITIALS');
	if (tempInitials == null || tempInitials.length != 1) {
		return "<INITIALS> is either missing or there's multiples of them. Length: " + tempInitials.length;
	}

	var Init_frustum, Init_translation, Init_rotation, Init_scale, Init_reference;

	/* frustum  */

	Init_frustum =  tempInitials[0].getElementsByTagName('frustum');

	if (Init_frustum == null || Init_frustum.length != 1) {
		return "Camera frustum information is either missing or there's multiples of them. Length: " + Init_frustum.length;
	}
	Init_frustum = Init_frustum[0];

	this.Parser.Initials.view_near = this.reader.getFloat(Init_frustum, 'near');
	this.Parser.Initials.view_far = this.reader.getFloat(Init_frustum, 'far');

	console.log("Frustum: near=" + this.Parser.Initials.view_near + ", far=" +  this.Parser.Initials.view_far);

	/* translation */

	Init_translation = tempInitials[0].getElementsByTagName('translation');

	if (Init_translation == null || Init_translation.length != 1)
		return "View Translation information is either missing or there's multiples of them. Length: " + Init_frustum.length;

	Init_translation = Init_translation[0];

	this.Parser.Initials.view_translation_xx = this.reader.getFloat(Init_translation, 'x');
	this.Parser.Initials.view_translation_yy = this.reader.getFloat(Init_translation, 'y');
	this.Parser.Initials.view_translation_zz = this.reader.getFloat(Init_translation, 'z');

	console.log("View Translation values loaded: x=" + this.Parser.view_translation_xx
											+ ", y=" + this.Parser.view_translation_yy
											+ ", z=" + this.Parser.view_translation_zz);


	/* rotation */

	Init_rotation = tempInitials[0].getElementsByTagName('rotation');

	if (Init_rotation == null || Init_rotation.length != 3) {
		return "rotation information is either missing Rotation: " + Init_rotation.length;
	}

	var templength =Init_rotation.length;

	for (var i = 0; i< templength; i++)
	{
		if (Init_rotation[i].attributes.getNamedItem('axis').value == 'x')
				this.Parser.Initials.view_rotation_xx = this.reader.getFloat(Init_rotation[i], 'angle');
		else if (Init_rotation[i].attributes.getNamedItem('axis').value == 'y')
				this.Parser.Initials.view_rotation_yy = this.reader.getFloat(Init_rotation[i], 'angle');
		else if (Init_rotation[i].attributes.getNamedItem('axis').value == 'z')
				this.Parser.Initials.view_rotation_zz = this.reader.getFloat(Init_rotation[i], 'angle');
	}

	console.log("View Rotation values loaded: x=" + this.Parser.Initials.view_rotation_xx
									+ ", y=" + this.Parser.Initials.view_rotation_yy
									+ ", z=" + this.Parser.Initials.view_rotation_zz);

	/* scale */
	Init_scale = tempInitials[0].getElementsByTagName('scale');

	if (Init_scale == null || Init_scale.length != 1) {
		return "View Scale information is either missing or there's multiples of them. Length: " + Init_scale.length;
	}
	Init_scale = Init_scale[0];

	this.Parser.Initials.view_scale_xx = this.reader.getFloat(Init_scale, 'sx');
	this.Parser.Initials.view_scale_yy = this.reader.getFloat(Init_scale, 'sy');
	this.Parser.Initials.view_scale_zz = this.reader.getFloat(Init_scale, 'sz');

	console.log("View Scale values loaded: x=" + this.Parser.Initials.view_scale_xx
											+ ", y=" + this.Parser.Initials.view_scale_yy
											+ ", z=" + this.Parser.Initials.view_scale_zz);


	/* reference */
	Init_reference = tempInitials[0].getElementsByTagName('reference');

	if (Init_reference == null || Init_reference.length != 1)
		return "Axis Size information is either missing or there's multiples of them. Length: " + Init_reference.length;

	this.Parser.Initials.axis_length = this.reader.getFloat(Init_reference[0], 'length');
	console.log("Axis size values loaded: " + this.Parser.Initials.axis_length);


}

MySceneGraph.prototype.parseIllumination= function(rootElement){

	this.Parser.Illumination = {};

	// <ILLUMINATION> must exist and be a singular tag
	var tempIllumination = rootElement.getElementsByTagName('ILLUMINATION');
	if (tempIllumination == null || tempIllumination.length != 1)
		return "<ILLUMINATION> is either missing or there's multiples of them. Length: " + tempIllumination.length;


	/* ambient */

	var illu_ambient = tempIllumination[0].getElementsByTagName('ambient');

	if (illu_ambient == null || illu_ambient.length != 1)
		return "Ambient Light information is either missing or there's multiples of them. Length: " + illu_ambient.length;

	illu_ambient = illu_ambient[0];

	this.Parser.Illumination.ambient = [];
	this.Parser.Illumination.ambient[0] = this.reader.getFloat(illu_ambient, 'r');
	this.Parser.Illumination.ambient[1] = this.reader.getFloat(illu_ambient, 'g');
	this.Parser.Illumination.ambient[2] = this.reader.getFloat(illu_ambient, 'b');
	this.Parser.Illumination.ambient[3] = this.reader.getFloat(illu_ambient, 'a');

	console.log("Ambient Light: Loaded RGBA values: [" + this.Parser.Illumination.ambient[0] + ", "
																										 + this.Parser.Illumination.ambient[1] + ", "
																										 + this.Parser.Illumination.ambient[2] + ", "
																										 + this.Parser.Illumination.ambient[3] + "]");


	/* Background */

	var illu_background =  tempIllumination[0].getElementsByTagName('background');

	if (illu_background == null || illu_background.length != 1)
		return "Background information is either missing or there's multiples of them. Length: " + illu_background.length;

	illu_background = illu_background[0];

	this.Parser.Illumination.background = [];
	this.Parser.Illumination.background[0] = this.reader.getFloat(illu_background, 'r');
	this.Parser.Illumination.background[1] = this.reader.getFloat(illu_background, 'g');
	this.Parser.Illumination.background[2] = this.reader.getFloat(illu_background, 'b');
	this.Parser.Illumination.background[3] = this.reader.getFloat(illu_background, 'a');

	console.log("Background: Loaded RGBA values: [" + this.Parser.Illumination.background[0] + ", "
																									+ this.Parser.Illumination.background[1] + ", "
																									+ this.Parser.Illumination.background[2] + ", "
																									+ this.Parser.Illumination.background[3]+"]");

}

MySceneGraph.prototype.parseLights= function(rootElement){

	this.Parser.Lights = [];

	// <LIGHTS> must exist and be a singular tag
	var tempLights = rootElement.getElementsByTagName('LIGHTS');
	if (tempLights == null || tempLights.length != 1)
		return "<LIGHTS> is either missing or there's too many of them. Length: " + tempLights.length;

	tempLights = tempLights[0].getElementsByTagName('LIGHT');

	if (tempLights.length > 8)
		return "There's too many light, maxmum amount: 8. Length: " + tempLights.length;

	var lightamount = tempLights.length

	this.lights_ambient_r = [], this.lights_ambient_g = [], this.lights_ambient_b = [], this.lights_ambient_a = [];
	this.lights_diffuse_r = [], this.lights_diffuse_g = [], this.lights_diffuse_b = [], this.lights_diffuse_a = [];
	this.lights_specular_r = [], this.lights_specular_g = [], this.lights_specular_b = [], this.lights_specular_a = [];


	if (lightamount > 0)
	{
		for (var i = 0; i < lightamount; i++ )
		{

			this.Parser.Lights[i] = {};

			var Light_Node = tempLights[i];

			//	id
			this.Parser.Lights[i].id = Light_Node.attributes.getNamedItem('id').value;
			if (i > 0)
				for (var j = 0; j < i; j++)
					if (this.Parser.Lights[i].id == this.Parser.Lights[j].id)
						return "Two lights had the same id, Light indexes: "+ j  + " and " + i;

			//	enable
			this.Parser.Lights[i].enabled = (Light_Node.getElementsByTagName('enable')[0].attributes.getNamedItem('value').value  == '1');

			//	position
			this.Parser.Lights[i].position = [];
			this.Parser.Lights[i].position[0] = this.reader.getFloat(Light_Node.getElementsByTagName('position')[0], 'x');
			this.Parser.Lights[i].position[1] = this.reader.getFloat(Light_Node.getElementsByTagName('position')[0], 'y');
			this.Parser.Lights[i].position[2] = this.reader.getFloat(Light_Node.getElementsByTagName('position')[0], 'z');
			this.Parser.Lights[i].position[3] = this.reader.getFloat(Light_Node.getElementsByTagName('position')[0], 'w');


			//	ambient
			this.Parser.Lights[i].ambient = [];
			this.Parser.Lights[i].ambient[0] = this.reader.getFloat(Light_Node.getElementsByTagName('ambient')[0], 'r');
			this.Parser.Lights[i].ambient[1] = this.reader.getFloat(Light_Node.getElementsByTagName('ambient')[0], 'g');
			this.Parser.Lights[i].ambient[2] = this.reader.getFloat(Light_Node.getElementsByTagName('ambient')[0], 'b');
			this.Parser.Lights[i].ambient[3] = this.reader.getFloat(Light_Node.getElementsByTagName('ambient')[0], 'a');


			//	diffuse
			this.Parser.Lights[i].diffuse = [];
			this.Parser.Lights[i].diffuse[0] = this.reader.getFloat(Light_Node.getElementsByTagName('diffuse')[0], 'r');
			this.Parser.Lights[i].diffuse[1] = this.reader.getFloat(Light_Node.getElementsByTagName('diffuse')[0], 'g');
			this.Parser.Lights[i].diffuse[2] = this.reader.getFloat(Light_Node.getElementsByTagName('diffuse')[0], 'b');
			this.Parser.Lights[i].diffuse[3] = this.reader.getFloat(Light_Node.getElementsByTagName('diffuse')[0], 'a');

			//	specular
			this.Parser.Lights[i].specular = [];
			this.Parser.Lights[i].specular[0] = this.reader.getFloat(Light_Node.getElementsByTagName('specular')[0], 'r');
			this.Parser.Lights[i].specular[1] = this.reader.getFloat(Light_Node.getElementsByTagName('specular')[0], 'g');
			this.Parser.Lights[i].specular[2] = this.reader.getFloat(Light_Node.getElementsByTagName('specular')[0], 'b');
			this.Parser.Lights[i].specular[3] = this.reader.getFloat(Light_Node.getElementsByTagName('specular')[0], 'a');


			console.log(this.Parser.Lights[i].id +
							": enabled=" +this.Parser.Lights[i].enabled+
							", position: [" + this.Parser.Lights[i].position[0]
											+ ", " + this.Parser.Lights[i].position[1]
											+ ", " + this.Parser.Lights[i].position[2]
											+ ", " + this.Parser.Lights[i].position[3] +
							"], ambient: [" + this.Parser.Lights[i].ambient[0]
											+ ", " + this.Parser.Lights[i].ambient[1]
											+ ", " + this.Parser.Lights[i].ambient[2]
											+ ", " + this.Parser.Lights[i].ambient[3]+
							"], diffuse: [" + this.Parser.Lights[i].diffuse[0]
											+ ", " + this.Parser.Lights[i].diffuse[1]
											+ ", " + this.Parser.Lights[i].diffuse[2]
											+ ", " + this.Parser.Lights[i].diffuse[3]+
							"], specular: [" + this.Parser.Lights[i].specular[0]
											+ ", " + this.Parser.Lights[i].specular[1]
											+ ", " + this.Parser.Lights[i].specular[2]
											+ ", " + this.Parser.Lights[i].specular[3]+ "]");

		}
	}
}

MySceneGraph.prototype.parseTextures= function(rootElement){

	this.Parser.Textures = [];

	// <TEXTURES> must exist and be a singular tag
	var tempTextures = rootElement.getElementsByTagName('TEXTURES');
	if (tempTextures == null || tempTextures.length != 1)
		return "<TEXTURES> is either missing or there's multiples of them. Length: " + tempTextures.length;

	tempTextures = tempTextures[0].getElementsByTagName('TEXTURE');

	var textamount = tempTextures.length;

	for (var i = 0; i < textamount; i++)
	{

			this.Parser.Textures[i] = {};

			var Texture_Node = tempTextures[i];

			//	id
			this.Parser.Textures[i].id = Texture_Node.attributes.getNamedItem('id').value;

			if (i > 0)
				for (var j = 0; j < i; j++)
					if (this.Parser.Textures[i].id == this.Parser.Textures[j].id)
						return "Two textures had the same id, texture indexes: "+ j  + " and " + i;

			//	path

			this.Parser.Textures[i].path = Texture_Node.getElementsByTagName('file')[0].attributes.getNamedItem('path').value;

			//	amplif_factor
			this.Parser.Textures[i].factor_s = this.reader.getFloat(Texture_Node.getElementsByTagName('amplif_factor')[0], 's');
			this.Parser.Textures[i].factor_t = this.reader.getFloat(Texture_Node.getElementsByTagName('amplif_factor')[0], 't');


			console.log(this.Parser.Textures[i].id
					+ ": File path:" + this.Parser.Textures[i].path
					+ " Amplification Factor: s=" + this.Parser.Textures[i].factor_s
					+ " t=" + this.Parser.Textures[i].factor_t
					);

	}
}


MySceneGraph.prototype.parseMaterials= function(rootElement){

	this.Parser.Materials = [];

	// <MATERIALS> must exist and be a singular tag
	var tempMaterials = rootElement.getElementsByTagName('MATERIALS');
	if (tempMaterials == null || tempMaterials.length != 1)
		return "<MATERIALS> is either missing or there's multiples of them. Length: " + tempMaterials.length;

	tempMaterials = tempMaterials[0].getElementsByTagName('MATERIAL');
	var materamount = tempMaterials.length;
	console.log("Found "+materamount+" Material(s)");

	if (materamount > 0){

		for (var i = 0; i < materamount; i++){

			this.Parser.Materials[i] = {};
			var Material_Node = tempMaterials[i];

			//	id
			this.Parser.Materials[i].id = Material_Node.attributes.getNamedItem('id').value;

			//	shininess
			this.Parser.Materials[i].shininess = this.reader.getFloat(Material_Node.getElementsByTagName('shininess')[0], 'value');

			//	specular
			this.Parser.Materials[i].specular = [];
			this.Parser.Materials[i].specular[0] = this.reader.getFloat(Material_Node.getElementsByTagName('specular')[0], 'r');
			this.Parser.Materials[i].specular[1] = this.reader.getFloat(Material_Node.getElementsByTagName('specular')[0], 'g');
			this.Parser.Materials[i].specular[2] = this.reader.getFloat(Material_Node.getElementsByTagName('specular')[0], 'b');
			this.Parser.Materials[i].specular[3] = this.reader.getFloat(Material_Node.getElementsByTagName('specular')[0], 'a');

			//	diffuse
			this.Parser.Materials[i].diffuse = [];
			this.Parser.Materials[i].diffuse[0] = this.reader.getFloat(Material_Node.getElementsByTagName('diffuse')[0], 'r');
			this.Parser.Materials[i].diffuse[1] = this.reader.getFloat(Material_Node.getElementsByTagName('diffuse')[0], 'g');
			this.Parser.Materials[i].diffuse[2] = this.reader.getFloat(Material_Node.getElementsByTagName('diffuse')[0], 'b');
			this.Parser.Materials[i].diffuse[3] = this.reader.getFloat(Material_Node.getElementsByTagName('diffuse')[0], 'a');

			//	ambient
			this.Parser.Materials[i].ambient = [];
			this.Parser.Materials[i].ambient[0] = this.reader.getFloat(Material_Node.getElementsByTagName('ambient')[0], 'r');
			this.Parser.Materials[i].ambient[1] = this.reader.getFloat(Material_Node.getElementsByTagName('ambient')[0], 'g');
			this.Parser.Materials[i].ambient[2] = this.reader.getFloat(Material_Node.getElementsByTagName('ambient')[0], 'b');
			this.Parser.Materials[i].ambient[3] = this.reader.getFloat(Material_Node.getElementsByTagName('ambient')[0], 'a');

			//	emission
			this.Parser.Materials[i].emission = [];
			this.Parser.Materials[i].emission[0] = this.reader.getFloat(Material_Node.getElementsByTagName('emission')[0], 'r');
			this.Parser.Materials[i].emission[1] = this.reader.getFloat(Material_Node.getElementsByTagName('emission')[0], 'g');
			this.Parser.Materials[i].emission[2] = this.reader.getFloat(Material_Node.getElementsByTagName('emission')[0], 'b');
			this.Parser.Materials[i].emission[3] = this.reader.getFloat(Material_Node.getElementsByTagName('emission')[0], 'a');

			console.log(this.Parser.Materials[i].id +
					": shininess:" + this.Parser.Materials[i].shininess +
					", specular: [" + this.Parser.Materials[i].specular[0] +
									"," + this.Parser.Materials[i].specular[1] +
									"," + this.Parser.Materials[i].specular[2] +
									"," + this.Parser.Materials[i].specular[3] +
					"] diffuse: [" + this.Parser.Materials[i].diffuse[0] +
									"," + this.Parser.Materials[i].diffuse[1] +
									"," + this.Parser.Materials[i].diffuse[2] +
									"," + this.Parser.Materials[i].diffuse[3] +
					"] ambient: [" + this.Parser.Materials[i].ambient[0] +
									"," + this.Parser.Materials[i].ambient[1] +
									"," + this.Parser.Materials[i].ambient[2] +
									"," + this.Parser.Materials[i].ambient[3] +
					"] emission: [" + this.Parser.Materials[i].emission[0] +
									"," + this.Parser.Materials[i].emission[1] +
									"," + this.Parser.Materials[i].emission[2] +
									"," + this.Parser.Materials[i].emission[3] + "]"
					);

		}
	}
}

MySceneGraph.prototype.parseAnimations= function(rootElement){

	this.Parser.Animations = [];

	// <ANIMATIONS> must exist and be a singular tag
	var tempAnimations = rootElement.getElementsByTagName('ANIMATIONS');
	if (tempAnimations == null || tempAnimations.length != 1) {
		return "<ANIMATIONS> is either missing or there's multiples of them. Length: " + tempAnimations.length;
	}

	tempAnimations = tempAnimations[0].getElementsByTagName('animation');
	var animationamount = tempAnimations.length;
	console.log("Found " + animationamount + " Animation(s)");

	if (animationamount > 0){
		for (var i = 0; i < animationamount; i++){
			this.Parser.Animations[i] = {};
			var Animation_Node = tempAnimations[i];

			//	id
			this.Parser.Animations[i].id = Animation_Node.attributes.getNamedItem('id').value;
				if (i > 0)
					for (var j = 0; j < i; j++)
						if (this.Parser.Animations[i].id == this.Parser.Animations[j].id)
							return "Two Animations had the same id, indexes: "+ j  + " and " + i;

			//	span
			this.Parser.Animations[i].span = parseFloat(Animation_Node.attributes.getNamedItem('span').value);

			//	type
			this.Parser.Animations[i].type = Animation_Node.attributes.getNamedItem('type').value;

			if(this.Parser.Animations[i].type == "linear") {

					//	controlpoint
					this.Parser.Animations[i].controlpoints = [];
					var control_point_list = Animation_Node.getElementsByTagName('controlpoint');
					for(var k = 0; k < control_point_list.length; k++)
					{
						this.Parser.Animations[i].controlpoints[k] = [ 	 parseFloat(control_point_list[k].attributes.getNamedItem('xx').value),
																	 parseFloat(control_point_list[k].attributes.getNamedItem('yy').value),
																	 parseFloat(control_point_list[k].attributes.getNamedItem('zz').value)
																];
					}

			} else if(this.Parser.Animations[i].type == "circular") {

					//  center

					var str = Animation_Node.attributes.getNamedItem('center').value;
					var str = str.match(/\S+/g);

					this.Parser.Animations[i].center = [];
					this.Parser.Animations[i].center[0] = parseFloat(str[0]);
					this.Parser.Animations[i].center[1] = parseFloat(str[1]);
					this.Parser.Animations[i].center[2] = parseFloat(str[2]);

					//	radius
					this.Parser.Animations[i].radius = parseFloat(Animation_Node.attributes.getNamedItem('radius').value);

					//	startang
					this.Parser.Animations[i].startang = parseFloat(Animation_Node.attributes.getNamedItem('startang').value);

					//	rotang
					this.Parser.Animations[i].rotang = parseFloat(Animation_Node.attributes.getNamedItem('rotang').value);

				}

			console.log(this.Parser.Animations[i]); // Printing Animations

		}
	}
}

MySceneGraph.prototype.parseLeaves= function(rootElement){

	this.Parser.Leaves = [];

	// <LEAVES> must exist and be a singular tag
	var tempLeaves = rootElement.getElementsByTagName('LEAVES');
	if (tempLeaves == null || tempLeaves.length != 1)
		return "<LEAVES> is either missing or there's multiples of them. Length: " + tempLeaves.length;

	tempLeaves = tempLeaves[0].getElementsByTagName('LEAF');

	for (var i = 0; i < tempLeaves.length; i++){

		this.Parser.Leaves[i] = {};
		var Leaf_Node = tempLeaves[i];

		this.Parser.Leaves[i].id = Leaf_Node.attributes.getNamedItem('id').value;

			if (i > 0)
				for (var j = 0; j < i; j++)
					if (this.Parser.Leaves[i].id == this.Parser.Leaves[j].id)
						return "Two leaves had the same id, indexes: "+ j  + " and " + i;

		this.Parser.Leaves[i].type = Leaf_Node.attributes.getNamedItem('type').value;

		console.log("Leaf "+ i + ": id=" + this.Parser.Leaves[i].id + ", type=" + this.Parser.Leaves[i].type);

		switch(this.Parser.Leaves[i].type)
		{

		case "rectangle":
			var str = Leaf_Node.attributes.getNamedItem('args').value;
			var arg_list = str.match(/\S+/g);

			this.Parser.Leaves[i].lt_x = parseFloat(arg_list[0]);
			this.Parser.Leaves[i].lt_y = parseFloat(arg_list[1]);
			this.Parser.Leaves[i].rb_x = parseFloat(arg_list[2]);
			this.Parser.Leaves[i].rb_y = parseFloat(arg_list[3]);
			break;

		case "cylinder":
			var str = Leaf_Node.attributes.getNamedItem('args').value;
			var arg_list = str.match(/\S+/g);

			this.Parser.Leaves[i].height = parseFloat(arg_list[0]);
			this.Parser.Leaves[i].bot_radius = parseFloat(arg_list[1]);
			this.Parser.Leaves[i].top_radius = parseFloat(arg_list[2]);
			this.Parser.Leaves[i].sections = parseFloat(arg_list[3]);
			this.Parser.Leaves[i].parts = parseFloat(arg_list[4]);
			break;

		case "sphere":
			var str = Leaf_Node.attributes.getNamedItem('args').value;
			var arg_list = str.match(/\S+/g);

			this.Parser.Leaves[i].radius = parseFloat(arg_list[0]);
			this.Parser.Leaves[i].sections = parseFloat(arg_list[1]);
			this.Parser.Leaves[i].parts = parseFloat(arg_list[2]);
			break;

		case "triangle":
			var str = Leaf_Node.attributes.getNamedItem('args').value;
			var arg_list = str.match(/\S+/g);

			this.Parser.Leaves[i].p1_x = parseFloat(arg_list[0]);
			this.Parser.Leaves[i].p1_y = parseFloat(arg_list[1]);
			this.Parser.Leaves[i].p1_z = parseFloat(arg_list[2]);
			this.Parser.Leaves[i].p2_x = parseFloat(arg_list[3]);
			this.Parser.Leaves[i].p2_y = parseFloat(arg_list[4]);
			this.Parser.Leaves[i].p2_z = parseFloat(arg_list[5]);
			this.Parser.Leaves[i].p3_x = parseFloat(arg_list[6]);
			this.Parser.Leaves[i].p3_y = parseFloat(arg_list[7]);
			this.Parser.Leaves[i].p3_z = parseFloat(arg_list[8]);
			break;

		case "plane":
			this.Parser.Leaves[i].parts = parseFloat(Leaf_Node.attributes.getNamedItem('parts').value);
			break;

		case "terrain":
			this.Parser.Leaves[i].texture_path = Leaf_Node.attributes.getNamedItem('texture').value;
			this.Parser.Leaves[i].heightmap_path = Leaf_Node.attributes.getNamedItem('heightmap').value;
			break;

		case "patch":
			this.Parser.Leaves[i].order = parseFloat(Leaf_Node.attributes.getNamedItem('order').value);
			this.Parser.Leaves[i].partsU = parseFloat(Leaf_Node.attributes.getNamedItem('partsU').value);
			this.Parser.Leaves[i].partsV = parseFloat(Leaf_Node.attributes.getNamedItem('partsV').value);


			this.Parser.Leaves[i].controlpoints = [];
			var control_point_list = Leaf_Node.getElementsByTagName('controlpoint');
			for(var k = 0; k < control_point_list.length; k++)
			{
				this.Parser.Leaves[i].controlpoints[k] = [ 	 parseFloat(control_point_list[k].attributes.getNamedItem('xx').value),
															 parseFloat(control_point_list[k].attributes.getNamedItem('yy').value),
															 parseFloat(control_point_list[k].attributes.getNamedItem('zz').value)
															];
			}
			break;

		case "scene":
			break;

		default:
			break;
		}
		console.log(this.Parser.Leaves[i]);
	}

}


MySceneGraph.prototype.parseNodes= function(rootElement){

	this.Parser.Nodes = [];

	// <NODES> must exist and be a singular tag
	var tempNodes = rootElement.getElementsByTagName('NODES');
	if (tempNodes == null || tempNodes.length != 1)
		return "<NODES> is either missing or there's multiples of them. Length: " + tempNodes.length;


	var tempRoot = tempNodes[0].getElementsByTagName('ROOT');

	this.Parser.Root_id = tempRoot[0].attributes.getNamedItem('id').value;

	tempNodes[0].getElementsByTagName('ROOT');
	tempNodes = tempNodes[0].getElementsByTagName('NODE');

	for (var i = 0; i < tempNodes.length; i++)
	{

		this.Parser.Nodes[i] = {};
		var Node_Twice = tempNodes[i];

		this.Parser.Nodes[i].id = Node_Twice.attributes.getNamedItem('id').value;
		console.log("Node "+ i + ": id= " + this.Parser.Nodes[i].id);

		this.Parser.Nodes[i].material_id = Node_Twice.getElementsByTagName('MATERIAL')[0].attributes.getNamedItem('id').value;
		if (this.Parser.Nodes[i].material_id == null)
			return "You haven't defined any Material.";

		console.log("	Material used:" + this.Parser.Nodes[i].material_id );

		this.Parser.Nodes[i].texture_id = Node_Twice.getElementsByTagName('TEXTURE')[0].attributes.getNamedItem('id').value;
		if (this.Parser.Nodes[i].texture_id == null)
			return "You haven't defined any Texture.";

		console.log("	Texture used:" + this.Parser.Nodes[i].texture_id );

		this.Parser.Nodes[i].Transform = [];
		var Node_List = Node_Twice.childNodes;
		var found = 0;

		for (var j=0; j<Node_List.length; j++)
		{

			switch(Node_List[j].tagName)
			{
			case 'TRANSLATION':

				var Transformation_Element = {};
				Transformation_Element.type = 'translation';
				Transformation_Element.translation_x = this.reader.getFloat(Node_List[j] , 'x');
				Transformation_Element.translation_y = this.reader.getFloat(Node_List[j] , 'y');
				Transformation_Element.translation_z = this.reader.getFloat(Node_List[j] , 'z');

				this.Parser.Nodes[i].Transform.push(Transformation_Element);

				console.log("	Transformation of type " + this.Parser.Nodes[i].Transform[found].type +
									": x=" +  this.Parser.Nodes[i].Transform[found].translation_x +
									": y=" +  this.Parser.Nodes[i].Transform[found].translation_y +
									": z=" +  this.Parser.Nodes[i].Transform[found].translation_z
							);

				found++;
				break;
			case 'ROTATION':

				var Transformation_Element = {};
				Transformation_Element.type = 'rotation';
				Transformation_Element.axis = Node_List[j].attributes.getNamedItem('axis').value;
				Transformation_Element.angle = this.reader.getFloat(Node_List[j] , 'angle');

				this.Parser.Nodes[i].Transform.push(Transformation_Element);

				console.log("	Transformation of type " + this.Parser.Nodes[i].Transform[found].type +
									" over the " +  this.Parser.Nodes[i].Transform[found].axis +
									" axis: angle=" +  this.Parser.Nodes[i].Transform[found].angle
							);
				found++;
				break;
			case 'SCALE':

				var Transformation_Element = {};
				Transformation_Element.type = 'scale';
				Transformation_Element.scale_x = this.reader.getFloat(Node_List[j] , 'sx');
				Transformation_Element.scale_y = this.reader.getFloat(Node_List[j] , 'sy');
				Transformation_Element.scale_z = this.reader.getFloat(Node_List[j] , 'sz');

				this.Parser.Nodes[i].Transform.push(Transformation_Element);

				console.log("	Transformation of type " + this.Parser.Nodes[i].Transform[found].type +
									": x=" +  this.Parser.Nodes[i].Transform[found].scale_x +
									": y=" +  this.Parser.Nodes[i].Transform[found].scale_y +
									": z=" +  this.Parser.Nodes[i].Transform[found].scale_z
							);
				found++;
				break;
			default:
				break;
			}
		}

		this.Parser.Nodes[i].Descendants = [];
		var descendant_list = Node_Twice.getElementsByTagName('DESCENDANTS')[0].getElementsByTagName('DESCENDANT');

		for (var j = 0; j < descendant_list.length; j++)
		{
			this.Parser.Nodes[i].Descendants[j] = descendant_list[j].attributes.getNamedItem('id').value;
			console.log("	Descendant found:" + this.Parser.Nodes[i].Descendants[j] );
		}


		this.Parser.Nodes[i].Animations = [];

		var animation_list = Node_Twice.getElementsByTagName('animationref')

		for (var j = 0; j < animation_list.length; j++)
			this.Parser.Nodes[i].Animations[j] = animation_list[j].attributes.getNamedItem('id').value;

	}
}

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
