import { app, BrowserWindow, ipcMain } from 'electron';
import { ActionWindow, BorderWindow, DrawWindow } from './windows';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const windows = new Map();

const createBorderWindow = () => {
  // Check if the borderWindow is already open do not create a new one
  if (windows.has('borderWindow')) {
    return;
  }
  const borderWindow = new BorderWindow();
  windows.set('borderWindow', borderWindow);
};

const createActionWindow = () => {
  // Check if the borderWindow is already open do not create a new one
  if (windows.has('actionWindow')) {
    return;
  }
  const actionWindow = new ActionWindow();
  actionWindow.setParentWindow(windows.get('borderWindow'));
  windows.set('actionWindow', actionWindow);
};

const createDrawWindow = () => {
  // Check if the borderWindow is already open do not create a new one
  if (windows.has('drawWindow')) {
    return;
  }
  const drawWindow = new DrawWindow();
  windows.set('drawWindow', drawWindow);
};

const toggleDrawWindow = () => {
  // Toggle drawWindow
  if (windows.has('drawWindow')) {
    const drawWindow = windows.get('drawWindow');
    if (drawWindow.isVisible()) {
      drawWindow.hide();
      //Send message to drawWindow to clear canvas
      drawWindow.webContents.send('clear-canvas');
    } else {
      drawWindow.show();
    }
  }
};
// Check if the borderWindow is already open do not create a new one

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createBorderWindow();
  createActionWindow();
  createDrawWindow();

  //Handle ipcMain events
  ipcMain.on('toggle-draw', () => {
    toggleDrawWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createBorderWindow();
    createActionWindow();
    createDrawWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
