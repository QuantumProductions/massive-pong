"use strict";

class LocalPortal extends Portal {
	context() {
		return this.canvas.getContext('2d');
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

	render(key, t) {
		let ctx = this.context();
		if (key == 'balls') {
			ctx.beginPath();
			ctx.arc(t.x, t.y, 7, 0, 2 * Math.PI, false);
			ctx.fillStyle = t.teamColor;
			ctx.fill();
		} else if (key == 'ships') {
			ctx.beginPath();
			ctx.fillStyle = t.teamColor;;
			ctx.fillRect(t.x,t.y,10,30); //CONSTANTS
		}
		
	}

}