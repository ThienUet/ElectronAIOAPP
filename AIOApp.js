const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const electronReload = require('electron-reload');
const {exec} = require('child_process');
const unhandled = require('electron-unhandled');

let icon;
let dirImage;
let dirApp;
if (process.env.NODE_ENV === 'development') {
  // TAKE THE IMAGE FOLDER
  dirImage = path.join(app.getAppPath(), 'public', 'images', 'application-image');
  // TAKE THE BROWSER SOFTWARE FOLDER
  dirApp = path.join(app.getAppPath(), 'app_run');
} else {
  // TAKE THE IMAGE FOLDER
  dirImage = path.join(path.dirname(app.getAppPath()), 'public', 'images', 'application-image');
  // TAKE THE BROWSER SOFTWARE FOLDER
  dirApp = path.join(path.dirname(app.getAppPath()), 'app_run');
}


let mainWindow;

const homeWindowShow = async () => {
  Menu.setApplicationMenu(false);
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 700,
    menu: null,
    resizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    frame: false,
    icon: '/public/icon/ViThienOEM.ico',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload-js", "preload.js")
    }
  });
  mainWindow.loadFile('./view/home.html');
  mainWindow.webContents.openDevTools();
  // HANDLE WHEN LOAD APP
  ipcMain.handle('load-app-for-home', async (event, specifiedDir) => {
    const listAppRender = new Set();
    let listAppImage, listAppFile, folders;
  
    try {
      if (specifiedDir) {
        listAppImage = await fs.promises.readdir(dirImage);
        listAppFile = await fs.promises.readdir(path.join(dirApp, specifiedDir));
      } else {
        folders = await fs.promises.readdir(dirApp);
        listAppImage = await fs.promises.readdir(dirImage);
      }
    } catch (e) {
      const _mess = `Error occur !\n===> ${e} \nPlease fix the error !`;
      dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'OK',
        message: _mess,
        buttons: ['OK']
      });
    }
  
    if (specifiedDir && listAppImage && listAppFile) {
      listAppImage.forEach((image) => {
        const fileName = image.split('.')[0];
        if (listAppFile.includes(`${fileName}.exe`)) {
          const temp = {
            name: fileName,
            image: path.join(dirImage, image),
            urlApp: path.join(dirApp, specifiedDir, `${fileName}.exe`)
          };
          listAppRender.add(temp);
        }
      });
    } else if (folders && listAppImage) {
      for (const item of folders) {
        const fileExe = await fs.promises.readdir(path.join(dirApp, item));
        if (fileExe.length > 0) {
          for (const _item of listAppImage) {
            const fileName = _item.split(".")[0];
            if (fileExe.includes(`${fileName}.exe`)) {
              const temp = {
                name: fileName,
                image: path.join(dirImage, _item),
                urlApp: path.join(dirApp, item, `${fileName}.exe`)
              }
              listAppRender.add(temp);
            }
          }
        }
      }
    }
    return Array.from(listAppRender);
  });

  ipcMain.handle('get-app-path', async (event) => {
    return await process.env.NODE_ENV;
  })

}

app.whenReady().then(async () => {
  homeWindowShow();
  console.log(process.env.NODE_ENV);
    ipcMain.on('execute-app', async (event, data) => {
      const pathToApp = path.join(data?.urlApp);
      // GRAND FULL PRIVILEGE
      fs.chmod(pathToApp, '777', (err) => {
          if (err) {
            console.error('Error occurred while granting full access:', err);
          } else {
            console.log('Full access granted.');
          }
        });
  
      const child = exec(`start "" "${pathToApp}"`, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
        }
        if (stderr) {
          console.error("LOI GI DAY " + stderr);
        }
        if (stdout) {
          console.log(stdout);
        }
      });

    
    });



    ipcMain.on('click-to-close-app', (event) => {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
      });
      if (choice === 0) {
        app.quit();
      } else {
        event.preventDefault();
      }
    })



    app.on('active', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})


/**
 * Work for all operating system. Make sure that app will exit entirely.
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
unhandled();
electronReload(__dirname);