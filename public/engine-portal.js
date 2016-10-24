"use strict";

class Portal {
	constructor() {
		this.installCanvas();
		this.setup();
		this.connectToServer();
		this.installInput();
		this.installLoops();
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
};