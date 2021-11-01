export const THUMPER_STATUS = {
  THUMPING: 0,
  DESTROYED: 1,
};
class Thumper {
  constructor(x = 300, y = 500) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 80;
    // pendulum
    this.vibeTime = 0;
    this.vibeHeight = 0;
    this.maxVibeHeight = 10;
    this.period = 120;
  }

  move() {
    this.vibeHeight = this.maxVibeHeight * Math.sin((this.vibeTime * Math.PI) / this.period);
    this.vibeTime += 1;
  }

  draw(ctx) {
    ctx.shadowColor = 'gray';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'gray';
    ctx.fillRect(this.x, this.y + this.vibeHeight, this.width, this.height);

    ctx.shadowBlur = 0;
  }
}

export { Thumper };
