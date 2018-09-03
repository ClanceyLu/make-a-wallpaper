export const $ = selector => document.querySelector(selector);

// 获取文件URL
export const getFileUrl = (file) => {
  let url = '';
  if (window.createObjectURL) {
    url = window.createObjectURL(file);
  } else if (window.URL) {
    url = window.URL.createObjectURL(file);
  }
  return url;
};
