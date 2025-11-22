import { Client, ClientChannel } from 'ssh2';
import { SSHConnection } from '../types';

interface Session {
  id: string;
  client: Client;
  stream: ClientChannel;
  connection: SSHConnection;
}

export class SSHManager {
  private sessions: Map<string, Session> = new Map();

  async connect(
    connection: SSHConnection,
    onData: (data: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new Client();
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const config: any = {
        host: connection.host,
        port: connection.port,
        username: connection.username,
      };

      if (connection.authMethod === 'password') {
        config.password = connection.password;
      } else {
        config.privateKey = connection.privateKey;
        if (connection.passphrase) {
          config.passphrase = connection.passphrase;
        }
      }

      client
        .on('ready', () => {
          client.shell({ term: 'xterm-256color' }, (err, stream) => {
            if (err) {
              client.end();
              reject(err);
              return;
            }

            stream.on('data', (data: Buffer) => {
              onData(data.toString());
            });

            stream.on('close', () => {
              this.sessions.delete(sessionId);
              client.end();
            });

            this.sessions.set(sessionId, {
              id: sessionId,
              client,
              stream,
              connection,
            });

            resolve(sessionId);
          });
        })
        .on('error', (err) => {
          reject(err);
        })
        .connect(config);
    });
  }

  async write(sessionId: string, data: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return new Promise((resolve, reject) => {
      session.stream.write(data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async resize(sessionId: string, cols: number, rows: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.stream.setWindow(rows, cols, 0, 0);
  }

  async disconnect(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    session.stream.close();
    session.client.end();
    this.sessions.delete(sessionId);
  }

  disconnectAll(): void {
    for (const [sessionId] of this.sessions) {
      this.disconnect(sessionId);
    }
  }
}
