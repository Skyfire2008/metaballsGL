attribute vec2 pos;
attribute vec2 UV;

varying vec2 texCoord;

uniform mat3 view;

void main(){
	vec3 viewPos=view * vec3(pos, 1.0);
	gl_Position=vec4(viewPos.xy, 0.0, 1.0);
	texCoord=UV;
}