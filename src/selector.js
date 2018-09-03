export default class Selector {
  constructor(x, y, width, height, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.active = false;
    this.reSize = false;
    this.initEvent();
  }

  initEvent() {
    this.startDragging = this.startDragging.bind(this);
    this.dragging = this.dragging.bind(this);
    this.stopDragging = this.stopDragging.bind(this);
    this.canvas.onmousedown = this.startDragging;
    this.canvas.onmouseup = this.stopDragging;
    this.canvas.onmouseout = this.stopDragging;
    this.canvas.onmousemove = this.dragging;
  }

  draw() {
    this.ctx.save();
    this.ctx.setLineDash([4, 2]);
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.ctx.beginPath();
    this.ctx.arc(this.x + this.width, this.y + this.height, 10, 0, Math.PI * 2);
    console.log('arc')
    this.ctx.fillStyle = 'red';
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  startDragging(e) {
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    const rightBottom = {
      x: this.x + this.width,
      y: this.y + this.height,
    };
    const r = Math.hypot(clickX - rightBottom.x, clickY - rightBottom.y);
    if (r < 10) {
      this.reSize = true;
    } else if (
      clickX > this.x
      && clickX < rightBottom.x
      && clickY > this.y
      && clickY < rightBottom.y
    ) {
      this.active = true;
      // 光标位置与选择框左上角点偏移量
      this.offsetX = clickX - this.x;
      this.offsetY = clickY - this.y;
    } else {
      this.active = false;
      this.reSize = false;
    }
  }

  stopDragging() {
    this.active = false;
    this.reSize = false;
  }

  dragging(e) {
    if (!this.active && !this.reSize) return;
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    if (this.active) {
      this.x = clickX - this.offsetX;
      this.y = clickY - this.offsetY;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // this.drawImage(this.image);
      this.draw();
    } else if (this.reSize) {
      this.width = clickX - this.x;
      this.height = clickY - this.y;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
    }
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
