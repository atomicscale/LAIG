#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float sU;
uniform float sV;
uniform float divU;
uniform float divV;

varying vec2 vTextureCoord;


void main() {

		if(((aTextureCoord.x >= (sU/divU)) && (aTextureCoord.x <= (sU+1.01)/divU)) && ((aTextureCoord.y >= (sV/divV)) && (aTextureCoord.y <= (sV+1.01)/divV)) )
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x ,aVertexPosition.y ,aVertexPosition.z + 0.03, 1.0);
	else
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;
}
