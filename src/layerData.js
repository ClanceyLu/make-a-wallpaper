class LayerData {
  constructor() {
    this.background = null;
    this.selector = {};
    this.forntImage = {};
    this.blur = {};
  }

  setBackground(background) {
    this.background = background;
  }

  setSelector(selector) {
    this.selector = selector;
  }

  initSelector() {
    this.selector = {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      active: false,
      reSize: false,
    };
  }

  getBackground() {
    return this.background;
  }

  getSelector() {
    return this.selector;
  }
}

const getLayerData = (() => {
  let layerData = null;
  return () => {
    if (!layerData) layerData = new LayerData();
    return layerData;
  };
})();

export default getLayerData;
