var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var serveStatic = require('serve-static');
// app.use(serveStatic('public', {'index': ['game.html']}));

var combo = require("./combo.js");

var ships = [];

function emitBeat(socket) {
	socket.emit('beat', {"ships" : ships});
}

function updateShipInput(input, socket) {

}

function createShip(socket) {
	var ship = new combo.Ship();
	ships.push(ship);
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
