const { contextBridge, ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  window.addEventListener(
    'error',
    (e) => {
      if (e.target && e.target.tagName === 'IFRAME') {
        console.log('Iframe error suppressed:', e);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
});

contextBridge.exposeInMainWorld('baseAPI', {
  closeWindow: (action) => {
    try {
      ipcRenderer.send('window-close', action);
      console.log('send success');
    } catch (e) {
      console.error('closeWindow IPC 오류:', e);
    }
  },
  getVideoPath: (fileName) => {
    return ipcRenderer.invoke('get-video-path', fileName);
  },
  checkFileExists: (filePath) => {
    return ipcRenderer.invoke('check-file-exists', filePath);
  }

});
