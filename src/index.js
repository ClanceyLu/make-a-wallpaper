import { $ } from './util';
import File from './file';
import Selector from './selector';
import getDraw from './draw';
import getLayerData from './layerData';

require('./assets/styles/styles.less');

const layerData = getLayerData();

window.onload = () => {
  const $canvas = $('#canvas');
  const selector = new Selector($canvas);
  const draw = getDraw($canvas);
  draw.init();
  selector.onDragging = draw.draw.bind(draw);
  const chooseImage = new File();
  chooseImage.init();
  // 选择图片并绘制在canvas中
  $('.chooseImage').addEventListener('click', async () => {
    chooseImage.chooseFile();
    const image = await chooseImage.getFile();
    layerData.setBackground(image);
    draw.draw();
  });

  // 选择框
  $('.selectFrontArea').addEventListener('click', () => {
    layerData.initSelector();
    draw.draw();
  });

  // 设置高斯模糊,生成前景图
  $('.setBlur').addEventListener('click', () => {
    draw.selectFrontArea();
  });
};
