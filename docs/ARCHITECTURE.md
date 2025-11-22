# Terminium Architecture

## Overview

Terminium is a self-hosted SSH connection manager consisting of two main components:

1. **Server** - Debian/Ubuntu-based backend
2. **Client** - Cross-platform desktop application (Electron)

## Technology Stack

### Server
- **OS:** Debian 11+ / Ubuntu 20.04+
- **SSH:** OpenSSH Server
- **API:** Node.js + Express
- **Security:** UFW, Fail2ban, OpenSSL

### Client
- **Framework:** Electron
- **UI:** React + TypeScript
- **Styling:** Styled Components
- **Terminal:** xterm.js
- **SSH:** ssh2 (Node.js)
- **Encryption:** Node.js crypto (AES-256-GCM)
- **Build:** Vite, electron-builder

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Renderer Process (React UI)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │  │
│  │  │Dashboard │  │Terminal  │  │Settings      │   │  │
│  │  │Component │  │Component │  │Component     │   │  │
│  │  └──────────┘  └──────────┘  └──────────────┘   │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │ IPC                               │
│  ┌───────────────────┴───────────────────────────────┐  │
│  │           Main Process (Electron)                 │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐  │  │
│  │  │SSH Manager   │  │ICMSF Manager            │  │  │
│  │  │- Connect     │  │- Encrypt/Decrypt        │  │  │
│  │  │- Write       │  │- Import/Export          │  │  │
│  │  │- Resize      │  │- AES-256-GCM            │  │  │
│  │  └──────────────┘  └──────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │electron-store (Connections, Settings)        │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────┬───────────────────────────────┘  │
└────────────────────┬─┴───────────────────────────────────┘
                     │
                     │ SSH Protocol (Port 22)
                     │ HTTP/REST API (Port 3000)
                     │
┌────────────────────┴─────────────────────────────────────┐
│                    Server (Debian/Ubuntu)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │              API Server (Express)                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │Auth Routes │  │User Routes │  │Key Routes  │  │  │
│  │  │- Register  │  │- Profile   │  │- Upload    │  │  │
│  │  │- Login     │  │- Settings  │  │- List      │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              OpenSSH Server                       │  │
│  │  - Certificate-based authentication               │  │
│  │  - Password auth disabled                         │  │
│  │  - Fail2ban protection                            │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Security Layer                       │  │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────────────┐  │  │
│  │  │UFW      │  │Fail2ban │  │SSL/TLS Certs     │  │  │
│  │  │Firewall │  │         │  │                  │  │  │
│  │  └─────────┘  └─────────┘  └──────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Component Details

### Client Application

#### Main Process (Electron)
The main process handles:
- Window management
- IPC communication with renderer
- SSH connection management via ssh2
- File system operations
- ICMSF encryption/decryption

**Key Files:**
- `src/main/index.ts` - Application entry point
- `src/main/ssh-manager.ts` - SSH connection handler
- `src/main/icmsf-manager.ts` - ICMSF file operations
- `src/main/preload.ts` - IPC bridge

#### Renderer Process (React)
The renderer process provides the UI:
- Connection management dashboard
- Terminal emulation (xterm.js)
- Settings configuration
- First-run setup wizard

**Key Components:**
- `Dashboard.tsx` - Main connection list
- `Terminal.tsx` - SSH terminal interface
- `FirstRunSetup.tsx` - Initial setup wizard
- `Settings.tsx` - Application settings

#### Data Storage
- **electron-store:** Local storage for connections and settings
- **keytar:** Secure credential storage (OS keychain)

### Server Application

#### API Server (Express)
REST API for client-server communication:
- User registration and authentication
- SSH key management
- Connection metadata

