precision highp float;

varying vec2 texCoord;

uniform sampler2D tex;

void main(){
	gl_FragColor=vec4(texture2D(tex, texCoord).rrr, 1.0);
}