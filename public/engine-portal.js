"use strict";

class Portal {
	constructor() {
		this.installCanvas();
		this.setup();
		this.connectToServer();
		this.installInput();
		this.installLoops();
	}

	setup() {
		this.things = {};
	}

	generateCanvas() {
		var canvas = document.getElementById('canvas');
		canvas.width = 500;
		canvas.height = 500;
		return canvas;
	}

	installCanvas() {
		this.canvas = this.generateCanvas();
		document.getElementById("game_container").appendChild(this.canvas); 
	}

	connectToServer() {
		this.io = io();
		this.io.portal = this;
		this.io.on('beat', function(d) {
			this.portal.handleServerUpdate(d);
		});
	}

	installInput() {
		this.installMouseInput();
		this.installKeyboardInput();
	}

	installKeyboardInput() {
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		this.key_down_map = {};
		this.key_depressing_map = {};
		this.key_pressing_map = {};
		this.key_up_map = {};

		this.key_map = {
			27: 'ESC',
			37: 'L1',
			38: 'U1',
			39: 'R1',
			40: 'D1',
			16: 'A1',
			83: 'L2',
			69: 'U2',
			68: 'D2',
			70: 'R2',
			90: 'A2',
			77: 'M1',
			78: 'S1',
			49: 'DEBUG1',
			50: 'DEBUG2',
			51: 'DEBUG3',
			52: 'DEBUG4'
		}
	}

	onKeyUp(event) {
		this.key_down_map[this.key_map[event.keyCode]] = false;
		this.key_up_map[this.key_map[event.keyCode]] = true;
	}

	onKeyDown(event) { 
		this.key_down_map[this.key_map[event.keyCode]] = true;
		this.key_up_map[this.key_map[event.keyCode]] = false;
	}

	installMouseInput() {
		this.canvas.addEventListener("click", this.onMouseDown.bind(this), false);
	}

	onMouseDown(event) {
		var x = event.layerX;
		var y = event.layerY;
		this.processMouseDown(x, y);
	}

	processMouseDown(x, y) {
		
	}

	installLoops() {
		window.requestAnimationFrame(this.loop.bind(this));
	}

	loop() {
		this.now = Date.now();
		var delta  = this.now - this.last;
		this.last = this.now;

		this.dt = this.dt + delta;

		if (this.dt < this.rate) {
			window.requestAnimationFrame(this.loop.bind(this));
			return;
		}

		while (this.dt > this.rate) {
			this.game.loop(delta);	
			this.dt -= delta;
		}
		
		this.loopInput();

		window.requestAnimationFrame(this.loop.bind(this));
	}

	loopKeyboardInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
		this.parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map);
	}	

	loopInput() {
		this.loopKeyboardInput(this.key_down_map, this.key_up_map, this.key_pressing_map, this.key_depressing_map);
	}

	processObjects(d) {
		console.log("processing" + d);
		this.setBackground();
		let objectKeys = Object.keys(d);
		for (var key of objectKeys) {
			if (!this.things[key]) {
				this.things[key] = [];
			}
			var localObjects = this.things[key];
			var sObjects = d[key];

			for (var i = 0; i < sObjects.length; i++) {
				var ss = sObjects[i];
				var found = false;
				for (var j = 0; j < localObjects.length; j++) {
					var ls = localObjects[j];
					if (ls.id == ss.id) {
						found = true;
						ls.serverRecognized = true;
						this.smooth(ls, ss);
					}
				}

				if (!found) {
					this.things[key].push(ss);
					console.log("pushed local object");
				}

				var removals = [];
				for (var k = 0; k < this.things[key].length; k++) {
					let ls = this.things[key][k]
					if (ls.serverRecognized == false) {
						removals.push(ls);
					} else {
						this.render(key, ls);
					}
				}

				for (var i = 0; i < removals.length; i++) {
					console.log("remove");
					// var index = localObjects.indexOf(removals[i]);
					// localObjects.splice(index, 1);
				}
			}
		}
	}

	smooth(ls,ss) { 
		let xDifference = ss.x - ls.x;
		if (Math.abs(xDifference) > 2) {
			ls.x += 0.1 * xDifference;	
		}
			
		let yDifference = ss.y - ls.y;
		if (Math.abs(yDifference) > 2) {
			ls.y += 0.1 * yDifference;	
		}
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
		this.context().fillStyle = "#000000";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}

	render(key, t) {
		if (key == 'balls') {
			let ctx = this.context();
			ctx.beginPath();
			ctx.arc(t.x, t.y, 7, 0, 2 * Math.PI, false);
			ctx.fillStyle = t.teamColor;
			ctx.fill();
		} else if (key == 'ships') {
		}
		
	}

	handleServerUpdate(d) {
		this.processObjects(d["objects"]);
		//events
	}

	
};