declare global {
  interface Window {
    api: IElectronAPI;
  }
}
export interface IElectronAPI {
  toggleDraw: () => void;
  onClearCanvas: (callback: () => void) => void;
}
