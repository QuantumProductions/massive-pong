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
		this.beta = new Ship();
	}

	loop() {
		this.beta.x ++;
		if (this.beta.x > 50) {
			this.beta.x = 0;
		}
	}

	state() {
		console.log("beta.x" + this.beta.x);
		return {'beta' : this.beta.position()};
	}
}

module.exports = {
	"Game": ComboGame,
};