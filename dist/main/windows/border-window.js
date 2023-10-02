"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// Define class BorderWindow extends from BrowserWindow
class BorderWindow extends electron_1.BrowserWindow {
    constructor() {
        // Get the width and height of the primary display
        const { width, height } = electron_1.screen.getPrimaryDisplay().bounds;
        super({
            width,
            height,
            x: 0,
            y: 0,
            hasShadow: false,
            //Make the window larger than the screen (outside the dock bar)
            enableLargerThanScreen: true,
            resizable: false,
            movable: false,
            //In Windows, the taskbar will not show the icon of the window
            skipTaskbar: true,
            //Make frameless window (without title bar and border)
            frame: false,
            //Make the window transparent
            transparent: true,
            webPreferences: {
                preload: path_1.default.join(__dirname, 'preload.js'),
            },
        });
        // and load the index.html of the app.
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            this.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/borderWindow.html`);
        }
        else {
            this.loadFile(path_1.default.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/borderWindow.html`));
        }
        //Set on top with level screen-saver(101)
        this.setAlwaysOnTop(true, 'screen-saver');
        //Set ignore mouse event
        this.setIgnoreMouseEvents(true);
        //If device not MacOs, set fullscreen to hide the taskbar
        if (process.platform !== 'darwin') {
            this.setFullScreen(true);
        }
        // Open the DevTools.
        // this.webContents.openDevTools({ mode: 'detach' });
    }
}
exports.default = BorderWindow;
//# sourceMappingURL=border-window.js.map