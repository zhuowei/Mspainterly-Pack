var TILE_WIDTH = 32;
var NUMROWS = 16;
var NUMCOLS = 16;
var canvas;
var ctx;
var tileImgs;
var woolTile; //Special case: transparent wool tile
var woolColours = [["0, 0, 0", "128, 0, 0", "0, 128, 0", "128, 64, 0", 
	"0, 0, 128", "128, 0, 128", "0, 128, 200", "128, 128, 128"], 
	["64, 64, 64", "255, 0, 128", "0, 255, 0", "255, 255, 0", 
	"64, 64, 255", "255, 0, 128", "255, 128, 0"]];
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
	woolTile = new Image();
	woolTile.src = "src/wool.png";
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
	paintColouredWool();
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
function paintColouredWool() {
	for(var r = 7; r <= 14; r++) {
		for (var c = 1; c <= 2; c++) {
			if (r == 14 && c == 2) { //No wool image here. 
				continue;
			}
			ctx.fillStyle = 'rgba(' + woolColours[c - 1][r - 7] + ", 128)";
			ctx.fillRect(c * TILE_WIDTH, r * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
			ctx.drawImage(woolTile, c * TILE_WIDTH, r * TILE_WIDTH);
		}
	}
}
	
function trace(comment){
	if(window.console && console.log){
		console.log(comment);
	}
}
window.onload = init;
