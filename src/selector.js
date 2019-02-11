import getLayerData from './layerData';

const layerData = getLayerData();

const setSelectorPosition = (x, y) => {
  const selector = layerData.getSelector();
  const s = {
    ...selector,
    x,
    y,
  };
  layerData.setSelector(s);
};

const setSelectorSize = (width, height) => {
  const selector = layerData.getSelector();
  const s = {
    ...selector,
    width,
    height,
  };
  layerData.setSelector(s);
};

const setSelectorResize = (reSize) => {
  const selector = layerData.getSelector();
  const s = {
    ...selector,
    reSize,
  };
  layerData.setSelector(s);
};

const setSelectorActive = (active) => {
  const selector = layerData.getSelector();
  const s = {
    ...selector,
    active,
  };
  layerData.setSelector(s);
};

export default class Selector {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onDragging = f => f;
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

  startDragging(e) {
    const {
      width,
      height,
      x,
      y,
    } = layerData.getSelector();
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    const rightBottom = {
      x: x + width,
      y: y + height,
    };
    const r = Math.hypot(clickX - rightBottom.x, clickY - rightBottom.y);
    if (r < 10) {
      setSelectorResize(true);
    } else if (
      clickX > x
      && clickX < rightBottom.x
      && clickY > y
      && clickY < rightBottom.y
    ) {
      this.active = true;
      setSelectorActive(true);
      // 光标位置与选择框左上角点偏移量
      this.offsetX = clickX - x;
      this.offsetY = clickY - y;
    } else {
      setSelectorActive(false);
      setSelectorResize(false);
    }
  }

  stopDragging() {
    setSelectorActive(false);
    setSelectorResize(false);
  }

  dragging(e) {
    const {
      active,
      reSize,
      x,
      y,
    } = layerData.getSelector();
    if (!active && !reSize) return;
    const clickX = e.pageX - this.canvas.offsetLeft;
    const clickY = e.pageY - this.canvas.offsetTop;
    if (active) {
      const nX = clickX - this.offsetX;
      const nY = clickY - this.offsetY;
      setSelectorPosition(nX, nY);
    } else if (reSize) {
      const width = clickX - x;
      const height = clickY - y;
      setSelectorSize(width, height);
    }
    this.onDragging();
  }
}
