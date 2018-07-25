//[1] https://stackoverflow.com/a/10756409
//[2] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

var emojiImages = preload();
var w = window.innerWidth / 1.1,
    h = window.innerHeight / 1.1,
    x = 100,
    y = 100;
var rain = [],
    img = new Image();

window.addEventListener('load', function(e) {

    var rainNum = Math.floor(convertToRange(window.scrollY, [0, window.innerHeight * 2], [0, 50]));
    var scrollPos = window.scrollY;
    var canvas = document.getElementById('rain_canvas'),
        ctx = canvas.getContext('2d');

    for (let i = 0; i < rainNum; i++) {
        if (rain.length < rainNum) {
            rain.push(new newRain);
        }
    }

    var draw = function() {
        rain_canvas.width = w;
        rain_canvas.height = h;
        for (let t = 0; t < rain.length; t++) {
            let r = rain[t];
            let imgIndex = t + getRandomInt(0, 143 - t);
            ctx.drawImage(emojiImages[imgIndex], r.x, r.y, 50, 50);
            r.y -= convertToRange(lastIndex.a, [0, 1000], [5, 50]);
            if (r.y < -20) {
                r.y = h + 20;
            }
        }
    };

    document.addEventListener("scroll", function(event) {
        rainNum = Math.floor(convertToRange(window.scrollY, [0, 10000], [0, 50]));
        scrollPos = window.scrollY;
        if (rain.length < rainNum) {
            for (i = 0; i < rainNum; i++) {
                rain.push(new newRain);
            }
            draw();
        } else if (rain.length > rainNum) {
            for (i = 0; i < rain.length; i++) {
                if (i <= rainNum) {
                    rain.pop();
                }
            }
        }
    });

    setInterval(draw, 0);
});

function convertToRange(value, srcRange, dstRange) { //[1]
    if (value < srcRange[0] || value > srcRange[1]) {
        return NaN;
    }
    var srcMax = srcRange[1] - srcRange[0],
        dstMax = dstRange[1] - dstRange[0],
        adjValue = value - srcRange[0];
    return (adjValue * dstMax / srcMax) + dstRange[0];
}

function newRain() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
}

function getRandomInt(min, max) { //[2]
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function preload() {
    var emojis = [];
    for (i = 0; i < 143; ++i) {
        emojis[i] = new Image();
        emojis[i].src = '../img/emojis/' + i + '.png';
    }
    return emojis;
}