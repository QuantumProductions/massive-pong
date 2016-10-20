"use strict";

class Portal {
	constructor() {
		this.setup();
		this.connectToServer();
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
		
		for (var i = 0; i < this.ships.length; i++) {
			var s = this.ships[i];
			console.log(s.x);
		}
	}

	loop() {
		//render
	}
}