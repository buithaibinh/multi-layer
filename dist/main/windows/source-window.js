"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// Define class DrawWindow extends from BrowserWindow
class Window extends electron_1.BrowserWindow {
    constructor() {
        // Get the width and height of the primary display
        const mainScreen = electron_1.screen.getPrimaryDisplay();
        const w = 450;
        const h = 400;
        super({
            width: w,
            height: h,
            // display window at bottom left corner
            x: mainScreen.size.width / 2 - w,
            y: mainScreen.size.height / 2 - h,
            hasShadow: false,
            //Make the window larger than the screen (outside the dock bar)
            enableLargerThanScreen: true,
            movable: true,
            resizable: false,
            //In Windows, the taskbar will not show the icon of the window
            skipTaskbar: true,
            //Make frameless window (without title bar and border)
            frame: false,
            webPreferences: {
                preload: path_1.default.join(__dirname, 'preload.js'),
            },
        });
        // and load the index.html of the app.
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            this.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/sourceWindow.html`);
        }
        else {
            this.loadFile(path_1.default.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/sourceWindow.html`));
        }
        //ActionWindow can be dragged
        //Set on top with level screen-saver(101) higher level dock-window(20) and higher BorderWindow and DrawWindow
        this.setAlwaysOnTop(true, 'screen-saver');
        // Open the DevTools.
        // this.webContents.openDevTools({ mode: 'detach' });
    }
}
exports.default = Window;
//# sourceMappingURL=source-window.js.map