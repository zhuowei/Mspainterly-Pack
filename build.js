var TILE_WIDTH = 32;
var NUMROWS = 16;
var NUMCOLS = 16;
var canvas;
var ctx;
var tileImgs;
function init(){
	document.getElementById("go-button").addEventListener("click", function(e){
		build();
	}, false);
	canvas = document.getElementById("main-canvas");
	canvas.width = TILE_WIDTH * NUMCOLS;
	canvas.height = TILE_WIDTH * NUMROWS;
	ctx = canvas.getContext("2d");
	tileImgs = new Array(NUMROWS);
	for(var r = 0; r < tileImgs.length; r++){
		tileImgs[r] = new Array(NUMCOLS);
	}
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function build(){
	trace("building...");
	loadImages();
}
function loadImages(){
	var loadedCount = 0;
	for(var r = 0; r < tileImgs.length; r++){
		for(var c = 0; c < tileImgs[0].length; c++){
			tileImgs[r][c] = new Image();
			tileImgs[r][c].onload = imgLoadHandler;
			tileImgs[r][c].onerror = imgErrorHandler;
			tileImgs[r][c].src = "src/" + r + "/" + c + ".bmp";
		}
	}
	function imgLoadHandler(e){
		trace("Loaded " + e.target.src);
		loadedCount++;
		e.target["isValid"] = true;
		checkLoaded();
	}
	function imgErrorHandler(e){
		loadedCount++;
		e.target["isValid"] = false;
		checkLoaded();
	}
	function checkLoaded(){
		if(loadedCount == NUMROWS * NUMCOLS){
			paintCanvas();
		}
	}
}
function paintCanvas(){
	trace("paintCanvas");
	for(var r = 0; r < tileImgs.length; r++){
		for(var c = 0; c < tileImgs[0].length; c++){
			var tile = tileImgs[r][c];
			if(tile.isValid){
				trace("painting " + r + "," + c);
				ctx.drawImage(tile, c * TILE_WIDTH, r * TILE_WIDTH);
			}
		}
	}
	keyoutPink();
}
function keyoutPink(){
	var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imgdata.data;
	for(var i = 0; i < data.length; i+=4){
		if(data[i] == 255 && data[i+1] == 0 && data[i+2] == 255){
			data[i+3] = 0;
		}
	}
	ctx.putImageData(imgdata, 0, 0, canvas.width, canvas.height);
}
function trace(comment){
	if(window.console && console.log){
		console.log(comment);
	}
}
window.onload = init;
