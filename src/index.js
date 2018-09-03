import { $ } from './util';
import File from './file';
import getDraw from './draw';

require('./assets/styles/styles.less');

window.onload = () => {
  const $canvas = $('#canvas');
  const draw = getDraw($canvas);
  draw.init();
  const chooseImage = new File();
  chooseImage.init();
  // 选择图片并绘制在canvas中
  $('.chooseImage').addEventListener('click', () => {
    chooseImage.chooseFile();
    chooseImage.getFile()
      .then((image) => {
        draw.setBackground(image);
        draw.drawBackground();
      });
  });

  // 选择框
  $('.selectFrontArea').addEventListener('click', () => {
    draw.drawSelector();
  });

  // 设置高斯模糊,生成前景图
  $('.setBlur').addEventListener('click', () => {
    draw.selectFrontArea();
  });
};
