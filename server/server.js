var http = require('https');
var fs = require('fs');
var url = require('url');

var options = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
};

function handler(req, res) {

    var parsedUrl = url.parse(req.url);

    var path = parsedUrl.pathname;
    if (path == "/") {
        path = "index.html";
    }

    fs.readFile(__dirname + path,
        function(err, fileContents) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }
            res.writeHead(200);
            res.end(fileContents);
        }
    );
}

var httpServer = http.createServer(options, handler);
httpServer.listen(9999);
console.log('Server listening on port 9999');

var clients = [];

var io = require('socket.io').listen(httpServer);
io.sockets.on('connection',
    function(socket) {
        console.log("We have a new client: " + socket.id);
        socket.on('imgurfeed', function(data) {
            var req = http.request(imgurOptions, function(res) {
                var chunks = [];
                res.on("data", function(chunk) {
                    chunks.push(chunk);
                });
                res.on("end", function() {
                    var body = Buffer.concat(chunks);
                    io.sockets.emit('imgurfeed', body);
                });
            });
            req.on('error', function(err) {
                console.log("Error with imgur request.")
            });
            req.end();
        });
    }
);

//https://api.imgur.com/3/gallery/hot/viral/0.json
const imgurOptions = {
    hostname: "api.imgur.com",
    port: 443,
    path: "/3/gallery/hot/viral/0",
    method: "GET",
    headers: {
        "Authorization": "Client-ID 1eeb25328e9da18"
    }
}