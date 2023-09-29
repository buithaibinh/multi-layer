// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  toggleDraw: () => ipcRenderer.send('toggle-draw'),
  onClearCanvas: (callback: () => void) =>
    ipcRenderer.on('clear-canvas', callback),
});
