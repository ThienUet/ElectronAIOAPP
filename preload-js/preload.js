const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('actions', {
  loadDataWithDir: async (specifiedDir) => {
    let data;
    await ipcRenderer.invoke('load-app-for-home', specifiedDir).then((res) => {
        data = res;
    }).catch((e) => {
        console.log(`Error occur ! The error was found in try-catch function readFolderBrowser() of AIOApp.js file !\n==> Error message: ${e} \nPlease fix the error !`);
        data = e.message;
    });
    return data;
  },
  loadAllData: async () => {
    let data;

  },
  displayError: (data) => {
    ipcRenderer.send('display-error', data);
  },
  closeApp: () => {
    ipcRenderer.send('click-to-close-app');
  },
  execute: (data) => {
    ipcRenderer.send('execute-app', data);
  },
  getAPP: async () => {
    return await ipcRenderer.invoke('get-app-path');
  }
  // we can also expose variables, not just functions
})