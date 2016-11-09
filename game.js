"use strict";

var engine = require('./engine.js');
var utils = require('./utils.js');
var Constants = require('./constants.js');

class Ball {
	constructor(o) {
		this.teamColor = 'white';
	}

	top() {
		return this.y - Constants["ball_r"];
	}

	bottom() {
		return this.y + Constants["ball_r"];
	}

	position() {
		return {'x' : this.x, 'y' : this.y, 'id' : this.id, 'teamColor' : this.teamColor};
	}

	loop(game) {
		this.oldX = this.x;
		this.oldY = this.y;
		// this.y = 500;
		this.x += this.mx;
		this.y += this.my;

		for (var i = 0; i < game.ships.length; i++) {
			var s = game.ships[i];

				// console.log(this.bottom());
				// console.log(s.top());
				if (this.y <= s.bottom() && this.y >= s.top()) {
				
				if ((this.oldX > s.x && this.x <= s.x) || (this.oldX < s.x && this.x >= s.x)) {
					this.mx = -this.mx;
					this.x += this.mx;
					this.oldX = this.x;
					continue;
				}
			}
		}

		if (this.x < 0) {
			this.mx = Math.abs(this.mx);
			this.x = this.mx;
		} else if (this.x > game.fw) {
			this.mx = -Math.abs(this.mx);
			this.x = game.fw + this.mx;
		}

		if (this.y < 0) {
			this.my = Math.abs(this.my);
			this.y = this.my;
		} else if (this.y > game.fh) {
			this.my = -Math.abs(this.my);
			this.y = game.fh + this.my;
		}		

	}
}

class Ship {
	constructor(o) {
		this.x = 50;
		this.y = 500;
		let colors = ['red', 'purple', 'yellow', 'orange', 'brown', 'green', 'blue'];
		let index = Math.floor(Math.random() * colors.length - 1);
		this.teamColor = colors[index];
	}

	top() {
		return this.y - Constants["paddle_r"];
	}

	bottom() {
		return this.y + Constants["paddle_r"];
	}

	position() {
		return {'x' : this.x, 'y' : this.y, 'id' : this.id, 'teamColor' : this.teamColor};
	}
}


class ComboGame extends engine.Game {
	setupPlayers() {
		this.ships = [];
		this.balls = [];
		this.fh = 500;
		this.fw = 500;
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
		this.spawnBall();
	}

	spawnBall() {
		var b = new Ball();
		b.id = "Ball" + this.balls.length;
		b.x = Math.floor(Math.random() * 450);
		b.y = Math.floor(Math.random() * 450);
		b.mx = -1;
		b.my = -1;
		this.balls.push(b);
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
		return this.ships.length < Constants['maxShips'];
	}

	createShip() {
		var s = new Ship();
		s.x = utils.Utils.shipPlacement(this.ships, this.fw, this.fh, Constants['maxShips']);
		s.id = new Date().valueOf();
		this.ships.push(s);
		return s;
	}

	loop() { //TODO, obviously
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			this.processShipCommand(s, s.command, this);
			s.command = 'none';
		}

		for (var i = 0; i < this.balls.length; i++) {
			var b = this.balls[i];
			b.loop(this);
		}
	}

	processShipCommand(ship, command, game) {
		if (command == 'up') {
			this.moveShipUp(ship, game);
		} else if (command == 'down') {
			this.moveShipDown(ship, game);
		}
	}

	shipPositions() {
		var d = [];
		for (var s of this.ships) {
  		d.push(s.position());
		}
		return d;
	}

	ballPositions() {
		var d = [];
		for (var b of this.balls) {
  		d.push(b.position());
		}
		return d;
	}


	state() {
		return {'objects' : {'ships' : this.shipPositions(), 'balls' : this.ballPositions()}};
	}

	doShip(shipId, fn, arg) {
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			if (s.id == shipId) {
				fn(s, arg, this);
				return;
			}
		}
	}

	moveShipUp(ship, game) {
		ship.y-= 5;
		if (ship.top() < 0) {
			ship.y = Constants["paddle_r"];;
		}
	}

	moveShipDown(ship, game) {
		ship.y+= 5;
		if (ship.bottom() > game.fh) {
			ship.y = game.fh - Constants["paddle_r"];
		}	
	}

	assignCommand(ship, command) {
		ship.command = command;
	}

	input(shipId, command) {
		this.doShip(shipId, this.assignCommand, command);
	}

	warpShip(shipId) {
		this.doShip(shipId, function(s) {
			s.y = Math.floor(Math.random() * 180);
		});
	}

	constants() {
		return Constants;
	}
}

module.exports = {
	"Game": ComboGame,
};