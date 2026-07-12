const { contextBridge, ipcRenderer } = require('electron');

// Expose custom safe APIs to the renderer process (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  ping: () => ipcRenderer.invoke('ping'),
});

console.log('[Preload] Trade X Cloud preload script successfully injected and loaded.');
