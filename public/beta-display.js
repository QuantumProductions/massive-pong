class BetaDisplay {
	constructor() {
		this.io = io();
		this.io.display = this;
		this.io.on('beat', function(d) {
			this.display.handleServerUpdate(d);
		});

		this.ships = [];
	}

	handleServerUpdate(d) {
		
	}
}