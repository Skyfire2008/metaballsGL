

function Texture(gl, width, height, intFormat, format, type, pixels, params){
	this.width=width;
	this.height=height;
	this.gl=gl;

	this.id=gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.id);

	gl.texImage2D(gl.TEXTURE_2D, 0, intFormat, width, height, 0, format, type, pixels);

	if(params!=null){
		for(let i=0; i<params.length; i++){
			gl.texParameteri(gl.TEXTURE_2D, params[i].name, params[i].value);
		}
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.bind=function(program, name, unit){
	this.gl.activeTexture(this.gl.TEXTURE0+unit);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
	program.setInt("name", unit);
}

module.exports={
	Texture: Texture
};