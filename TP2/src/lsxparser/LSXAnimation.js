function LSXAnimation(id,span,type,args) {
    this.id = id;

    this.span=span;

    this.type=type;

    this.args=args;


    this.info = function() {
        console.log("Animation " + this.id);
        console.log("Span: " + this.span);
        console.log("Type: " + this.type);
        if(this.type=='linear'){
        	for(var i=0; i<this.args.length;i++)
        		console.log("ControlPoint: " + this.args[i]);
        }else if(this.type=='circular'){
        	console.log("Center: " + this.args["center"]);
          	console.log("Radius: " + this.args["radius"]);
        	console.log("StartAng: " + this.args["startang"]);
        	console.log("RotAng: " + this.args["rotang"]);
        }
    };
}
