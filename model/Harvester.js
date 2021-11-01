export const HARVESTER_STATUS = {
  MINING: 0,
  MOVING: 1,
  STANDING: 2,
  COLLAPSING: 3,
  DESTROYED: 4,
};

class Harvester {
  constructor(x = 200, y = 200) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 50;
    this.central = {
      x: () => this.x + this.width / 2,
      y: () => this.y + this.height / 2,
    };
    this.hoseLength = 20;
    this.hose = 0;
    this.angle = 0;
    this.status = HARVESTER_STATUS.MINING;
  }

  getMinedSpice() {
    if (this.status === HARVESTER_STATUS.MINING) {
      return 1;
    }
    return 0;
  }

  move() {
    switch (this.status) {
      case HARVESTER_STATUS.MINING:
        this.moveHose();
        break;
      case HARVESTER_STATUS.COLLAPSING:
        this.rotate();
        break;
      default:
        break;
    }
  }

  rotate(angle = 1) {
    if (this.angle <= 45) {
      this.angle += angle;
    } else {
      this.angle = 0;
      this.status = HARVESTER_STATUS.DESTROYED;
    }
  }

  moveHose() {
    if (this.status === HARVESTER_STATUS.MINING) {
      this.hose = (this.hose + 0.2) % this.hoseLength;
    }
  }

  draw(ctx, index = 1) {
    // TODO: sand splash

    // rotation
    ctx.translate(this.central.x(), this.central.y());
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.translate(-this.central.x(), -this.central.y());

    // text
    ctx.font = '30px Arial';
    ctx.strokeText(`${index}`, this.x + this.width, this.central.y());

    ctx.fillStyle = 'brown';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // head
    ctx.fillRect(this.x - this.width / 3, this.y + this.height / 2, this.width / 3, this.height / 3);
    // leg
    ctx.fillRect(this.x, this.y + this.height, this.width / 4, this.hoseLength);
    ctx.fillRect(this.x + this.width / 4 * 3, this.y + this.height, this.width / 4, this.hoseLength);
    // hose
    ctx.fillRect(this.x + this.width / 2.5, this.y + this.height, this.width / 4, this.hose);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export { Harvester };
