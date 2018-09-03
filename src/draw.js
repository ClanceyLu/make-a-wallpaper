import StackBlur from 'stackblur-canvas';
import { $ } from './util';

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
    this.selector = new Selector(100, 100, 100, 100, canvas);
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
  }

  setBackground(image) {
    this.image = image;
    const s = image.width / image.height;
    this.canvas.height = document.body.clientHeight - 20;
    this.canvas.width = this.canvas.height * s;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    const img = document.createElement('img');
    img.src = image.src;
    img.width = this.width;
    img.height = this.height;
    // img.style.filter = 'blur(20px)';
    img.classList.add('background');
    const $img = $('.editor img');
    if ($img) {
      $('.editor').removeChild($img);
    }
    $('.editor').append(img);
  }

  drawBackground() {
    this.drawImage(this.image);
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
