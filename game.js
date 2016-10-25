"use strict";

var engine = require('./engine.js');

class Ship {
	constructor(o) {
		this.x = 50;
		this.y = 50;
		let colors = ['red', 'purple', 'yellow', 'orange', 'brown', 'green', 'blue'];
		let index = Math.floor(Math.random() * colors.length - 1);
		this.teamColor = colors[index];
	}

	position() {
		return {'x' : this.x, 'y' : this.y, 'id' : this.id, 'teamColor' : this.teamColor};
	}
}


class ComboGame extends engine.Game {
	setupPlayers() {
		this.ships = [];
		this.fh = 500;
	}

	disconnect(shipId) {
		var index = -1;
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			if (s.id == shipId) {
				index = i;
				break;
			}
		}

		if (index > -1) {
			this.ships.splice(index, 1); //post goodbye message
		}
	}

	openSeat() {
		return this.ships.length < 6;
	}

	createShip() {
		var s = new Ship();
		s.x = Math.floor(Math.random() * 500);
		s.id = new Date().valueOf();
		this.ships.push(s);
		return s;
	}

	loop() { //TODO, obviously
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
		}
	}

	shipPositions() {
		var d = [];
		for (var s of this.ships) {
  		d.push(s.position());
		}
		return d;
	}

	state() {
		return {'ships' : this.shipPositions()};
	}

	doShip(shipId, fn) {
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			if (s.id == shipId) {
				fn(s, this);
				return;
			}
		}
	}

	moveShipUp(ship, game) {
		ship.y-= 5 ;
		if (ship.y < 0) {
			ship.y = 0;
		}
	}

	moveShipDown(ship, game) {
		ship.y+= 5;
		if (ship.y > game.fh) {
			ship.y = game.fh;
		}	
	}

	input(shipId, command) {
		if (command == 'up') {
			this.doShip(shipId, this.moveShipUp);
		} else if (command == 'down') {
			this.doShip(shipId, this.moveShipDown);
		}
		
	}

	warpShip(shipId) {
		this.doShip(shipId, function(s) {
			s.y = Math.floor(Math.random() * 180);
		});
	}
}

module.exports = {
	"Game": ComboGame,
};