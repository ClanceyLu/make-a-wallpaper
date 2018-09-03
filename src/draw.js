import StackBlur from 'stackblur-canvas';

import Selector from './selector';

/*
 * 把imageData生成一张图片返回
 * @return Image
 */
const getImage = (imageData, width, height) => (new Promise((resolve) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  img.onload = () => {
    resolve(img);
  };
}));

class Draw {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 1280;
    this.height = 720;
    this.startDragging = this.startDragging.bind(this);
    this.dragging = this.dragging.bind(this);
    this.stopDragging = this.stopDragging.bind(this);
    this.selector = new Selector(100, 100, 400, 200);
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.onmousedown = this.startDragging;
    this.canvas.onmouseup = this.stopDragging;
    this.canvas.onmouseout = this.stopDragging;
    this.canvas.onmousemove = this.dragging;
    this.ctx = this.canvas.getContext('2d');
  }

  drawBackground(image) {
    this.image = image;
    this.drawImage(image);
  }

  drawImage(image) {
    this.ctx.drawImage(image, 0, 0, this.width, this.height);
  }

  // 设置背景高斯模糊
  setBlur(radius) {
    StackBlur.canvasRGB(this.canvas, 0, 0, this.width, this.height, radius);
  }

  selectFrontArea() {
    const {
      x,
      y,
      width,
      height,
    } = this.selector.getInfo();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawImage(this.image);
    const imageData = this.ctx.getImageData(x, y, width, height);
    getImage(imageData, x, y)
      .then((forntImage) => {
        this.setBlur(60);
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowColor = '#ccc';
        this.ctx.shadowBlur = 40;
        this.ctx.drawImage(forntImage, x, y);
        this.ctx.stroke();
      });
  }

  // 选择框
  drawSelector() {
    this.selector.draw(this.ctx);
  }

  startDragging(e) {
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    const {
      x,
      y,
      width,
      height,
    } = this.selector.getInfo();
    // 点位于选择框内
    if (
      clickX > x
      && clickX < x + width
      && clickY > y
      && clickY < y + height
    ) {
      this.selector.setActive(true);
      // 光标位置与选择框左上角点偏移量
      this.offsetX = clickX - x;
      this.offsetY = clickY - y;
    } else if (clickX === (x + width) && clickY === (y + height)) {
      console.log('m');
    } else {
      this.selector.setActive(false);
    }
  }

  stopDragging() {
    this.selector.setActive(false);
  }

  dragging(e) {
    if (!this.selector.getActive()) return;
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    this.selector.setPosition(clickX - this.offsetX, clickY - this.offsetY);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawImage(this.image);
    this.selector.draw(this.ctx);
  }
}

// 返回一个单例
const getDraw = (() => {
  let draw = null;
  return (canvas) => {
    if (!draw) {
      draw = new Draw(canvas);
    }
    return draw;
  };
})();

export default getDraw;
