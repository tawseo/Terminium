import { SSHConnection, AppSettings, ICMSFData } from '../types';

declare global {
  interface Window {
    terminium: {
      connection: {
        save: (connection: SSHConnection) => Promise<{ success: boolean }>;
        list: () => Promise<SSHConnection[]>;
        delete: (id: string) => Promise<{ success: boolean }>;
      };
      ssh: {
        connect: (connection: SSHConnection) => Promise<{ success: boolean; sessionId?: string; error?: string }>;
        write: (sessionId: string, data: string) => Promise<{ success: boolean; error?: string }>;
        resize: (sessionId: string, cols: number, rows: number) => Promise<{ success: boolean; error?: string }>;
        disconnect: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
        onData: (callback: (data: any) => void) => void;
        removeDataListener: () => void;
      };
      icmsf: {
        export: (data: ICMSFData, password: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
        import: (password: string) => Promise<{ success: boolean; data?: ICMSFData; error?: string }>;
      };
      settings: {
        get: () => Promise<AppSettings>;
        set: (settings: AppSettings) => Promise<{ success: boolean }>;
      };
      app: {
        isFirstRun: () => Promise<boolean>;
        completeSetup: () => Promise<{ success: boolean }>;
      };
    };
  }
}

export {};
