"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const promises_1 = require("fs/promises");
const windows_1 = require("./windows");
// Command line
// https://github.com/electron/electron/issues/19880#issuecomment-618222048
electron_1.app.commandLine.appendSwitch('disable-features', 'IOSurfaceCapturer');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    electron_1.app.quit();
}
const windows = new Map();
const createBorderWindow = () => {
    // Check if the borderWindow is already open do not create a new one
    if (windows.has('borderWindow')) {
        return;
    }
    const borderWindow = new windows_1.BorderWindow();
    windows.set('borderWindow', borderWindow);
};
const createActionWindow = () => {
    // Check if the borderWindow is already open do not create a new one
    if (windows.has('actionWindow')) {
        return;
    }
    const actionWindow = new windows_1.ActionWindow();
    actionWindow.setParentWindow(windows.get('borderWindow'));
    windows.set('actionWindow', actionWindow);
};
const createDrawWindow = () => {
    // Check if the borderWindow is already open do not create a new one
    if (windows.has('drawWindow')) {
        return;
    }
    const drawWindow = new windows_1.DrawWindow();
    windows.set('drawWindow', drawWindow);
};
const createMainWindow = () => {
    if (windows.has('sourceWindow')) {
        return;
    }
    const window = new windows_1.SourceWindow();
    window.setParentWindow(windows.get('borderWindow'));
    windows.set('sourceWindow', window);
};
const toggleDrawWindow = () => {
    // Toggle drawWindow
    const borderWindow = windows.get('borderWindow');
    const actionWindow = windows.get('actionWindow');
    const drawWindow = windows.get('drawWindow');
    if (windows.has('drawWindow')) {
        if (drawWindow.isVisible()) {
            borderWindow.setParentWindow(null);
            actionWindow.setParentWindow(null);
            drawWindow.hide();
            actionWindow.setParentWindow(borderWindow);
            //Send message to drawWindow to clear canvas
            drawWindow.webContents.send('clear-canvas');
        }
        else {
            drawWindow.show();
            borderWindow.setParentWindow(drawWindow);
        }
    }
};
const handleSelectSource = async (event, sourceId) => {
    const sourceWindow = windows.get('sourceWindow');
    // close sourceWindow
    sourceWindow.close();
    // send sourceId to actionWindow
    const actionWindow = windows.get('actionWindow');
    actionWindow.webContents.send('sourceId-selected', sourceId);
};
const handleGetSources = async () => {
    try {
        console.log('get-sources from main');
        const sources = await electron_1.desktopCapturer.getSources({
            types: ['screen', 'window'],
        });
        // convert thumbnail to base64
        sources.forEach((source) => {
            const isThumbnailEmpty = source.thumbnail.isEmpty();
            if (isThumbnailEmpty) {
                source.thumbnail = null;
                return;
            }
            source.thumbnail = source.thumbnail?.toDataURL();
        });
        return sources;
    }
    catch (error) {
        console.log('error', error);
        return [];
    }
};
const handleSave = async (event, buffer) => {
    console.log('save-video from main');
    const { canceled, filePath } = await electron_1.dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`,
    });
    if (canceled) {
        console.log('user canceled save video');
        return;
    }
    console.log('save video to', filePath);
    await (0, promises_1.writeFile)(filePath, buffer);
    console.log('video saved successfully!');
    return filePath;
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', () => {
    createBorderWindow();
    createActionWindow();
    createDrawWindow();
    createMainWindow();
    //Handle ipcMain events
    electron_1.ipcMain.handle('get-sources', handleGetSources);
    electron_1.ipcMain.handle('select-source', handleSelectSource);
    electron_1.ipcMain.handle('save-video', handleSave);
    //Handle ipcMain events
    electron_1.ipcMain.on('toggle-draw', () => {
        toggleDrawWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createBorderWindow();
        createActionWindow();
        createDrawWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//# sourceMappingURL=index.js.map