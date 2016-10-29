'use strict';

class Render {
	static renderFunctions() {
		return {'ship' : Render.drawShip,
	   'ball' : Render.drawBall};
	}

	static render(key, ls, context, portal) {
		console.log("my render" + key +"ing" + ls);
		// let renderFns = this.renderFunctions();
		// console.log(renderFns);
		context.beginPath();
		if (key == 'balls') {
			// console.log(ls.teamColor);
			// this.drawBall(context, portal, ls);
			context.arc(ls.x, ls.y, 7, 0, 2 * Math.PI, false);
			context.fillStyle = ls.teamColor;
			context.fill();
		} else if (key == 'ships') {
			Render.drawShip(context, portal, ls);
		}
		// let fn = renderFns[key];
		// console.log(fn);
		
		// fn(context, portal, ls);
	}

	static drawShip(ctx, p, t) {
		Render.drawRect(ctx, t.x - 5, t.y - 100, 10, 100, t.teamColor);
	}

	static drawBall(ctx, p, t) {
		ctx.beginPath();
		ctx.arc(t.x, t.y, 7, 0, 2 * Math.PI, false);
		ctx.fillStyle = t.teamColor;
		ctx.fill();
	}

	static drawRect(ctx, x,y,w,h, colour) {
		ctx.fillStyle = colour;
		ctx.fillRect(x,y,w,h);
	}
}