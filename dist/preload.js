"use strict";
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const hls_js_1 = __importDefault(require("hls.js"));
// let mediaRecorder: MediaRecorder; // MediaRecorder instance to capture footage
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];
let type = '';
electron_1.contextBridge.exposeInMainWorld('api', {
    toggleDraw: () => electron_1.ipcRenderer.send('toggle-draw'),
    onClearCanvas: (callback) => electron_1.ipcRenderer.on('clear-canvas', callback),
    getSources: async () => electron_1.ipcRenderer.invoke('get-sources'),
    selectSource: (sourceId) => electron_1.ipcRenderer.invoke('select-source', sourceId),
    startRecording: () => mediaRecorder.start(),
    stopRecording: () => mediaRecorder.stop(),
    pauseRecording: () => mediaRecorder.pause(),
    resumeRecording: () => mediaRecorder.resume(),
    toggleRecording: () => {
        console.log('MediaRecorder.state: ', mediaRecorder.state);
        if (mediaRecorder.state === 'recording') {
            console.log('pause recording');
            mediaRecorder.pause();
            // recording paused
        }
        else if (mediaRecorder.state === 'paused') {
            console.log('resume recording');
            mediaRecorder.resume();
            // resume recording
        }
        else {
            console.log('start recording');
            mediaRecorder.start();
            // start recording
        }
        return mediaRecorder.state;
    },
    onSourceWindowReady: (callback) => {
        electron_1.ipcRenderer.on('sourceId-selected', callback);
    },
});
const handleDataAvailable = (event) => {
    console.log(event.type);
    console.log(event.data);
    type = event.data.type;
    console.log('type', type);
    recordedChunks.push(event.data);
    console.log('video data available', recordedChunks.length);
};
const handleStop = async () => {
    console.log('mediaRecorder stopped');
    const blob = new Blob(recordedChunks, {
        //
        // type: 'video/webm; codecs=vp9',
        type: type,
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    console.log('buffer', buffer);
    electron_1.ipcRenderer.invoke('save-video', buffer);
};
const handleStream = (stream) => {
    // mediaRecorder = new MediaRecorder(stream);
    // create mediaRecorder instance of hljs
    // create video element
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.srcObject = stream;
    const hls = new hls_js_1.default();
    hls.attachMedia(videoElement);
    // capture stream from hljs
    const streamx = hls.media.captureStream();
    console.log('streamx', streamx);
    const mediaRecorder = new MediaRecorder(streamx);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
};
const handleError = (e) => {
    console.log('Stream error: ', e);
};
const handleSelectSource = async (sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                },
            },
        });
        handleStream(stream);
    }
    catch (error) {
        handleError(error);
    }
};
electron_1.ipcRenderer.on('sourceId-selected', (event, sourceId) => {
    handleSelectSource(sourceId);
});
//# sourceMappingURL=preload.js.map