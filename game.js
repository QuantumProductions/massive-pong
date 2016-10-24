"use strict";

var engine = require('./engine.js');

class Ship {
	constructor(o) {
		this.x = 50;
		this.y = 50;
	}

	position() {
		return {'x' : this.x, 'y' : this.y, 'id' : this.id};
	}
}


class ComboGame extends engine.Game {
	setupPlayers() {
		this.ships = [];
	}

	createShip() {
		var s = new Ship();
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
				fn(s);
				return;
			}
		}
	}

	moveShipUp(ship) {
		ship.y-= 5 ;
		if (ship.y < 0) {
			ship.y += 180;
		}
	}

	moveShipDown(ship) {
		ship.y+= 5;
		if (ship.y > 180) {
			ship.y -= 180;
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