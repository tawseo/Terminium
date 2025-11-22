# Terminium Quick Start Guide

## 🎉 What You Have

A complete, self-hosted alternative to Termius with:

### ✅ Server Component (Debian/Ubuntu)
- Automated setup script
- Secure SSH configuration (certificate-only auth)
- Express API server
- Firewall and fail2ban protection
- User and certificate management

### ✅ Client Application (Cross-platform)
- Modern desktop app (Windows, macOS, Linux)
- Beautiful Termius-like UI
- Full SSH terminal emulation
- Encrypted connection storage
- ICMSF file import/export

## 🚀 Getting Started

### Step 1: Set Up Your Server

On a Debian/Ubuntu server:

```bash
cd server
sudo ./setup.sh
```

This will:
- Install all dependencies (OpenSSH, Node.js, etc.)
- Configure secure SSH settings
- Set up firewall rules
- Install the API server

### Step 2: Generate Certificates

```bash
sudo /opt/terminium/scripts/generate-certs.sh
```

### Step 3: Create Your First User

```bash
sudo /opt/terminium/scripts/add-user.sh yourusername
```

### Step 4: Start the API Server

```bash
cd /opt/terminium/api
sudo cp .env.example .env
# Edit .env and set JWT_SECRET
sudo systemctl start terminium
```

### Step 5: Build the Client App

On your development machine:

```bash
cd client
npm install
npm run build
npm run dist
```

This creates installers for your platform in `client/release/`

### Step 6: Install and Run

Install the app from `client/release/` and launch it!

## 📋 First-Time Client Setup

When you launch Terminium for the first time:

### Option A: New Server Connection
1. Enter your username and password
2. Enter your server's IP address
3. Configure SSH port (default: 22)
4. Configure API port (default: 3000)
5. Click "Complete Setup"

### Option B: Import Existing Connection
1. Click "Import Connection"
2. Select your `.icmsf` file
3. Enter the file password
4. Done!

## 💡 Quick Usage

### Add a Connection
1. Click "+ New Connection"
2. Enter:
   - Name (e.g., "Production Server")
   - Host (IP or domain)
   - Username
   - Authentication (password or SSH key)
3. Save

### Connect to Server
1. Click on a connection card
2. Terminal opens automatically
3. Start working!

### Export Connection
1. Settings → Export Connection
2. Set encryption password
3. Share `.icmsf` file (password separately!)

## 🎨 Features Implemented

### Security
- ✅ Certificate-based SSH authentication
- ✅ AES-256-GCM encryption for ICMSF files
- ✅ Password authentication disabled on server
- ✅ Fail2ban protection
- ✅ UFW firewall configuration
- ✅ Encrypted local storage

### UI/UX
- ✅ Modern dark theme (Tokyo Night colors)
- ✅ Connection management dashboard
- ✅ Full-featured terminal (xterm.js)
- ✅ Settings customization
- ✅ First-run setup wizard
- ✅ ICMSF import/export

### Client Features
- ✅ Multiple concurrent sessions
- ✅ Connection grouping
- ✅ Settings: font size, cursor style, theme
- ✅ Scrollback buffer
- ✅ Web links clickable in terminal

### Server Features
- ✅ User management API
- ✅ SSH key upload/management
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Logging

## 📦 Project Structure

```
Terminium/
├── client/              # Desktop application
│   ├── src/
│   │   ├── main/       # Electron main process
│   │   ├── renderer/   # React UI components
│   │   └── types/      # TypeScript definitions
│   └── package.json
│
├── server/             # Server-side code
│   ├── setup.sh       # Automated setup
│   ├── api/           # Express API server
│   └── scripts/       # Management scripts
│
└── docs/              # Documentation
    ├── INSTALLATION.md
    ├── USER_GUIDE.md
    └── ARCHITECTURE.md
```

## 🔧 Development

### Run Client in Dev Mode
```bash
cd client
npm install
npm run dev
```

### Run Server API Locally
```bash
cd server/api
npm install
npm start
```

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[INSTALLATION.md](docs/INSTALLATION.md)** - Detailed installation
- **[USER_GUIDE.md](docs/USER_GUIDE.md)** - Complete user manual
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical details
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

## 🛠️ Build Platforms

### Windows
```bash
npm run dist:win
```
Creates: `.exe` installer and portable version

### macOS
```bash
npm run dist:mac
```
Creates: `.dmg` disk image and `.zip`

### Linux
```bash
npm run dist:linux
```
Creates: `.AppImage` and `.deb` package

## 🔐 ICMSF File Format

**ICMSF** (Import Connection Mothership Server File)

- **Extension:** `.icmsf`
- **Encryption:** AES-256-GCM
- **Contains:** Server IP, ports, certificates, credentials
- **Use case:** Share server configurations securely

## 🌟 Next Steps

1. **Test the server setup** on a Debian/Ubuntu VM
2. **Build the client** for your platform
3. **Create your first connection**
4. **Try importing/exporting** ICMSF files
5. **Customize settings** to your preference

## 🐛 Troubleshooting

### Server Issues
- Check logs: `sudo journalctl -u terminium -f`
- Verify firewall: `sudo ufw status`
- Test SSH: `ssh username@server-ip`

### Client Issues
- Clear cache: Delete electron-store data
- Check logs: Developer tools console
- Rebuild: `rm -rf node_modules && npm install`

## 📞 Getting Help

- Check documentation in `/docs`
- Review error logs
- Open GitHub issue

## 🎯 What Makes This Different

vs Termius:
- ✅ **Self-hosted** - Your data, your server
- ✅ **Open source** - Full transparency
- ✅ **Free** - No subscriptions
- ✅ **Privacy** - No third-party servers
- ✅ **ICMSF format** - Encrypted connection sharing

## 🚧 Future Enhancements

Want to contribute? Here are some ideas:
- SFTP file transfer
- Port forwarding UI
- Snippet library
- Team collaboration
- Mobile apps
- Multi-factor authentication

---

**Happy SSH-ing! 🚀**

For questions or issues, check the docs or open a GitHub issue.
