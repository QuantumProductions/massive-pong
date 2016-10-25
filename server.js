"use strict"

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');
app.use(serveStatic('public', {'index': ['game.html']}));

var g = require("./game.js");

var game = new g.Game();

var ships = [];

function emitBeat(socket) {
	let state = game.state();
	socket.emit('beat', state);
}

function updateShipInput(input, socket) {

}

var socketShips = {};
var socketQueue = [];

function createShip(socket) {
	var s = game.createShip();
	console.log(s.id);
	socketShips[socket.id] = s.id;
}

function queue(socket) {
  socketQueue.push(socket);
}

function removeFromQueue(socket) {
  let index = -1;
  for (var i = 0; i < socketQueue.length; i++) {
    var sq = socketQueue[i];
    if (sq.id == socket.id) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    socketQueue.splice(index, 1);
  }
}

io.on('connection', function(socket){
  emitBeat(socket);

  socket.on('join', function(msg) {
  	console.log("joined");
    if (game.openSeat()) {
      createShip(socket);
    } else {
      queue(socket);
    }
  });

  socket.on('disconnect', function () {
    removeFromQueue(socket);
    removeFromGame(socket);
    if (game.openSeat() && socketQueue.length > 0) {
      createShip(socketQueue[0]);
      removeFromQueue(socketQueue[0]);
    }
  }

  socket.on('input', function(msg){
  	updateShipInput(msg, socket);
  });

  socket.on('input', function(msg) {
  	var socketShipId = socketShips[socket.id];
  	if (socketShipId) {
  		game.input(socketShipId, msg);
  	} else {
  		console.log("invalid id");
  	}
  });

  socket.on('warp', function(msg) {
  	var socketShipId = socketShips[socket.id];
  	if (socketShipId) {
  		game.warpShip(socketShipId);
  	}
  });

});

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var now = 0;
var dt = 0;
var last = now;
var rate = 10;

function loop() {
	now = Date.now();
	var delta  = now - last;
	last = now;

	dt = dt + delta;

	if (dt < rate) {
		return;
	}

	game.loop();
	let state = game.state();
	io.emit('beat', state);
}

setInterval(loop, 10);
