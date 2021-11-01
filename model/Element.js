export const squareOfDistance = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export class RandomCoordinate {
  constructor() {
    [this.x, this.y] = [Math.random() * 500, Math.random() * 500];
  }
}

export const moveToCoordinate = (elements, destination, velocity = 1) => {
  const stdElement = elements[0];
  if (Math.abs(destination.x - stdElement.x) > 0) {
    const moveX = ((destination.x - stdElement.x) / Math.abs(destination.x - stdElement.x))
            * velocity;
    elements.forEach((element) => {
      element.x += moveX;
    });
  }
  if (Math.abs(destination.y - stdElement.y) > 0) {
    const moveY = ((destination.y - stdElement.y) / Math.abs(destination.y - stdElement.y))
            * velocity;
    elements.forEach((element) => {
      element.y += moveY;
    });
  }
};
