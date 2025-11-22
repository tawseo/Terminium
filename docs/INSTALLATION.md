# Terminium Installation Guide

## Server Installation (Debian/Ubuntu)

### Prerequisites
- Debian 11+ or Ubuntu 20.04+
- Root access
- Basic knowledge of SSH

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/terminium.git
cd terminium/server
```

### Step 2: Run Setup Script
```bash
sudo ./setup.sh
```

This script will:
- Update system packages
- Install OpenSSH server, Node.js, and dependencies
- Configure SSH for certificate-only authentication
- Set up firewall (UFW)
- Configure fail2ban
- Create Terminium system user
- Install API server

### Step 3: Generate Certificates
```bash
sudo /opt/terminium/scripts/generate-certs.sh
```

### Step 4: Create Users
```bash
sudo /opt/terminium/scripts/add-user.sh your-username
```

### Step 5: Start API Server
```bash
cd /opt/terminium/api
cp .env.example .env
# Edit .env with your settings
sudo systemctl start terminium
sudo systemctl status terminium
```

### Step 6: Configure Firewall
Make sure your firewall allows:
- SSH port (default: 22)
- API port (default: 3000)

```bash
sudo ufw status
```

## Client Installation

### Windows

1. Download `Terminium-Setup-x.x.x.exe` from releases
2. Run the installer
3. Launch Terminium from Start Menu

### macOS

1. Download `Terminium-x.x.x.dmg` from releases
2. Open DMG and drag Terminium to Applications
3. Launch from Applications folder

**Note:** First launch may show security warning. Go to System Preferences > Security & Privacy and click "Open Anyway"

### Linux

**AppImage:**
```bash
chmod +x Terminium-x.x.x.AppImage
./Terminium-x.x.x.AppImage
```

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i terminium_x.x.x_amd64.deb
sudo apt-get install -f  # Install dependencies
```

## Building from Source

### Prerequisites
- Node.js 18+
- npm or yarn

### Client
```bash
cd client
npm install
npm run build
npm run dist
```

Distributables will be in `client/release/`

### Server
```bash
cd server/api
npm install
npm start
```

## Troubleshooting

### SSH Connection Failed
- Verify server is running: `sudo systemctl status sshd`
- Check firewall: `sudo ufw status`
- Verify SSH keys are properly added to `~/.ssh/authorized_keys`

### API Server Not Starting
- Check logs: `sudo journalctl -u terminium -f`
- Verify port 3000 is not in use: `sudo lsof -i :3000`
- Check .env configuration

### Certificate Errors
- Ensure certificates exist: `ls -la /opt/terminium/certs/`
- Regenerate if needed: `sudo /opt/terminium/scripts/generate-certs.sh`

## Security Recommendations

1. **Change default ports** - Edit SSH port in `/etc/ssh/sshd_config.d/terminium.conf`
2. **Use strong passwords** - Minimum 12 characters for ICMSF encryption
3. **Regular updates** - Keep system and Terminium updated
4. **Firewall** - Only allow necessary ports
5. **Monitoring** - Check fail2ban logs regularly: `sudo fail2ban-client status sshd`

## Next Steps

After installation, see:
- [User Guide](USER_GUIDE.md) for using Terminium
- [ICMSF Guide](ICMSF.md) for connection file management
- [API Documentation](API.md) for server API details
