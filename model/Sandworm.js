import { Harvester, HARVESTER_STATUS } from "./Harvester.js";
import { Thumper, THUMPER_STATUS } from "./Thumper.js";
import { squareOfDistance } from "./Element.js";

// TODO: baby Sandworm
class Sandworm {
  constructor() {
    this.x = 400;
    this.y = 400;
    this.width = 100;
    this.height = 50;
    this.radius = 20;
    this.body = [
      { x: this.x, y: this.y },
      { x: this.x + this.radius, y: this.y },
      { x: this.x + this.radius * 2, y: this.y },
      { x: this.x + this.radius * 3, y: this.y },
      { x: this.x + this.radius * 4, y: this.y },
      { x: this.x + this.radius * 4, y: this.y },
      { x: this.x + this.radius * 4, y: this.y },
    ];
    this.target = null;
  }

  retarget(items) {
    const item = items[Math.floor(Math.random() * items.length)];
    this.target = item;
  }

  // TODO: zig-zag move with a few random walks (make worm dummer)
  move() {
    const target = this.target;
    if (!target) return;
    // head
    const head = this.body[0];
    let newHead = { ...head };
    // follow destination
    const velocity = 5;
    if (Math.abs(target.x - head.x) > 10) {
      newHead.x =
        head.x + ((target.x - head.x) / Math.abs(target.x - head.x)) * velocity;
    } else if (Math.abs(target.y - head.y) > 10) {
      newHead.y =
        head.y + ((target.y - head.y) / Math.abs(target.y - head.y)) * velocity;
    }

    // recycle body parts
    this.body.unshift(newHead);
    this.body.pop();

    this.checkCollision();
  }

  checkCollision() {
    const target = this.target;
    if (squareOfDistance(this.body[0], target) < 1000) {
      if (target instanceof Harvester) {
        target.status = HARVESTER_STATUS.COLLAPSING;
      } else if (target instanceof Thumper) {
        target.status = THUMPER_STATUS.DESTROYED;
      }

      this.radius *= 1.05;
      this.target = null;
    }
  }

  draw(ctx) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#e8d500";
    this.body.forEach((part) => {
      ctx.arc(part.x, part.y, this.radius, 0, 2 * Math.PI);
    });
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export { Sandworm };
