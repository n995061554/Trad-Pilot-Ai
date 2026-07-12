const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Configure auto updater logging to use the default console log
autoUpdater.logger = console;

function setupAutoUpdater() {
  console.log('[AutoUpdater] Initializing auto-updater service...');

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for available updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available! Details:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] No updates available at this time. Current version is up-to-date.');
  });

  autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] [ERROR] Error encountered during update check:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `[AutoUpdater] Progress: ${Math.round(progressObj.percent)}%`;
    logMessage += ` | Speed: ${Math.round(progressObj.bytesPerSecond / 1024)} KB/s`;
    logMessage += ` | (${progressObj.transferred}/${progressObj.total} bytes)`;
    console.log(logMessage);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update successfully downloaded. Application will now quit and install the update...');
    // Automatically restart and install the update once it is downloaded
    autoUpdater.quitAndInstall();
  });

  // Check for updates if packaged (or if not running with ELECTRON_DEV environment variable)
  const isDev = process.env.ELECTRON_DEV === 'true' || !app.isPackaged;
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify().catch(err => {
      console.error('[AutoUpdater] [ERROR] Failed to execute checkForUpdatesAndNotify:', err);
    });
  } else {
    console.log('[AutoUpdater] Running in development mode. Bypassing live update checks.');
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Trade X Cloud",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Comprehensive debugging logs for the window loading lifecycle
  console.log('[Electron] Initializing main window...');

  mainWindow.webContents.on('did-start-loading', () => {
    console.log('[Electron] WebContents began loading resource files...');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] WebContents successfully finished loading!');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[Electron] [ERROR] Failed to load URL: "${validatedURL}"`);
    console.error(`[Electron] [ERROR] Code: ${errorCode} | Description: ${errorDescription}`);
  });

  // Track rendering crashes or unexpected issues
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Electron] [CRASH] Render process gone! Reason:', details.reason, '| Exit Code:', details.exitCode);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.warn('[Electron] [WARNING] WebContents became unresponsive.');
  });

  mainWindow.webContents.on('responsive', () => {
    console.log('[Electron] WebContents became responsive again.');
  });

  // Determine if we are in development mode
  const isDev = process.env.ELECTRON_DEV === 'true' || !app.isPackaged;
  console.log(`[Electron] Running mode: ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'}`);

  if (isDev) {
    console.log('[Electron] Attempting to load dev server at http://localhost:3000...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    console.log(`[Electron] Attempting to load production build at: ${indexPath}`);
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('[Electron] [ERROR] Failed to load index.html file:', err);
    });
  }

  // Open external links in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
