const sigma=64;
const texSize=256;

var Program=require("kaleidoGL/src/shader.js").Program;
var Texture=require("./texture.js").Texture;
var vert=require("./shaders/particle.vert")();
var frag=require("./shaders/particle.frag")();

var glCanvas;
var gl;
var p;

document.addEventListener("DOMContentLoaded", function(e){

	//GET THE CANVAS
	glCanvas=document.getElementById("glCanvas");
	gl=glCanvas.getContext("webgl2");
	if(gl==null){
		alert("There was a problem creating webGL2 rendering context, your browser probably doesn't support it");
	}

	//SETUP THE GL PROGRAM
	p=new Program(gl, vert, frag);

	//SETUP THE QUAD BUFFER
	var points=[-1, -1,
				-1,  1,
				 1, -1,
				 1,  1];
	quadBuf=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
		gl.getAttribLocation(p.id, "pos"),
		2,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(gl.getAttribLocation(p.id, "pos"));

	//GENERATE GAUSSIAN TEXTURE
	let gaussDiv=gaussian(0, 0, 0, 0, sigma);
	let texBmp=new Uint8Array(texSize*texSize);
	let ind=0;

	for(let y=0; y<texSize; y++){
		for(let x=0; x<texSize; x++){
			let value=255*gaussian(x, y, texSize/2, texSize/2, sigma)/gaussDiv;

			texBmp[ind]=value;
			/*texBmp[ind+1]=value;
			texBmp[ind+2]=value;
			texBmp[ind+3]=255;*/

			ind+=1;
		}
	}
	console.log(texBmp);

	//BIND THE TEXTURE
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	let tex=new Texture(gl, texSize, texSize, gl.R8, gl.RED, gl.UNSIGNED_BYTE, texBmp, 
		[{name: gl.TEXTURE_MAG_FILTER, value: gl.LINEAR},
		 {name: gl.TEXTURE_MIN_FILTER, value: gl.LINEAR},
		 {name: gl.TEXTURE_WRAP_S, value: gl.CLAMP_TO_EDGE},
		 {name: gl.TEXTURE_WRAP_T, value: gl.CLAMP_TO_EDGE}]);
	tex.bind(p, "tex", 0);

	//DRAW
	p.use();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});

gaussian=function(x, y, xm, ym, sigma){
	let dx=x-xm;
	let dy=y-ym;
	let foo=-(dx*dx+dy*dy)/(2*sigma*sigma);
	return 1/(sigma*Math.sqrt(2*Math.PI)) * Math.exp(foo);
}