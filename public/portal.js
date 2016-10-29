"use strict";

class LocalPortal extends Portal {
	setup() {
		this.ships = [];
		this.balls = [];
		this.myint = 0;
	}

	handleBalls(sships) {
		for (var i = 0; i < sships.length; i++) {
				var ss = sships[i];
				var found = false;
				for (var j = 0; j < this.balls.length; j++) {
					var ls = this.balls[j];
					if (ls.id == ss.id) {
						found = true;
						ls.serverRecognized = true;
						let xDifference = ss.x - ls.x;
						if (Math.abs(xDifference) > 2) {
							ls.x += 0.1 * xDifference;	
						}
						
						let yDifference = ss.y - ls.y;
						if (Math.abs(yDifference) > 2) {
							ls.y += 0.1 * yDifference;	
						}
					}
				}

				if (!found) {
					this.balls.push(ss);
				}
			}
		
		var removals = [];
		for (var i = 0; i < this.balls.length; i++) {
			var s = this.balls[i];
			if (s.serverRecognized == false) {
				removals.push(s);
			} else {
				this.drawBall(s);	
			}
		}

		for (var i = 0; i < removals.length; i++) {
			var index = this.balls.indexOf(removals[i]);
			this.balls.splice(index, 1);
		}
	}

	handleShips(sships) {
			for (var i = 0; i < sships.length; i++) {
				var ss = sships[i];
				var found = false;
				for (var j = 0; j < this.ships.length; j++) {
					var ls = this.ships[j];
					if (ls.id == ss.id) {
						found = true;
						ls.serverRecognized = true;
						let xDifference = ss.x - ls.x;
						if (Math.abs(xDifference) > 2) {
							ls.x += 0.1 * xDifference;	
						}
						
						let yDifference = ss.y - ls.y;
						if (Math.abs(yDifference) > 2) {
							ls.y += 0.1 * yDifference;	
						}
					}
				}

				if (!found) {
					this.ships.push(ss);
				}
			}
		
		var removals = [];
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			if (s.serverRecognized == false) {
				removals.push(s);
			} else {
				this.drawShip(s);	
			}
		}

		for (var i = 0; i < removals.length; i++) {
			var index = this.ships.indexOf(removals[i]);
			this.ships.splice(index, 1);
		}
	}

	handleServerUpdate(d) {
		for (var j = 0; j < this.ships.length; j++) {
			var ls = this.ships[j];
			ls.serverRecognized = false;
		}

		this.setBackground();
		this.handleShips(d["ships"]);
		this.handleBalls(d["balls"]);
		
	}

	context() {
		return this.canvas.getContext('2d');
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
		this.context().fillStyle = "#000000";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}

	drawRect(x,y,w,h, colour) {
		this.context().fillStyle = colour;
		this.context().fillRect(x,y,w,h);
	}

	drawShip(s) {
		this.context().beginPath();
		this.drawRect(s.x - 5, s.y - 100, 10, 100, s.teamColor);
		// this.drawRect(s.x - 5, s.y - 10, 10, 30, s.teamColor);
	}

	drawBall(b) {
		this.context().beginPath();
		this.context().arc(b.x, b.y, 7, 0, 2 * Math.PI, false);
		this.context().fillStyle = b.teamColor;
		this.context().fill()
	}

	loop() {
		super.loop();
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			this.drawShip(s);
		}
	}

	parseInput(key_pressed_map, key_up_map, key_pressing_map, key_depressing_map) {
		if (key_pressed_map['U1'] == true) {
			this.io.emit('input', 'up');
		} else if (key_pressed_map['D1'] == true) {
			this.io.emit('input', 'down');
		}
	}

	swipeUp() {
		this.io.emit('input', 'up');
	}

	swipeDown() {
		this.io.emit('input', 'down');
	}

	processMouseDown(x, y) {
		console.log("warping");
		this.io.emit('warp', {});
	}
}