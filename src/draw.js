import StackBlur from 'stackblur-canvas';
import getLayerData from './layerData';
import { $ } from './util';

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
    this.layerData = getLayerData();
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
  }

  // draw layer
  draw() {
    this.drawBackground();
    this.drawSelector();
  }

  drawBackground() {
    const image = this.layerData.getBackground();
    const { width, height } = image;
    // const s = image.width / image.height;
    // const width = document.body.clientHeight - 40;
    // const height = width * s;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(image, 0, 0, width, height);
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
    // this.ctx.clearRect(0, 0, this.width, this.height);
    getImage(imageData, width, height)
      .then((forntImage) => {
        this.ctx.save();
        this.setBlur(60);
        this.ctx.shadowOffsetX = 4;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowColor = '#ccc';
        this.ctx.shadowBlur = 40;
        this.ctx.drawImage(forntImage, x, y);
        this.ctx.restore();
        const url = this.canvas.toDataURL('image/png');
        this.setDownload(url);
      });
  }

  setDownload(url) {
    $('.download').href = url;
  }

  // 选择框
  drawSelector() {
    const selector = this.layerData.getSelector();
    this.ctx.save();
    this.ctx.setLineDash([4, 2]);
    this.ctx.strokeRect(selector.x, selector.y, selector.width, selector.height);
    this.ctx.beginPath();
    this.ctx.arc(selector.x + selector.width, selector.y + selector.height, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
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
