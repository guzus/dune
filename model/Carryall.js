import { HARVESTER_STATUS } from './Harvester.js';
import { squareOfDistance, RandomCoordinate, moveToCoordinate } from './Element.js';

const LIFTING_HEIGHT = 100;

export const CARRYALL_STATUS = {
  LANDED: 0,
  MOVING: 1,
  MOVING_BOOST: 2,
  LIFTING_UP: 3,
  MOVING_WITH_TARGET: 4,
  LIFTING_DOWN: 5,
  MOVING_BACK: 6,
};

// TODO: Oil fee
class Carryall {
  constructor() {
    this.x = 500;
    this.y = 470;
    this.width = 150;
    this.height = 30;
    this.hoseLength = 10;
    this.hose = 0;
    this.liftedAmount = 0;
    this.status = CARRYALL_STATUS.LANDED;
    this.target = null;
    this.landingSite = {
      x: 500,
      y: 500,
    };
  }

  move() {
    switch (this.status) {
      case CARRYALL_STATUS.LANDED:
        this.hose = 0;
        break;
      case CARRYALL_STATUS.MOVING:
        this.moveToLocation();
        break;
      case CARRYALL_STATUS.LIFTING_UP:
        this.liftUp();
        break;
      case CARRYALL_STATUS.MOVING_WITH_TARGET:
        this.movingWithTarget();
        break;
      case CARRYALL_STATUS.LIFTING_DOWN:
        this.liftDown();
        break;
      case CARRYALL_STATUS.MOVING_BACK:
        this.moveToLocation();
        break;
      default:
        break;
    }
  }

  moveAttachment() {
    this.hose = (this.hose + 0.5) % this.hoseLength;
  }

  moveToLocation() {
    const { target } = this;
    const destination = {
      x: target.x,
      y: target.y - this.height,
    };
    const velocity = 1;

    // follow destination
    // moveToCoordinate([this], destination, velocity);

    if (destination.x - this.x) {
      this.x
        += ((destination.x - this.x) / Math.abs(destination.x - this.x))
        * velocity;
    }
    if (destination.y - this.y) {
      this.y
        += ((destination.y - this.y) / Math.abs(destination.y - this.y))
        * velocity;
    }

    if (squareOfDistance(this, destination) < 1000) {
      this.moveAttachment();
    }
    if (squareOfDistance(this, destination) < 100) {
      if (this.status === CARRYALL_STATUS.MOVING) {
        this.status = CARRYALL_STATUS.LIFTING_UP;
      } else {
        this.status = CARRYALL_STATUS.LANDED;
      }
    }
  }

  liftUp() {
    const { target } = this;
    this.hose = 0;
    target.status = HARVESTER_STATUS.MOVING;
    if (this.liftedAmount < LIFTING_HEIGHT) {
      target.y -= 1;
      this.y -= 1;
      this.liftedAmount += 1;
    } else {
      this.liftedAmount = 0;
      this.status = CARRYALL_STATUS.MOVING_WITH_TARGET;
      this.destination = new RandomCoordinate();
    }
  }

  movingWithTarget() {
    const { target, destination } = this;
    if (squareOfDistance(this, destination) <= 300) {
      this.status = CARRYALL_STATUS.LIFTING_DOWN;
    } else {
      moveToCoordinate([this, target], destination, 1);
    }
  }

  liftDown() {
    const { target } = this;
    this.hose = 0;
    if (this.liftedAmount < LIFTING_HEIGHT) {
      target.y += 1;
      this.y += 1;
      this.liftedAmount += 1;
    } else {
      target.status = HARVESTER_STATUS.MINING;
      this.liftedAmount = 0;
      this.target = this.landingSite;
      this.status = CARRYALL_STATUS.MOVING_BACK;
    }
  }

  draw(ctx) {
    if (
      this.status in [CARRYALL_STATUS.LIFTING_DOWN, CARRYALL_STATUS.LIFTING_UP]
    ) {
      ctx.fillStyle = 'black';
    } else {
      ctx.fillStyle = 'gray';
    }

    // body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // wing
    ctx.fillRect(
      this.x + this.width / 2,
      this.y - this.height * 0.75,
      this.width / 4,
      this.height * 2.5,
    );
    // attachment
    ctx.fillRect(this.x, this.y + this.height, this.width / 3, this.hose);
    ctx.fillRect(
      this.x + (this.width / 3) * 2,
      this.y + this.height,
      this.width / 3,
      this.hose,
    );

    this.drawLandingSite(ctx);
  }

  drawLandingSite(ctx) {
    const { landingSite } = this;
    ctx.fillStyle = 'gray';
    ctx.fillRect(landingSite.x, landingSite.y, 200, 10);
  }
}

export { Carryall };
