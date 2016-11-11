'use strict';

class Render {
  static renderFunctions() {
      return {'ships' : Render.drawShip,
     'balls' : Render.drawBall,
      'border' : Render.drawBorder};
  }

  static render(key, ls, context, portal) {
    context.beginPath();
  	Render.renderFunctions()[key](context, portal, ls);
  }

  static drawShip(ctx, p, t) {
    Render.drawRect(ctx, t.x - (Constants.paddle_w / 2), t.y - (Constants.paddle_r / 2), Constants.paddle_w, Constants.paddle_r * 2, t.teamColor);
  }

  static drawBall(ctx, p, t) {
    ctx.arc(t.x, t.y, Constants.ball_r, 0, 2 * Math.PI, false);
    ctx.fillStyle = t.teamColor;
    ctx.fill();
  }

  static drawBorder(ctx, p, t) {
    ctx.moveTo(0,0);
    ctx.lineTo(Constants.fw, 0);
    ctx.lineTo(Constants.fw, Constants.fh);
    ctx.lineTo(0, Constants.fh);
    ctx.lineTo(0,0);
    ctx.moveTo(Constants.fw / 2, 0);
    ctx.lineTo(Constants.fw / 2, Constants.fh);
    ctx.strokeStyle = 'white';
    console.log(Constants.fw);
    ctx.stroke();
  }

	static drawRect(ctx, x,y,w,h, colour) {
		ctx.fillStyle = colour;
		ctx.fillRect(x,y,w,h);
	}
}