"use strict";

class Constants {
	static constants() {
		return {"ball_reset_speed" : 1, "ball_r" : Math.floor(Math.random() * 7) + 3, "paddle_r" : Math.floor(Math.random() * 30) + 30, 'maxShips' : 6, "paddle_w" : Math.floor(Math.random() * 10) + 5,
		"fh" : 700, "fw" : 1000};
	}
}

module.exports = Constants.constants();
