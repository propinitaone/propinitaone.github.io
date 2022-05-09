var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    cw = c.width = window.innerWidth,
    ch = c.height = window.innerHeight,
    pi2 = Math.PI * 2,
    eyes = [],
    rand = function(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    };

ctx.lineJoin = 'round';
ctx.lineWidth = 8;

var Ball = function(opt) {
    this.x = opt.x;
    this.y = opt.y;
    this.vx = 5;
    this.vy = 5;
    this.radius = opt.radius;
    this.color = opt.color;
};

Ball.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > cw - this.radius || this.x < this.radius) {
        this.vx = -this.vx;
    }
    if (this.y > ch - this.radius || this.y < this.radius) {
        this.vy = -this.vy;
    }
};

Ball.prototype.render = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, pi2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
};

var Eye = function(opt) {
    this.xOrigin = opt.x;
    this.yOrigin = opt.y;
    this.x = opt.x;
    this.y = opt.y;
    this.scleraRadius = opt.scleraRadius;
    this.irisRadius = opt.irisRadius;
    this.pupilRadius = opt.pupilRadius;
    this.scleraColor = opt.scleraColor;
    this.irisColor = opt.irisColor;
    this.pupilColor = opt.pupilColor;
};

Eye.prototype.update = function() {
    var dx = ball.x - this.xOrigin,
        dy = ball.y - this.yOrigin,
        angle = Math.atan2(dy, dx),
        vx = Math.cos(angle) * 40,
        vy = Math.sin(angle) * 20;

    this.x = this.xOrigin + vx;
    this.y = this.yOrigin + vy;
};

Eye.prototype.render = function() {
    // Sclera Stroke
    ctx.beginPath();
    ctx.moveTo(this.xOrigin - this.scleraRadius, this.yOrigin);
    ctx.quadraticCurveTo(this.xOrigin, this.yOrigin - this.scleraRadius, this.xOrigin + this.scleraRadius, this.yOrigin);
    ctx.quadraticCurveTo(this.xOrigin, this.yOrigin + this.scleraRadius, this.xOrigin - this.scleraRadius, this.yOrigin);
    ctx.closePath();
    ctx.stroke();

    // Sclera Fill
    ctx.beginPath();
    ctx.moveTo(this.xOrigin - this.scleraRadius, this.yOrigin);
    ctx.quadraticCurveTo(this.xOrigin, this.yOrigin - this.scleraRadius, this.xOrigin + this.scleraRadius, this.yOrigin);
    ctx.quadraticCurveTo(this.xOrigin, this.yOrigin + this.scleraRadius, this.xOrigin - this.scleraRadius, this.yOrigin);
    ctx.fillStyle = this.scleraColor;
    ctx.fill();
    ctx.save();
    ctx.clip();

    // Iris
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.irisRadius, 0, pi2, false);
    ctx.fillStyle = this.irisColor;
    ctx.fill();

    // Pupil
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.pupilRadius, 0, pi2, false);
    ctx.fillStyle = this.pupilColor;
    ctx.fill();

    ctx.restore();
}

var updateEyes = function() {
    var i = eyes.length;
    while (i--) {
        eyes[i].update();
    }
};

var renderEyes = function() {
    var i = eyes.length;
    while (i--) {
        eyes[i].render();
    }
};

var clear = function() {
    ctx.clearRect(0, 0, cw, ch);
};

var run = function() {
    window.requestAnimFrame(run, c);
    clear();
    updateEyes();
    renderEyes();
    ball.update();
    ball.render();
};

window.requestAnimFrame = function() { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) { window.setTimeout(a, 1E3 / 60) } }();

var count = 20;
var i = count;
while (i--) {
    eyes.push(new Eye({
        x: ((cw - 150) / count) * (i + 1),
        y: rand(100, ch - 100),
        scleraRadius: 100,
        irisRadius: rand(40, 60),
        pupilRadius: rand(10, 30),
        scleraColor: '#fff',
        irisColor: '#ddd',
        pupilColor: '#000'
    }));
}

var ball = new Ball({
    x: cw / 2,
    y: ch / 2,
    radius: 20,
    color: '#017db0'
});

run();


// .txt-type
class TypeWriter {
    constructor(txtElement, words, wait = 100) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 1;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 100;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}


// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}