(function () {

    // RequestAnimFrame: a browser API for getting smooth animations
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        
    })();

    window.cancelRequestAnimFrame = (function () {
        return window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })();

    // DO NOT EDIT ABOVE

    // console.log('Holla');

    // Step: 01 .. AJB .. Create Game Canvas $ track mouse pos

    var gameCanvas = document.getElementById("canvas"); // Store HTML5 canvas tag into a JS Variable

    var ctx = gameCanvas.getContext("2d"); //cretae content 2d
    var mouseObj = {};
    var W = window.innerWidth;
    var H = window.innerHeight;


    gameCanvas.addEventListener("mousemove", function trackPosition(evt) {
        mouseObj.x = evt.pageX;
        mouseObj.y = evt.pageY;
        resizeCanvasToScreen();
        var x = getXAsHex();
        var y = getYAsHex();
        paintCanvasWithColor("#" + x + x + x);
    }, true);

    function resizeCanvasToScreen() {
        W = window.innerWidth;
        H = window.innerHeight;
        gameCanvas.width = W;
        gameCanvas.height = H;
    }

    function paintCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);
    }

    function paintCanvasWithColor(color) {
        console.log(color);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, W, H);
    }


    function getXAsHex() {
        var n = Math.ceil((mouseObj.x / W) * 255).toString(16)
        if (n.length < 2) {
            return "0" + n;
        }
        return n;
    }

    function getYAsHex() {
        var n = Math.ceil((mouseObj.y / H) * 255).toString(16)
        if (n.length < 2) {
            return "0" + n;
        }
        return n;
    }

    resizeCanvasToScreen();
    paintCanvas();

})();


