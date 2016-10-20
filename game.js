"use strict";

var engine = require('./engine.js');

class Ship {
	constructor(o) {
		this.x = 50;
		this.y = 50;
	}

	position() {
		return {'x' : this.x, 'y' : this.y};
	}
}


class ComboGame extends engine.Game {
	setupPlayers() {
		this.ships = [];
	}

	createShip() {
		var s = new Ship();
		this.ships.push(s);
	}

	loop() { //TODO, obviously
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			s.x++;
			if (s.x > 300) {
				s.x = 0;
			}
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
}

module.exports = {
	"Game": ComboGame,
};