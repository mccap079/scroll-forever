//[1] https://stackoverflow.com/a/13222226/1757149
//[2] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

// ------ general setup

var windowWidth = window.innerWidth - 560, //560 = .ytContainer width
    scrollAmt = 10,
    numElems = 5; //for each type (giphy, youtube)
const ipcRenderer = require("electron").ipcRenderer; //for receiving scroll data from window1

// ------ giphy setup

var xhrGiphy = new XMLHttpRequest(),
    jsonGiphy,
    imgUrlsGiphy = [],
    elemGiphy = [];
xhrGiphy.open("GET", "https://api.giphy.com/v1/stickers/trending?api_key=6RSAovExBsWO9VWov67lgc6RgzhcT64d&limit=100", false);
xhrGiphy.send();
console.log(xhrGiphy.status);
console.log(xhrGiphy.statusText);
jsonGiphy = JSON.parse(xhrGiphy.responseText);
for (let i = 0; i < jsonGiphy.data.length; i++) {
    imgUrlsGiphy.push(jsonGiphy.data[i].images.downsized.url);
}
for (let i = 0; i < numElems * 2; i++) {
    elemGiphy[i] = document.createElement('div');
    elemGiphy[i].setAttribute('id', 'giphy_' + i);
    elemGiphy[i].setAttribute('class', 'giphyContainer');
    elemGiphy[i].innerHTML = "<img src=\"" + imgUrlsGiphy[getRandomInt(0, imgUrlsGiphy.length - 1)] + "\" >";
}

// ------ youtube setup

var xhrYt = new XMLHttpRequest(),
    jsonYt,
    vidUrlsYt = [],
    elemYt = [];

var d = new Date();
//save now to date:
var year = d.getFullYear(),
    month = d.getMonth() + 1,
    day = d.getDate();
var publishedAfter = year + "-" + month + "-" + day;
publishedAfter = "2018-6-31";
//save 1 month ago to date:
month = d.setMonth(d.getMonth() - 1);
var _d = new Date(month);
var _month = _d.getMonth() + 1;
var publishedBefore = year + "-" + _month + "-" + day;

console.log("publishedBefore = " + publishedBefore);
console.log("publishedAfter = " + publishedAfter);

//load top 50 vids based on view count from past month
console.log("get = " + "https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&maxResults=50&publishedAfter=" + publishedBefore + "T00%3A00%3A00Z&safeSearch=strict&videoEmbeddable=true&videoSyndicated=true&type=video&videoLicense=creativeCommon&key=AIzaSyD4LJ_KCXoyVhWDHdJ4iLlB2DWez_sjTBQ");
xhrYt.open("GET", "https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&maxResults=50&publishedAfter=" + publishedBefore + "T00%3A00%3A00Z&safeSearch=strict&videoEmbeddable=true&videoSyndicated=true&type=video&videoLicense=creativeCommon&key=AIzaSyD4LJ_KCXoyVhWDHdJ4iLlB2DWez_sjTBQ", false);
xhrYt.send();
console.log(xhrYt.status);
console.log(xhrYt.statusText);
jsonYt = JSON.parse(xhrYt.responseText);

console.log("jsonYt.items.length = " + jsonYt.items.length);

for (let i = 0; i < jsonYt.items.length; i++) {
    let vidUrl = "https://www.youtube.com/embed/" + jsonYt.items[i].id.videoId + "?rel=0&autoplay=1";
    vidUrlsYt.push(vidUrl);
    console.log("vidUrl " + i + " = " + vidUrl);
}

for (let i = 0; i < numElems; i++) {
    elemYt[i] = document.createElement('div');
    elemYt[i].setAttribute('id', 'ytContainer' + i);
    elemYt[i].setAttribute('class', 'ytContainer');
    let thisUrl = "<iframe class=\"video\" id=\"video1\" width=\"640px\" height=\"380px\" src=\"" + vidUrlsYt[Math.floor(Math.random() * (vidUrlsYt.length - 1))] + "\" frameborder=\"0\"></iframe>";
    console.log("thisUrl " + i + " = " + thisUrl);
    elemYt[i].innerHTML = thisUrl;
}
console.log("elemYt.length = " + elemYt.length);

window.addEventListener('load', function(e) {

    ipcRenderer.on('window1Scroll', function(event, data) {
        scrollAmt = data;
    });

    for (let i = 0; i < numElems; i++) {
        document.getElementById('verticalScroller').appendChild(elemYt[getRandomInt(0, elemYt.length - 1)]);
        document.getElementById('verticalScroller').appendChild(elemGiphy[getRandomInt(0, elemGiphy.length - 1)]);
    }
    let i = 0;

    //using jquery for scrolling animation, it's just 100x easier
    $("#verticalScroller > div").each(function() {
        $(this).css("top", i);
        $(this).css("left", Math.floor(Math.random() * windowWidth));
        i += window.innerHeight / 3;
        window.verticalScroller($(this));
    });
});

window.verticalScroller = function($elem) { //[1]
    let top = parseInt($elem.css("top"));
    let temp = -1 * $('#verticalScroller > div').height();
    if (top < temp) {
        top = $('#verticalScroller').height()
        $elem.css("left", Math.floor(Math.random() * windowWidth));
        if ($elem.hasClass('ytContainer')) {
            $elem.children().attr('src', vidUrlsYt[getRandomInt(0, vidUrlsYt.length - 1)]);
        } else {
            $elem.children().attr('src', imgUrlsGiphy[getRandomInt(0, imgUrlsGiphy.length - 1)]);
        }
        $elem.css("top", top);
    }
    $elem.animate({
        top: (parseInt(top) - scrollAmt)
    }, 800, 'linear', function() {
        window.verticalScroller($(this))
    });
}

function getRandomInt(min, max) { //[2]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}