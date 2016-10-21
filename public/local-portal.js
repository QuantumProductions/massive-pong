"use strict";

class Portal {
	constructor() {
		this.installCanvas();
		this.setup();
		this.connectToServer();
		this.installInput();
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
}


