var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');
app.use(serveStatic('public', {'index': ['game.html']}));

var g = require("./game.js");

var game = new g.Game();

var ships = [];

function emitBeat(socket) {
	socket.emit('beat', {"ships" : ships});
}

function updateShipInput(input, socket) {

}

function createShip(socket) {
	game.createShip();
}

io.on('connection', function(socket){
	createShip(socket);
  emitBeat(socket);


  socket.on('input', function(msg){
  	updateShipInput(msg, socket);
  });

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