"use strict";

class Constants {

}

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

		this.io.on('constants', function(d) {
			this.portal.handleConstants(d);
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
			this.actualLoop(delta);	
			this.dt -= delta;
		}
		
		this.loopInput();

		window.requestAnimationFrame(this.loop.bind(this));
	}

	actualLoop() {
		// this.setBackground();
	}

	loopKeyboardInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
		this.parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map);
	}	

	loopInput() {
		this.loopKeyboardInput(this.key_down_map, this.key_up_map, this.key_pressing_map, this.key_depressing_map);
	}

	ensurePresence(key) {
		if (!this.things[key]) {
			this.things[key] = [];
		}
	}

	removeUnmatching(key, serverObjects) {
		var localObjects = this.things[key];
		var removals = [];
		for (var i = 0; i < localObjects.length; i++) {
			let lo = localObjects[i];
			var matched = false;
			for (var j = 0; j < serverObjects.length; j++) {
				let so = serverObjects[j];
				if (so.id == lo.id) {
					matched = true;
					if (key != 'score') { //extract
						this.smooth(lo, so);	
					} else {
						lo.x = so.x;
						lo.y = so.y;
					}
					
				}
			}
			if (matched == false) {
				removals.push(lo);
			}
		}

		for (var r = 0; r < removals.length; r++) {
			let removal = removals[r];
			let index = localObjects.indexOf(removal);
			this.things[key].splice(index, 1);
		}
	}

	addUnexisting(key, serverObjects) {
		var localObjects = this.things[key];
		var unexisting = [];
		for (var i = 0; i < serverObjects.length; i++) {
			var so = serverObjects[i];
			var matched = false;
			for (var j = 0; j < localObjects.length; j++) {
				var lo = localObjects[j];
				if (lo.id == so.id) {
					matched = true;
				}
			}
		
			if (matched == false) {
				unexisting.push(so);
			}
		}

		for (var u = 0; u < unexisting.length; u++) {
			this.things[key].push(unexisting[u]);
		}
	}

	loopObjects(key) {
		// this.setBackground();
		var os = this.things[key];
		for (var i = 0; i < os.length; i++) {
			var t = os[i];
			this.render(key, t);
		}
	}

	smoothObjects(key, serverObjects) {

	}

	processObjects(d) {
		this.setBackground();
		let keys = Object.keys(d);

		// console.log(d);
		// console.log(keys);
		for (var key of keys) {
			let serverObjects = d[key];
			// console.log(serverObjects);
			this.ensurePresence(key);
			this.removeUnmatching(key, serverObjects);
			this.addUnexisting(key, serverObjects);
			// this.smoothObjects(key, serverObjects);
			this.loopObjects(key);
		}

		this.render('border', true);
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

	handleConstants(d) {
		Constants = d;
	}

	handleServerUpdate(d) {
		this.processObjects(d["objects"]);
		//events
		// console.log("finishing handle server update");
	}

	
};