# Terminium

A self-hosted, open-source alternative to Termius for SSH connection management.

## Features

- 🖥️ **Cross-platform**: Windows, macOS, and Linux support
- 🔐 **Self-hosted**: Run your own Debian-based server
- 🔑 **Certificate Authentication**: Secure key-based authentication
- 📁 **ICMSF Files**: Import/Export encrypted connection profiles
- 💾 **Encrypted Storage**: Secure local credential storage
- 🎨 **Modern UI**: Clean interface inspired by Termius
- 🔌 **SSH Management**: Full-featured SSH client with terminal emulation

## Architecture

### Server (Debian)
- OpenSSH server with enhanced security
- Connection management API
- Certificate authority for client authentication
- User management system

### Client (Cross-platform Desktop App)
- Built with Electron + React + TypeScript
- Terminal emulation with xterm.js
- SSH2 protocol support
- AES-256 encryption for local data
- ICMSF (Import Connection Mothership Server File) support

## Quick Start

### Server Setup (Debian/Ubuntu)
```bash
cd server
sudo ./setup.sh
```

### Client Installation

#### macOS
See **[macOS Quick Start Guide](docs/MACOS_QUICKSTART.md)** or **[Complete macOS Installation](docs/MACOS_INSTALLATION.md)**

**Quick install:**
1. Download latest `.dmg` for your Mac (Intel/Apple Silicon/Universal)
2. Open DMG and drag to Applications
3. Launch from Applications folder

**From Source:**
```bash
cd client
npm install
npm run dist:mac        # All architectures
npm run dist:mac:intel  # Intel only
npm run dist:mac:arm    # Apple Silicon only
```

#### Windows / Linux
**From Release:**
Download the latest release for your platform from the releases page.

**From Source:**
```bash
cd client
npm install
npm run build
npm run dist:win    # Windows
npm run dist:linux  # Linux
```

## First-Time Setup

### Option 1: New Server Connection
1. Launch Terminium
2. Create username and password
3. Enter your server IP address
4. Follow the setup wizard to:
   - Install dependencies
   - Generate certificates
   - Configure authentication
   - Enable encryption

### Option 2: Import Existing Configuration
1. Launch Terminium
2. Select "Import Connection"
3. Choose your .icmsf file
4. Enter your credentials to decrypt

## ICMSF File Format

ICMSF (Import Connection Mothership Server File) is a military-grade encrypted file format containing:
- Server IP address
- Connection ports
- Authentication certificates
- User credentials (encrypted)

**File Extension:** `.icmsf`
**Encryption:** AES-256-GCM with enhanced security
**Key Derivation:** PBKDF2-HMAC-SHA512 (600,000 iterations)
**Additional Security:** HMAC-SHA512 integrity verification, gzip compression
**Format:** Versioned binary format

See [ICMSF Security Specification](docs/ICMSF_SECURITY.md) for complete details.

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- For server: Debian 11+ or Ubuntu 20.04+

### Build Client
```bash
cd client
npm install
npm run dev        # Development mode
npm run build      # Production build
npm run dist       # Create distributable
```

### Run Server
```bash
cd server
npm install
npm start
```

## Security Features

### Client Security
- ✅ Military-grade AES-256-GCM encryption (ICMSF files)
- ✅ PBKDF2-HMAC-SHA512 key derivation (600k iterations)
- ✅ Dual integrity verification (GCM + HMAC-SHA512)
- ✅ Encrypted ICMSF files with compression
- ✅ Secure key storage (OS keychain integration)
- ✅ File format versioning for forward compatibility
- ✅ Cryptographically secure random generation

### Server Security
- ✅ Certificate-based SSH authentication only
- ✅ Password authentication disabled by default
- ✅ LUKS2 full disk encryption (AES-XTS-512, Argon2id)
- ✅ Encrypted swap and home directories
- ✅ TPM2 integration for automatic unlock
- ✅ UFW firewall with fail2ban
- ✅ Multiple LUKS key slots (recovery options)
- ✅ Secure key management and backup tools

### Architecture
- ✅ Defense-in-depth security model
- ✅ Multiple encryption layers (client + server)
- ✅ Compliance ready (PCI-DSS, HIPAA, GDPR)
- ✅ NSA approved algorithms (AES-256)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## Roadmap

- [ ] SFTP file transfer
- [ ] Port forwarding
- [ ] Snippet management
- [ ] Team collaboration features
- [ ] Mobile apps (iOS/Android)
- [ ] Dark/Light theme customization
- [ ] Multi-factor authentication

## Support

For issues and questions, please use the GitHub issue tracker.
