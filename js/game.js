// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return  window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame    ||
			window.oCancelRequestAnimationFrame      ||
			window.msCancelRequestAnimationFrame     ||
		clearTimeout;
} )();

//DO Not Edit above

// console.log('Holla');

// Step: 01 .. AJB .. Create Game Canvas $ track mouse pos

var gameCanvas = document.getElementById("canvas"); // Store HTML5 canvas tag into a JS Variable

var ctx = gameCanvas.getContext("2d"); //cretae content 2d
var W = window.innerWidth;
var H = window.innerHeight;
var mouseObj = {};

gameCanvas.width = W;
gameCanvas.height = H;

console.log("The browser width is currently " + W);

function paintCanvas() {
	console.log("The browser width is currently " + W);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,W,H);
}

function trackPosition(evt) {
	mouseObj.x = evt.pageX;
	mouseObj.y = evt.pageY;
	console.log(
		"Cursor X is: " +
		mouseObj.x +
		" Cursor Y is: " +
		mouseObj.y
	)
}


gameCanvas.addEventListener("mousemove",trackPosition,true);

paintCanvas();