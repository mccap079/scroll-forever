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

        // Callback function for reading
        function(err, fileContents) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(fileContents);
        }
    );
}

// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = http.createServer(options, handler);

// Tell that server to listen on port 8081
httpServer.listen(9999);

console.log('Server listening on port 9999');

//////////////////////////

var clients = [];

var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
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

        socket.on('redditfeed', function(data) {
            var req = http.request(redditOptions, function(res) {
                var chunks = [];

                res.on("data", function(chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function() {
                    var body = Buffer.concat(chunks);
                    io.sockets.emit('redditfeed', body);
                });
            });
            req.on('error', function(err) {
                console.log("Error with reddit request.")
            });
            req.end();
        });

    }
);

// ----- GETTING IMGUR FEED ----- //

//https://api.imgur.com/3/gallery/hot/viral/0.json
//base URL: https://api.imgur.com/3/

const imgurOptions = {
    hostname: "api.imgur.com",
    port: 443,
    path: "/3/gallery/hot/viral/0",
    method: "GET",
    headers: {
        "Authorization": "Client-ID 1eeb25328e9da18"
    }
}

const redditOptions = {
    //http://reddit.com/r/worldnews/top.json?limit=100&t=week
    hostname: "reddit.com",
    port: 80, //http
    path: "/r/worldnews/top.json?limit=100&t=week",
    method: "GET"
}