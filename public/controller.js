'use strict';

class Controller extends Portal {
	setup() {

	}

	connectToServer() {
		this.io = io();
		this.io.portal = this;
		console.log("test");
		this.io.emit('join', {});
	}

	installCanvas() {
	}

	installInput() {
		var b1 = document.getElementById('button1');
		b1.addEventListener("mousedown", this.b1down);
		b1.addEventListener("mouseup", this.b1up);
		b1.addEventListener("touchstart", this.b1down);
		b1.addEventListener("touchend", this.b1up);
		b1.controller = this;
		var b2 = document.getElementById('button2');
		b2.addEventListener("mousedown", this.b2down);
		b2.addEventListener("mouseup", this.b2up);
		b2.addEventListener("touchstart", this.b2down);
		b2.addEventListener("touchend", this.b2up);
		b2.controller = this;
	}

	b1down(event) {
		var target = event.srcElement || event.currentTarget || event.target;
    target.controller.b1Press();
	}

	b2down(event) {
		var target = event.srcElement || event.currentTarget || event.target;
    target.controller.b2Press();
	}

	b1up(event) {
		var target = event.srcElement || event.currentTarget || event.target;
    target.controller.b1Release();
	}

	b2up(event) {
		var target = event.srcElement || event.currentTarget || event.target;
    target.controller.b2Release();
	}
	
	
	b1Press() {
		this.moveInput = -1;
	}

	b2Press() {
		this.moveInput = 1;
	}

	b1Release() {
		this.moveInput = 0;
	}

	b2Release() {
		this.moveInput = 0;
	}

	parseInput(key_pressed_map, key_up_map, key_pressing_map, key_depressing_map) {
		if (this.moveInput == 1) {
			this.io.emit('input', 'down');
		} else if (this.moveInput == -1) {
			this.io.emit('input', 'up');	
		}
		
		
	}
}