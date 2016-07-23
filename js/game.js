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

    var isColliding = false;
    var particles = [];
    var particlesPos = {};
    var particleDir = 1;
    var particleCount = 20;

    var ball = {
        x: 50,
        y: 50,
        r: 5,
        c: "#ffc107",
        vx: 8,
        vy: 4,
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
        y: (H) - 75,
        draw: function () {
            ctx.strokeStyle = "#ffc107";
            ctx.lineWidth = "2";
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffc107";
            ctx.fillText("Start", W / 2, H - 50 );
        }
    };

    var instructions = {
        width: 340,
        height: 150,
        x: (W / 2) - 170,
        y: (H/2) - 75,
        draw: function () {
            ctx.strokeStyle = "#969696";
            ctx.lineWidth = "2";
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#969696";
            ctx.fillText("-use the mouse to move the paddles", W / 2, H/2 - 25);
            ctx.fillText("-don't let the ball out the sides           ", W / 2, H/2 );
            ctx.fillText("-keep up, and get points!                   ", W / 2, H/2 + 25);
        }
    };

    var replayButton = {
        width: 100,
        height: 50,
        x: (W / 2) - 50,
        y: (H / 2) - 50,
        draw: function () {
            ctx.strokeStyle = "#ffc107";
            ctx.lineWidth = "2";
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffc107";
            ctx.fillText("Replay?", W / 2, H / 2 - 25);
        }
    };


    function main() {

        //get info about screen for painting
        gameCanvas.width = W;
        gameCanvas.height = H;
        gameCanvas.addEventListener("mousemove", trackPosition, true);
        gameCanvas.addEventListener("mousedown", btnClick, true);

        // create paddle object models
        paddlesArray.push(new PaddlePosition("top"));
        paddlesArray.push(new PaddlePosition("bottom"));

        //DRAWING FUNCTIONS
        paintCanvas();
        paintScore();
        paintPaddles();
        ball.draw();
        startBtn.draw();
        instructions.draw();
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
            p.y = mouseObj.y - p.height / 2;
        }
        //move the ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        //check for ball paddle collision
        checkCollision()
    }

    function paintScore() {
        ctx.fillStyle = "#969696";
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + score, W/2, 20);
    }

    function paintCanvas() {
        ctx.fillStyle = "#202020";
        ctx.fillRect(0, 0, W, H);
    }

    function trackPosition(evt) {
        mouseObj.x = evt.pageX;
        mouseObj.y = evt.pageY;
    }

    function btnClick(evt) {
        var mx = evt.pageX;
        var my = evt.pageY;

        if (mx >= startBtn.x && mx <= (startBtn.x + startBtn.width)) {
            if (my >= startBtn.y && my <= (startBtn.y + startBtn.height)) {
                startBtn = {};
                animloop();
            }
        }

        if (isGameOver) {
            if (mx >= replayButton.x && mx <= replayButton.x + replayButton.width) {
                if (my >= replayButton.y && my <= replayButton.y + replayButton.height) {
                    // replayButton = {};
                    score = 0;
                    ball.x = 50;
                    ball.y = 50;
                    ball.vx = 8;
                    ball.vy = 4;
                    isGameOver = false;
                    animloop();
                }
            }
        }
    }

    function paintPaddles() {
        for (var i = 0; i < paddlesArray.length; i++) {
            var p = paddlesArray[i];
            ctx.fillStyle = i ? "#666600":"#006666";
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }

    function PaddlePosition(TB) {
        this.width = 5;
        this.height = 150;

        this.y = H / 2 - this.height / 2;
        if (TB === "top") {
            this.x = 0;
        } else if (TB === "bottom") {
            this.x = W - this.width;
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
            if (ball.x + ball.r > W) {
                //GameOver
                gameOver();
            } else if (ball.x < 0) {
                //GameOver
                gameOver();
            }

            if (ball.y + ball.r > H) {
                ball.vy *= -1;
                ball.y = H - ball.r;
            } else if (ball.y < 0) {
                ball.vy *= -1;
                ball.y = 0;
            }
        }

        if (isColliding){
            for (var i = 0; i < particleCount;i++){
                particles.push(new createParticles(particlesPos.x,particlesPos.y,particleDir));
            }
        }

        emitParticles();
        isColliding = false;
    }

    function collides(b,p) {
        if (b.y + b.r >= p.y && b.y - b.r <= p.y + p.height) {
            if (b.x >= (p.x - p.width) && p.x > 0) {
                paddleHit = 0;
                return true;
            } else if (b.x <= p.width && p.x === 0) {
                paddleHit = 1;
                return true;
            } else {
                return false;
            }
        }
    }

    function collideAction(b,p) {
        ball.vx *=-1;
        score++;
        increaseSpeed();

        if (collisionSound) {
            collisionSound.play();
        }

        if(paddleHit == 0) {
            ball.x = p.x - p.width;
            particlesPos.x = ball.x + ball.r;
            particleDir = -1;
        } else if (paddleHit == 1) {
            ball.x = p.x + p.width + ball.r;
            particlesPos.x = ball.x - ball.r;
            particleDir = 1;
        }

        particlesPos.y = ball.y;
        isColliding = true;
    }

    function increaseSpeed() {
        if (Math.abs(ball.vx) < 15) {
            if (Math.floor(score % 4) == 0) {
                ball.vx *= 1.05;
                ball.vy *= 1.05;
                for (var i = 0; i < paddlesArray.length;i++) {
                    if (paddlesArray[i].height > 20){
                        paddlesArray[i].height -= 5;
                    }
                }
            }
        }
    }

    function gameOver() {
        // paintCanvas();
        ctx.fillStyle = "#969696";
        ctx.font = "20px Arial, san-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER - You scored: " + score + "!", W/2, H/2 + 25);

        cancelRequestAnimFrame(init);

        for (var i = 0; i < paddlesArray.length;i++) {
            paddlesArray[i].height = 150;
        }
        replayButton.draw();
        isGameOver = true;
    }

    function createParticles(x,y,d) {
        this.x = x || 0;
        this.y = y || 0;
        this.radius = 2;
        this.vy = -1.5 + Math.random() * 3;
        this.vx = d * Math.random() * 1.5;
    }

    function emitParticles() {
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];

            ctx.beginPath();
            ctx.fillStyle = "#ffc107";
            if (particle.radius > 0) {
                ctx.arc(particle.x,particle.y,particle.radius,0,Math.PI*2,false);
            }
            ctx.fill();
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.radius = Math.max(particle.radius - 0.05,0.0);

        }
    }

    main();
    
})();

