import { getFileUrl } from './util';

export default class File {
  init() {
    this.input = document.createElement('input');
    this.input.type = 'file';
  }

  chooseFile() {
    this.input.click();
  }

  /*
   * @return <img src='' />
   */
  getFile() {
    return new Promise((resolve) => {
      this.input.addEventListener('change', () => {
        const img = new Image();
        const url = getFileUrl(this.input.files[0]);
        img.onload = () => {
          resolve(img);
        };
        img.src = url;
      });
    });
  }
}
