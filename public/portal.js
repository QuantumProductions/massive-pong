"use strict";

class Portal {
	constructor() {
		this.installCanvas();
		this.setup();
		this.connectToServer();
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

	setup() {
		this.ships = [];
	}

	connectToServer() {
		this.io = io();
		this.io.portal = this;
		this.io.on('beat', function(d) {
			this.portal.handleServerUpdate(d);
		});
	}

	handleServerUpdate(d) {
		this.ships = d["ships"];
		
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
		//render
	}
}