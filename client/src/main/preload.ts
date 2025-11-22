import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('terminium', {
  // Connection management
  connection: {
    save: (connection: any) => ipcRenderer.invoke('connection:save', connection),
    list: () => ipcRenderer.invoke('connection:list'),
    delete: (id: string) => ipcRenderer.invoke('connection:delete', id),
  },

  // SSH operations
  ssh: {
    connect: (connection: any) => ipcRenderer.invoke('ssh:connect', connection),
    write: (sessionId: string, data: string) => ipcRenderer.invoke('ssh:write', sessionId, data),
    resize: (sessionId: string, cols: number, rows: number) =>
      ipcRenderer.invoke('ssh:resize', sessionId, cols, rows),
    disconnect: (sessionId: string) => ipcRenderer.invoke('ssh:disconnect', sessionId),
    onData: (callback: (data: any) => void) => {
      ipcRenderer.on('ssh:data', (event, data) => callback(data));
    },
    removeDataListener: () => {
      ipcRenderer.removeAllListeners('ssh:data');
    },
  },

  // ICMSF operations
  icmsf: {
    export: (data: any, password: string) => ipcRenderer.invoke('icmsf:export', data, password),
    import: (password: string) => ipcRenderer.invoke('icmsf:import', password),
  },

  // Settings
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (settings: any) => ipcRenderer.invoke('settings:set', settings),
  },

  // App
  app: {
    isFirstRun: () => ipcRenderer.invoke('app:isFirstRun'),
    completeSetup: () => ipcRenderer.invoke('app:completeSetup'),
  },
});
