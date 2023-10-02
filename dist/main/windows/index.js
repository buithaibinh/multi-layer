"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceWindow = exports.ActionWindow = exports.DrawWindow = exports.BorderWindow = void 0;
// Destructuring export all windows
const border_window_1 = __importDefault(require("./border-window"));
exports.BorderWindow = border_window_1.default;
const draw_window_1 = __importDefault(require("./draw-window"));
exports.DrawWindow = draw_window_1.default;
const action_window_1 = __importDefault(require("./action-window"));
exports.ActionWindow = action_window_1.default;
const source_window_1 = __importDefault(require("./source-window"));
exports.SourceWindow = source_window_1.default;
//# sourceMappingURL=index.js.map