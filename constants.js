"use strict";

class Constants {
	static constants() {
		return {"ball_r" : Math.floor(Math.random() * 7) + 3, "paddle_r" : Math.floor(Math.random() * 30) + 30, 'maxShips' : 6, "paddle_w" : Math.floor(Math.random() * 10) + 5,
		"fh" : 500, "fw" : 500};
	}
}

module.exports = Constants.constants();
