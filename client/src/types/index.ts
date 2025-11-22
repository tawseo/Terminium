export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authMethod: 'password' | 'privateKey';
  password?: string;
  privateKey?: string;
  passphrase?: string;
  group?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ICMSFData {
  version: string;
  serverIP: string;
  sshPort: number;
  apiPort: number;
  certificate: string;
  username: string;
  createdAt: number;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface ServerConfig {
  ip: string;
  sshPort: number;
  apiPort: number;
  certificate?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  fontFamily: string;
  cursorStyle: 'block' | 'underline' | 'bar';
  cursorBlink: boolean;
  scrollback: number;
  closeOnExit: boolean;
}

export interface TerminalSession {
  id: string;
  connectionId: string;
  connection: SSHConnection;
  active: boolean;
  createdAt: number;
}
