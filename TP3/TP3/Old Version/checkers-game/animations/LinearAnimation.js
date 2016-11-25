
function LinearAnimation(id, span, timestart, type, ControlPoints, first){
	Animation.call(this,id,span,timestart,"linear");

	this.ControlPoints = ControlPoints;
	this.Movements = [];	// Array com os valores de cada movimento
	this.Movement_Amount = this.ControlPoints.length - 1;	// Numero de movimentos necessários
	this.Movement_span = this.span / this.Movement_Amount;	// Tempo duração movimento

	//A função constroi os segmentos de animação
	this.constructor_Movements(timestart);

	//Angulo final.
	this.current_angle = 0;

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

var degToRad = Math.PI / 180.0;


LinearAnimation.prototype.constructor_Movements = function(timestart){

	var latest_span_end = timestart;

	for (var i = 0; i < this.Movement_Amount; i++){

		this.Movements[i] = {};
		this.Movements[i].span = this.Movement_span;
		this.Movements[i].time_begins = latest_span_end;
		this.Movements[i].time_ends = this.Movements[i].time_begins + this.Movements[i].span;
		latest_span_end += this.Movement_span;

		this.Movements[i].pos_inicial = this.ControlPoints[i];

		this.Movements[i].pos_final = this.ControlPoints[i+1];

		this.Movements[i].Matrix_distancias = []	//Matriz com as distâncias totais nos eixos. Para não haver erros no ultimo update num periodo qualquer.
		this.Movements[i].Matrix_distancias[0] = this.Movements[i].pos_final[0]-this.Movements[i].pos_inicial[0];	//x
		this.Movements[i].Matrix_distancias[1] = this.Movements[i].pos_final[1]-this.Movements[i].pos_inicial[1];	//y
		this.Movements[i].Matrix_distancias[2] = this.Movements[i].pos_final[2]-this.Movements[i].pos_inicial[2];	//z

		this.Movements[i].Matrix_deltas = [];	//Matriz com a derivada do movimentos em cada eixo na ordem XYZ.
		this.Movements[i].Matrix_deltas[0] = this.Movements[i].Matrix_distancias[0] / this.Movements[i].span;	//x
		this.Movements[i].Matrix_deltas[1] = this.Movements[i].Matrix_distancias[1] / this.Movements[i].span;	//y
		this.Movements[i].Matrix_deltas[2] = this.Movements[i].Matrix_distancias[2] / this.Movements[i].span;	//z

		this.Movements[i].Matrix_Traslation = [0,0,0]; //Matriz que é aplicada nas trasnformações. Actualizada pelo update.


		this.Movements[i].angle = this.calc_Angle(this.Movements[i].Matrix_deltas[0], this.Movements[i].Matrix_deltas[2]); //Orientação em XZ do objecto

		this.Movements[i].done = false;

	}
}

LinearAnimation.prototype.updateMatrix = function(Tempo_Mili)
{
	var Tempo_Segundos = Tempo_Mili/1000;

	//Reset à matriz de transformação
	mat4.identity(this.Matriz_Animation);

	//Na eventualidade de o primeiro ponto de controlo não ser a origem, transporta-se o objecto para essa posição antes de começar.
	mat4.translate(this.Matriz_Animation, this.Matriz_Animation, this.ControlPoints[0]);

		for (var i = 0; i < this.Movement_Amount; i++){

			//A decisão de como alterar a Matriz para cada Movement depende de se o tempo que passou já corresponde a esse Movement.
			var Periodo_Movimento = Tempo_Segundos - this.Movements[i].time_begins;

			if(Periodo_Movimento<=0){
			}
			else if (Periodo_Movimento < this.Movements[i].span)
			{
				this.Movements[i].Matrix_Traslation[0] = Periodo_Movimento * this.Movements[i].Matrix_deltas[0];
				this.Movements[i].Matrix_Traslation[1] = Periodo_Movimento * this.Movements[i].Matrix_deltas[1];
				this.Movements[i].Matrix_Traslation[2] = Periodo_Movimento * this.Movements[i].Matrix_deltas[2];

				if (this.Movements[i].angle != null)
					this.current_angle = this.Movements[i].angle;
			}
			else if (this.Movements[i].done == false)
			{
				//Já acabou este segmento do movimento, as distâncias na matriz devem ser máximas
				this.Movements[i].Matrix_Traslation[0] = this.Movements[i].Matrix_distancias[0];
				this.Movements[i].Matrix_Traslation[1] = this.Movements[i].Matrix_distancias[1];
				this.Movements[i].Matrix_Traslation[2] = this.Movements[i].Matrix_distancias[2];
				this.Movements[i].done = true;
			}

			mat4.translate(this.Matriz_Animation, this.Matriz_Animation, this.Movements[i].Matrix_Traslation);

		}

		mat4.rotate(this.Matriz_Animation, this.Matriz_Animation, this.current_angle*degToRad, [0,1,0]);

		if (Tempo_Segundos > this.timeend)
		{
			this.done = true;
		}

}

LinearAnimation.prototype.calc_Angle = function(delta_x, delta_z) {
	if (delta_x == 0 && delta_z == 0)
		return 0;
	else if (delta_x == 0)
	{
		if (delta_z > 0)
			return 0;
		else
			return 180;
	}
	else if (delta_z == 0)
	{
		if (delta_x > 0)
			return 90;
		else
			return -90;
	} else
		return Math.atan2(delta_x,delta_z)/degToRad;


}
