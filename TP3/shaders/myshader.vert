attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {
	vec3 offset=vec3(1.0,1.0,1.0);
	
    vTextureCoord = aTextureCoord;

	float temp = 
	(texture2D(uSampler2, vTextureCoord).r) *
	(texture2D(uSampler2, vTextureCoord).g) *
	(texture2D(uSampler2, vTextureCoord).b) *
	(texture2D(uSampler2, vTextureCoord).a);
	
	temp *= normScale;
	
	offset = vec3(0, temp, 0);
	
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

