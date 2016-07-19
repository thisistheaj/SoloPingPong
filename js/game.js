(function () {
    'use strict';

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

    //DO Not Edit above

    var gameCanvas = document.getElementById("canvas"); // Store HTML5 canvas tag into a JS Variable
    var ctx = gameCanvas.getContext("2d"); //cretae content 2d
    var init;

    var W = window.innerWidth;
    var H = window.innerHeight;

    var mouseObj = {};
    var score = 0;
    var paddlesArray = [];
    var paddleHit;
    var collisionSound = document.getElementById('collide');
    var isGameOver = false;

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
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.fill();
        }
    };

    var startBtn = {
        width: 100,
        height: 50,
        x: (W / 2) - 50,
        y: (H / 2) - 25,
        draw: function () {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = "2";
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Start", W / 2, H / 2);
        }
    };

    var replayButton = {
        width: 100,
        height: 50,
        x: (W / 2) - 50,
        y: (H / 2) - 50,
        draw: function () {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = "2";
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Replay?", W / 2, H / 2 - 25);
        }
    };


    function main() {

        //get info about screen for painting
        gameCanvas.width = W;
        gameCanvas.height = H;
        gameCanvas.addEventListener("mousemove", trackPosition, true);
        gameCanvas.addEventListener("mousedown", btnClick, true);

        //create paddle object models
        paddlesArray.push(new PaddlePosition("top"));
        paddlesArray.push(new PaddlePosition("bottom"));

        //DRAWING FUNCTIONS
        paintCanvas();
        paintScore();
        paintPaddles();
        ball.draw();
        startBtn.draw();
    }

    function refreshCanvasFun() {
        paintCanvas();
        paintPaddles();
        ball.draw();
        paintScore();
        update();
    }

    function update() {
        //move the paddle
        for (var i = 0; i < paddlesArray.length; i++) {
            var p = paddlesArray[i];
            p.x = mouseObj.x - p.width / 2;
        }
        //move the ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        //check for ball paddle collision
        checkCollision()
    }

    function paintScore() {
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + score, 20, 20);
    }


    function paintCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);
    }

    function trackPosition(evt) {
        mouseObj.x = evt.pageX;
        mouseObj.y = evt.pageY;
    }

    function btnClick(evt) {
        var mx = evt.pageX;
        var my = evt.pageY;

        if (mx >= startBtn.x && mx <= startBtn.x + startBtn.width) {
            if (my >= startBtn.y && mx <= startBtn.y + startBtn.height) {
                startBtn = {};
                animloop();
            }
        }

        if (isGameOver) {
            if (mx >= replayButton.x && mx <= replayButton.x + replayButton.width) {
                if (my >= replayButton.y && mx <= replayButton.y + replayButton.height) {
                    // replayButton = {};
                    score = 0;
                    ball.x = 50;
                    ball.y = 50;
                    ball.vx = 4;
                    ball.vy = 8;
                    isGameOver = false;
                    animloop();
                }
            }
        }
    }

    function paintPaddles() {
        for (var i = 0; i < paddlesArray.length; i++) {
            var p = paddlesArray[i];
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }

    function PaddlePosition(TB) {
        this.width = 150;
        this.height = 5;

        this.x = W / 2 - this.width / 2;
        if (TB === "top") {
            this.y = 0;
        } else if (TB === "bottom") {
            this.y = H - this.height;
        }
    }

    function animloop() {
        init = requestAnimationFrame(animloop);
        refreshCanvasFun();
    }

    function checkCollision() {
        var pTop = paddlesArray[0];
        var pBot = paddlesArray[1];

        if (collides(ball, pTop)) {
            collideAction(ball, pTop);
        } else if (collides(ball, pBot)) {
            collideAction(ball, pBot);
        } else {
            //collide with walls or end game
            if (ball.y + ball.r > H) {
                //GameOver
                gameOver();
            } else if (ball.y < 0) {
                //GameOver
                gameOver();
            }

            if (ball.x + ball.r > W) {
                ball.vx *= -1;
                ball.x = W - ball.r;
            } else if (ball.x < 0) {
                ball.vx *= -1;
                ball.x = 0;
            }
        }
    }

    function collides(b,p) {
        if (b.x + b.r >= p.x && b.x - b.r <= p.x + p.width) {
            if (b.y >= (p.y - p.height) && p.y > 0) {
                paddleHit = 0;
                return true;
            } else if (b.y <= p.height && p.y === 0) {
                paddleHit = 1;
                return true;
            } else {
                return false;
            }
        }
    }

    function collideAction(b,p) {
        ball.vy *=-1;
        score++;
        if (collisionSound) {
            collisionSound.play();
        }
    }

    function gameOver() {
        // paintCanvas();
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial, san-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER - You scored: " + score + "!", W/2, H/2 + 25);

        cancelRequestAnimFrame(init);

        replayButton.draw();
        isGameOver = true;
    }

    main();
    
})();