**Endpoints:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/keys/upload` - Upload SSH public key
- `GET /api/keys` - List user's keys

#### OpenSSH Server
Standard SSH server with enhanced security:
- Certificate-only authentication
- Password authentication disabled
- Protocol 2 only
- Ed25519 and RSA host keys

#### Security Components
- **UFW:** Firewall (allow ports 22, 3000)
- **Fail2ban:** Brute-force protection
- **OpenSSL:** Certificate management

## Data Flow

### Connection Flow

1. User clicks "Connect" on connection card
2. Client sends SSH connection request to Main Process via IPC
3. Main Process creates SSH connection using ssh2 library
4. SSH handshake with server (certificate authentication)
5. Main Process creates terminal session
6. Data flows bidirectionally:
   - User input → Renderer → Main → SSH Server
   - SSH output → Main → Renderer → xterm.js

### ICMSF Export Flow

1. User triggers export in Settings
2. Client collects connection data
3. User provides encryption password
4. Main Process encrypts data with AES-256-GCM
5. Encrypted file saved with .icmsf extension

### ICMSF Import Flow

1. User selects .icmsf file
2. User provides decryption password
3. Main Process decrypts file
4. Connection data loaded into application
5. User can connect immediately

## Security Model

### Client Security
- **Local encryption:** Connections stored encrypted via electron-store
- **Credential storage:** OS keychain integration via keytar
- **ICMSF encryption:** AES-256-GCM with PBKDF2 key derivation
- **No plaintext storage:** Passwords never stored in plaintext

### Server Security
- **Certificate-only auth:** Passwords disabled for SSH
- **Fail2ban:** Auto-ban after 3 failed attempts
- **Firewall:** UFW blocks all except allowed ports
- **Rate limiting:** API rate limits prevent abuse
- **JWT tokens:** Stateless authentication for API

### Network Security
- **SSH protocol:** Encrypted communication
- **HTTPS ready:** API can run behind reverse proxy with SSL
- **No credential transmission:** Keys used for auth, not passwords

## Deployment

### Client Distribution
- **Windows:** NSIS installer + portable exe
- **macOS:** DMG disk image + zip
- **Linux:** AppImage + DEB package

Built with electron-builder for all platforms.

### Server Deployment
- Automated setup script (`setup.sh`)
- Systemd service for API server
- Standard package management (apt)

## Scalability Considerations

### Client
- Handles multiple concurrent SSH sessions
- Efficient terminal rendering with xterm.js
- Local storage for offline access to connection list

### Server
- Horizontal scaling: Multiple API servers behind load balancer
- SSH: Standard OpenSSH scales well
- Database: Currently file-based, can migrate to PostgreSQL/MySQL

## Future Enhancements

1. **SFTP Support** - File transfer capabilities
2. **Port Forwarding** - Tunnel management
3. **Snippet Library** - Saved command snippets
4. **Team Features** - Shared connections
5. **Monitoring** - Server resource monitoring
6. **Multi-factor Auth** - Additional security layer
7. **Cloud Sync** - Optional cloud backup of connections
8. **Mobile Apps** - iOS/Android clients

## Performance

### Client
- **Startup time:** < 2 seconds
- **Memory usage:** ~150MB base, +50MB per terminal
- **Terminal latency:** < 10ms local, depends on network for remote

### Server
- **API response time:** < 50ms
- **Concurrent connections:** Limited by system resources
- **CPU usage:** Minimal when idle

## Development Setup

### Prerequisites
- Node.js 18+
- For server: Debian/Ubuntu VM or physical machine

### Client Development
```bash
cd client
npm install
npm run dev
```

### Server Development
```bash
cd server/api
npm install
npm start
```

## Testing Strategy

### Unit Tests
- SSH connection logic
- ICMSF encryption/decryption
- API endpoints

### Integration Tests
- Full connection flow
- ICMSF import/export
- Multi-session handling

### E2E Tests
- User workflows (Playwright/Spectron)
- Cross-platform builds
- Update mechanism

## Monitoring & Logging

### Client
- Console logging (development)
- Error reporting (optional analytics)

### Server
- Systemd journal for API server
- SSH logs: `/var/log/auth.log`
- Fail2ban logs: `/var/log/fail2ban.log`
- API access logs via Winston

## Backup & Recovery

### Client
- Export all connections as ICMSF
- Settings stored in OS-specific locations
- Manual backup recommended

### Server
- Regular backups of `/opt/terminium`
- Certificate backups crucial
- User data in `/home/username`

## License

MIT License - See LICENSE file
