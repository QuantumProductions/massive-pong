"use strict";

class Utils {
	static shipPlacement(ships, fw, fh, max, offset) {
		let spacing = fw / max;
		var x = offset > 0 ? offset : 0;
		let xOffset = 0.5 * spacing;
		for (var s of ships) {
			if (s.x == x + xOffset) {
				return Utils.shipPlacement(ships, fw, fh, max, x + spacing);
			}
		}
		return x + xOffset;
	}
}

module.exports = {
	"Utils" : Utils
};