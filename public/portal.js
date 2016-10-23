"use strict";

class LocalPortal extends Portal {
	setup() {
		this.ships = [];
		this.myint = 0;
	}

	handleServerUpdate(d) {
		var sships = d["ships"]; //TODO: extract
			for (var i = 0; i < sships.length; i++) {
				var ss = sships[i];
				var found = false;
				for (var j = 0; j < this.ships.length; j++) {
					var ls = this.ships[j];
					if (ls.id == ss.id) {
						found = true;
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
		
		this.setBackground();
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			this.drawShip(s);
		}
	}

	context() {
		return this.canvas.getContext('2d');
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
		this.context().fillStyle = "#000000";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}

	drawShip(s) {
		var c = this.context();
		c.beginPath();
		c.fillStyle = "red";
		c.arc(s.x, s.y, 15, 0, 2 * Math.PI, false);
		c.fill();
	}

	loop() {
		super.loop();
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			s.x++;
		}
	}

	parseInput(key_pressed_map, key_up_map, key_pressing_map, key_depressing_map) {
		if (key_pressed_map['U1'] == true) {
			this.io.emit('input', 'up');
		} else if (key_pressed_map['D1'] == true) {
			this.io.emit('input', 'down');
		}
	}

	processMouseDown(x, y) {
		console.log("warping");
		this.io.emit('warp', {});
	}
}