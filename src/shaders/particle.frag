precision highp float;

varying vec2 UV;
uniform sampler2D tex;

void main(){
	gl_FragColor=vec4(texture2D(tex, UV).rrr, 1.0);
}