
 function Animation(id, span, timestart, type) {
	this.id = id;
	this.span = span;  //Tempo de duração da Anim
	this.type = type;
	this.timestart = timestart;
	this.timeend = this.timestart + this.span;

	//Matriz de transformação
	this.Matriz_Animation = mat4.create();

	//Verifica se a animação terminou
	this.done = false;

};

Animation.prototype.updateMatrix = function(Tempo_Mili){

}

Animation.prototype.getMatrix = function(Tempo_Mili){
	return this.Matriz_Animation;
}

Animation.prototype.getDuration = function(Tempo_Mili){
	return this.span;
}

Animation.prototype.getEndingTime = function()
{
	return this.timeend;
}
