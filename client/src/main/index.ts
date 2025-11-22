import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import { SSHManager } from './ssh-manager';
import { ICMSFManager } from './icmsf-manager';

const store = new Store();
const sshManager = new SSHManager();
const icmsfManager = new ICMSFManager();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1b26',
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3001');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

// Connection management
ipcMain.handle('connection:save', async (event, connection) => {
  const connections = store.get('connections', []) as any[];
  const existing = connections.findIndex(c => c.id === connection.id);

  if (existing >= 0) {
    connections[existing] = connection;
  } else {
    connections.push(connection);
  }

  store.set('connections', connections);
  return { success: true };
});

ipcMain.handle('connection:list', async () => {
  return store.get('connections', []);
});

ipcMain.handle('connection:delete', async (event, id) => {
  const connections = store.get('connections', []) as any[];
  store.set('connections', connections.filter(c => c.id !== id));
  return { success: true };
});

// SSH operations
ipcMain.handle('ssh:connect', async (event, connection) => {
  try {
    const sessionId = await sshManager.connect(connection, (data: string) => {
      mainWindow?.webContents.send('ssh:data', { sessionId, data });
    });
    return { success: true, sessionId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ssh:write', async (event, sessionId, data) => {
  try {
    await sshManager.write(sessionId, data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ssh:resize', async (event, sessionId, cols, rows) => {
  try {
    await sshManager.resize(sessionId, cols, rows);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ssh:disconnect', async (event, sessionId) => {
  try {
    await sshManager.disconnect(sessionId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// ICMSF operations
ipcMain.handle('icmsf:export', async (event, data, password) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Connection File',
      defaultPath: 'terminium-connection.icmsf',
      filters: [{ name: 'Terminium Connection', extensions: ['icmsf'] }],
    });

    if (!filePath) return { success: false, error: 'Cancelled' };

    await icmsfManager.export(data, password, filePath);
    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('icmsf:import', async (event, password) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Import Connection File',
      filters: [{ name: 'Terminium Connection', extensions: ['icmsf'] }],
      properties: ['openFile'],
    });

    if (!filePaths || filePaths.length === 0) {
      return { success: false, error: 'Cancelled' };
    }

    const data = await icmsfManager.import(filePaths[0], password);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Settings
ipcMain.handle('settings:get', async () => {
  return store.get('settings', {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, Consolas, monospace',
    cursorStyle: 'block',
    cursorBlink: true,
    scrollback: 10000,
    closeOnExit: true,
  });
});

ipcMain.handle('settings:set', async (event, settings) => {
  store.set('settings', settings);
  return { success: true };
});

// First-run check
ipcMain.handle('app:isFirstRun', async () => {
  return !store.has('setupCompleted');
});

ipcMain.handle('app:completeSetup', async () => {
  store.set('setupCompleted', true);
  return { success: true };
});
