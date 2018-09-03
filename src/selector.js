export default class Selector {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = false;
  }

  draw(ctx) {
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  setActive(status) {
    this.active = status;
  }

  getActive() {
    return this.active;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  getInfo() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
