// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

var connectedSockets = [];  // Since io.sockets.clients() no longer works

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);

		// Add to the connectedSockets Array
		connectedSockets.push(socket);
		
		socket.on('peer_id', function(data) {
			console.log("Received: 'peer_id' " + data);

			// We can save this in the socket object if we like
			socket.peer_id = data;
			console.log("Saved: " + socket.peer_id);

			// We can loop through these if we like
			for (var i  = 0; i < connectedSockets.length; i++) {
				console.log("loop: " + i + " " + connectedSockets[i].peer_id);
			}
			
			// Tell everyone my peer_id
			socket.broadcast.emit('peer_id',data);
		});
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
			var indexToRemove = connectedSockets.indexOf(socket);
			connectedSockets.splice(indexToRemove, 1); // Remove 1 from position, indexToRemove
		});
	}
);