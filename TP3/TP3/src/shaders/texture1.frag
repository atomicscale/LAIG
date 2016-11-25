#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 color1;
uniform vec4 color2;
uniform vec4 colorMark;
uniform float divU;
uniform float divV;
uniform float sU;
uniform float sV;



vec4 colorSelect(vec2 tex, vec4 color1, vec4 color2)
{
				if(((tex.x > (sU/divU)) && (tex.x < (sU+1.0)/divU)) && ((tex.y > (sV/divV)) && (tex.y < (sV+1.0)/divV)) ){
							return colorMark;
				}else{

	         if ((mod(divU*tex.x, 2.0) < 1.0) ^^ (mod(divV*tex.y, 2.0) < 1.0))
	         {
	            return color1;
	         }
	         else
	         {
	            return color2;
	         }
			 }
}

void main() {

  vec4 finalColor = texture2D(uSampler, vTextureCoord);

  vec4 mixColor = colorSelect(vTextureCoord,color1,color2);

  finalColor.rgba *= mixColor;

  gl_FragColor = finalColor;
}
