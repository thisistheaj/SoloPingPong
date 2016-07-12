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
var points = 0;
var paddlesArray = [];

var ball = {
	x: 50,
	y: 50,
	r: 5,
	c: "#ffffff",
	vx: 4,
	vy: 8,
	draw: function () {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false);
		ctx.fill();
	}
};

var startBtn = {
	w: 100,
	h: 50,
	x: (W/2) - 50,
	y: (H/2) - 25,
	draw: function () {
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x,this.y,this.w,this.h);

		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("Start", W/2, H/2);
	}
};

function paintScore() {
	ctx.fillStyle = "#ffffff";
	ctx.font = "18px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20);
}


function paintCanvas() {
	console.log("The browser width is currently " + W);
	console.log("The browser height is currently " + H);
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

function PaddlePosition(TB) {
	this.width = 150;
	this.height = 5;

	this.x = W/2 - this.width/2;
	if (TB === "top") {
		this.y = 0;
	} else if (TB === "bottom") {
		this.y = H - this.height;
	}

	// return this;
}

//get info about screen for painting
gameCanvas.width = W;
gameCanvas.height = H;
gameCanvas.addEventListener("mousemove",trackPosition,true);

//create paddle object models
paddlesArray.push(new PaddlePosition("top"));
paddlesArray.push(new PaddlePosition("bottom"));

console.log("top paddle y is: " + paddlesArray[0].y);
console.log("bottom paddle y is: " + paddlesArray[1].y);

//draw screen
paintCanvas();
paintScore();

//draw objects
ball.draw();
startBtn.draw();

for (var i = 0; i < paddlesArray.length; i++) {

}