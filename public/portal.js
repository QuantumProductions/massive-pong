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
}