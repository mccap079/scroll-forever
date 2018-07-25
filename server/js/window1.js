//[1] https://stackoverflow.com/a/37403125/1757149
//[2] https://stackoverflow.com/a/36488458/1757149
//[3] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

var socket = io.connect();

//imgur
var jsonImgur,
    isAlbum = [],
    imgLink = [];

//infinite scroll 
var scrollPos = 0,
    lastAddPos = 0,
    lastIndex = { //[1]
        aInternal: 0,
        aListener: function(val) {},
        set a(val) {
            this.aInternal = val;
            this.aListener(val);
        },
        get a() {
            return this.aInternal;
        },
        registerListener: function(listener) {
            this.aListener = listener;
        }
    }

window.addEventListener('load', function(e) {

    //imgur
    socket.emit('imgurfeed', 0);
    socket.on('imgurfeed', function(data) {
        let dataString = arrayBufferToString(data);
        jsonImgur = JSON.parse(dataString);
        for (let i = 0; i < jsonImgur.data.length; i++) {
            isAlbum[i] = jsonImgur.data[i].is_album;
            if (isAlbum[i] === true) {
                for (let j = 0; j < jsonImgur.data[i].images.length; j++) {
                    let url = jsonImgur.data[i].images[j].link;
                    if (!checkIfVideo(url)) {
                        imgLink.push(ensureHTTPS(url));
                    }
                }
            } else {
                let url = jsonImgur.data[i].link;
                if (!checkIfVideo(url)) {
                    imgLink.push(ensureHTTPS(url));
                }
            }
        }
        for (let i = 0; i < 10; i++) {
            addToFeed(i);
            lastIndex.a = 10;
        }
    });

    //infinite scroll
    window.addEventListener('scroll', function(e) {
        let topIndex = lastIndex.a - 10;
        let topDiv = document.getElementById('container_' + topIndex);
        let distanceToTop = topDiv.getBoundingClientRect().top;
        let topDivHeight = topDiv.offsetHeight;

        if (distanceToTop <= -topDivHeight) {
            addToFeed(lastIndex.a);
            removeFromFeed(lastIndex.a - 10);
            scroll(0, 0);
            lastIndex.a++;
            const ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.send('scroll', lastIndex.a);
        }
    });
});

function arrayBufferToString(buffer) { //[2]
    let byteArray = new Uint8Array(buffer),
        str = "",
        cc = 0,
        numBytes = 0;
    for (let i = 0, len = byteArray.length; i < len; i++) {
        let v = byteArray[i];
        if (numBytes > 0) {
            if ((cc & 192) === 192) {
                cc = (cc << 6) | (v & 63);
            } else {
                throw new Error("this is no tailing-byte");
            }
        } else if (v < 128) {
            numBytes = 1;
            cc = v;
        } else if (v < 192) {
            throw new Error("invalid byte, this is a tailing-byte")
        } else if (v < 224) {
            numBytes = 2;
            cc = v & 31;
        } else if (v < 240) {
            numBytes = 3;
            cc = v & 15;
        } else {
            throw new Error("invalid encoding, value out of range")
        }

        if (--numBytes === 0) {
            str += String.fromCharCode(cc);
        }
    }
    if (numBytes) {
        throw new Error("the bytes don't sum up");
    }
    return str;
}

function checkIfVideo(_url) {
    let ext = _url.slice(-3);
    if (ext == "mp4") {
        return true;
    } else {
        return false;
    }
}

function ensureHTTPS(_url) {
    if (_url.substr(0, 5) === "http:") {
        return _url.slice(0, 4) + "s" + _url.slice(4);
    } else {
        return _url;
    }

}

function addToFeed(_i) {
    let randomPost = getRandomInt(1, imgLink.length - 1);
    let imgurImgContainer = document.createElement("div");
    imgurImgContainer.setAttribute('class', 'imgurImgContainer');
    imgurImgContainer.setAttribute('id', 'container_' + _i);
    document.getElementById("imgurListContainer").appendChild(imgurImgContainer);
    let imgurImg = document.createElement("img");
    imgurImg.setAttribute('src', imgLink[randomPost]);
    imgurImg.setAttribute('class', 'imgurImg');
    document.getElementById('container_' + _i).appendChild(imgurImg);
}

function removeFromFeed(_i) {
    let element = document.getElementById("container_" + _i);
    element.parentNode.removeChild(element);
}

function getRandomInt(min, max) { //[3]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}