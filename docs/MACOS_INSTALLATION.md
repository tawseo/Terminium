# Terminium for macOS - Installation Guide

Complete guide for installing and using Terminium on macOS.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Installation Methods](#installation-methods)
- [First-Time Setup](#first-time-setup)
- [Building from Source](#building-from-source)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)

---

## System Requirements

### Minimum Requirements
- **macOS Version**: 10.13 (High Sierra) or later
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB free space
- **Internet**: Required for initial download and server connection

### Recommended
- **macOS Version**: 12.0 (Monterey) or later
- **RAM**: 8GB or more
- **Display**: Retina display for best experience

### For Building from Source
- **Xcode Command Line Tools**: Latest version
- **Node.js**: 18.x or later
- **npm**: 9.x or later

---

## Installation Methods

### Method 1: Download Pre-built App (Recommended)

#### Step 1: Download Terminium

1. Go to the [Releases page](https://github.com/yourusername/Terminium/releases)
2. Download the latest `.dmg` file:
   - `Terminium-1.0.0-mac.dmg` (Intel Macs)
   - `Terminium-1.0.0-mac-arm64.dmg` (Apple Silicon M1/M2/M3)

**How to check your Mac type:**
- Click  → **About This Mac**
- Look for "Chip" or "Processor":
  - **Intel**: Download regular `.dmg`
  - **Apple M1/M2/M3**: Download `arm64.dmg`

#### Step 2: Install the Application

1. **Open the DMG file**
   - Double-click the downloaded `Terminium-*.dmg` file
   - A new Finder window will open

2. **Drag to Applications**
   ```
   [Terminium Icon] ───→ [Applications Folder]
   ```
   - Drag the Terminium icon to the Applications folder
   - Wait for the copy to complete (5-10 seconds)

3. **Eject the DMG**
   - Right-click the Terminium disk icon on desktop
   - Select "Eject"

#### Step 3: First Launch

1. **Open Applications folder**
   - Press `⌘ + Space` to open Spotlight
   - Type "Applications" and press Enter
   - Or: Finder → Go → Applications

2. **Launch Terminium**
   - Double-click `Terminium.app`

3. **Handle Security Warning** (First time only)

   You'll see this message:
   ```
   "Terminium.app" cannot be opened because it is from an
   unidentified developer.
   ```

   **Solution:**
   - Click **OK**
   - Open **System Preferences** (System Settings on macOS 13+)
   - Go to **Security & Privacy**
   - Click the **General** tab
   - You'll see: `"Terminium.app" was blocked from use...`
   - Click **Open Anyway**
   - Confirm by clicking **Open**

   **Alternative method (Terminal):**
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/Terminium.app
   ```

4. **Terminium should now launch!** 🎉

---

### Method 2: Install via Homebrew (Coming Soon)

```bash
# Future release
brew install --cask terminium
```

---

## First-Time Setup

### Scenario A: New Server Connection

When you launch Terminium for the first time:

#### Step 1: Welcome Screen
```
╔════════════════════════════════════╗
║   Welcome to Terminium            ║
╚════════════════════════════════════╝

Choose how you'd like to get started:
[New Server Connection] [Import Connection]
```

Click **"New Server Connection"**

#### Step 2: Create Credentials

```
Step 1 of 2: Create Account
┌─────────────────────────────────┐
│ Username: [your-username      ] │
│ Password: [••••••••••••••••••] │
│                                 │
│ Password must be at least      │
│ 12 characters                  │
└─────────────────────────────────┘
          [Next →]
```

1. Enter a **username** (alphanumeric, no spaces)
2. Create a **strong password** (minimum 12 characters)
   - **Good**: `MyTerminiumServer2024!`
   - **Better**: `correct-horse-battery-staple-terminium`
3. Click **Next**

#### Step 3: Server Configuration

```
Step 2 of 2: Server Details
┌─────────────────────────────────┐
│ Server IP:    [192.168.1.100 ] │
│ SSH Port:     [22            ] │
│ API Port:     [3000          ] │
└─────────────────────────────────┘
       [← Back] [Complete Setup]
```

1. **Server IP**: Enter your Terminium server's IP address
   - Local network: `192.168.x.x` or `10.0.x.x`
   - Public server: `your-domain.com` or public IP

2. **SSH Port**: Usually `22` (default)

3. **API Port**: Usually `3000` (default)

4. Click **Complete Setup**

#### Step 4: Connection Setup

Terminium will:
- Connect to your server ✓
- Validate credentials ✓
- Generate SSH keys ✓
- Upload public key ✓
- Save configuration ✓

**Success!** You're now ready to create connections.

---

### Scenario B: Import Existing Connection

If you have an existing `.icmsf` file:

#### Step 1: Select Import

```
╔════════════════════════════════════╗
║   Welcome to Terminium            ║
╚════════════════════════════════════╝

Choose how you'd like to get started:
[New Server Connection] [Import Connection]
```

Click **"Import Connection"**

#### Step 2: Choose File

```
Import Connection
┌─────────────────────────────────┐
│ Connection File Password:       │
│ [••••••••••••••••••]           │
│                                 │
│ This is the password you used  │
│ to encrypt the .icmsf file     │
└─────────────────────────────────┘
    [← Back] [Select File & Import]
```

1. Click **Select File & Import**
2. Navigate to your `.icmsf` file
3. Select it and click **Open**
4. Enter the **decryption password**
5. Click **Import**

**Success!** Your connection is now configured.

---

## Using Terminium

### Adding SSH Connections

#### Step 1: Open Dashboard

After setup, you'll see the main dashboard:

```
╔═══════════════════════════════════════╗
║  🖥️ Connections      [+ New Connection]║
╠═══════════════════════════════════════╣
║                                       ║
║  No connections yet                   ║
║  Click "New Connection" to add a      ║
║  server                               ║
║                                       ║
╚═══════════════════════════════════════╝
```

#### Step 2: Create Connection

Click **+ New Connection**

```
New SSH Connection
┌────────────────────────────────────┐
│ Connection Name:                   │
│ [Production Server              ] │
│                                    │
│ Host:                              │
│ [server.example.com             ] │
│                                    │
│ Port:                              │
│ [22                             ] │
│                                    │
│ Username:                          │
│ [root                           ] │
│                                    │
│ Authentication Method:             │
│ ◉ Private Key  ○ Password         │
│                                    │
│ Private Key:                       │
│ [-----BEGIN PRIVATE KEY-----    ] │
│ [                               ] │
│ [-----END PRIVATE KEY-----      ] │
│                                    │
│ Passphrase (optional):             │
│ [••••••••••                     ] │
│                                    │
│ Group (optional):                  │
│ [Production                     ] │
└────────────────────────────────────┘
      [Cancel] [Save Connection]
```

**Fill in the details:**

1. **Connection Name**: Friendly name (e.g., "Production Server")
2. **Host**: Server IP or domain
3. **Port**: SSH port (usually 22)
4. **Username**: Your SSH username
5. **Authentication**:
   - **Private Key** (recommended): Paste your SSH private key
   - **Password**: Enter SSH password (less secure)
6. **Passphrase**: If your key is encrypted
7. **Group**: Optional category (Production, Development, etc.)

Click **Save Connection**

#### Step 3: Connect

Your connection appears as a card:

```
┌─────────────────────────────┐
│ Production Server      [×]  │
│ root@server.example.com:22  │
│ 🔐 Key  📁 Production       │
└─────────────────────────────┘
```

**Click the card to connect!**

### Using the Terminal

Once connected, you get a full terminal:

```
╔════════════════════════════════════════╗
║ ← Session: abc123...    ● Connected    ║
╠════════════════════════════════════════╣
║                                        ║
║ Last login: Sat Nov 22 10:00:00 2024  ║
║ [root@server ~]#                       ║
║ |                                      ║
║                                        ║
╚════════════════════════════════════════╝
```

**Features:**
- ✓ Full terminal emulation
- ✓ Copy/paste support (`⌘+C`, `⌘+V`)
- ✓ Scrollback buffer
- ✓ Clickable URLs
- ✓ Color support
- ✓ Multiple concurrent sessions

**Keyboard shortcuts:**
- `⌘+C`: Copy selected text (or interrupt if no selection)
- `⌘+V`: Paste
- `⌘+F`: Find in terminal
- `⌘+K`: Clear screen
- `⌘+W`: Close tab

---

## Building from Source (Advanced)

### Prerequisites

#### Step 1: Install Xcode Command Line Tools

```bash
xcode-select --install
```

Click **Install** when prompted.

**Verify installation:**
```bash
xcode-select -p
# Should output: /Library/Developer/CommandLineTools
```

#### Step 2: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 3: Install Node.js

```bash
brew install node@18
```

**Verify installation:**
```bash
node --version   # Should be v18.x or later
npm --version    # Should be 9.x or later
```

### Build Steps

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/Terminium.git
cd Terminium/client
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will take 2-5 minutes depending on your internet speed.

#### Step 3: Build for macOS

```bash
# Development build
npm run dev

# Production build
npm run build

# Create distributable DMG
npm run dist:mac
```

**For Apple Silicon (M1/M2/M3):**
```bash
npm run dist:mac -- --arm64
```

**For Intel Macs:**
```bash
npm run dist:mac -- --x64
```

**For Universal (Both):**
```bash
npm run dist:mac -- --universal
```

#### Step 4: Find Built App

The built app will be in:
```
client/release/
├── Terminium-1.0.0-mac.dmg       # Installer
├── Terminium-1.0.0-mac.zip       # Portable version
└── mac/Terminium.app             # Application bundle
```

**Install:**
```bash
# Open the DMG
open release/Terminium-*.dmg

# Or copy directly to Applications
cp -R release/mac/Terminium.app /Applications/
```

---

## Advanced Configuration

### Settings

Access settings via:
- Menu bar: **Terminium** → **Preferences** (`⌘+,`)
- Dashboard: Click **⚙️ Settings** in sidebar

```
Settings
┌────────────────────────────────────┐
│ Appearance                         │
│                                    │
│ Theme:           [Dark ▼]         │
│ Font Size:       [14   ]          │
│ Font Family:     [Monaco ▼]       │
│                                    │
│ Terminal                           │
│                                    │
│ Cursor Style:    [Block ▼]        │
│ ☑ Cursor Blink                    │
│ Scrollback Lines: [10000]         │
│ ☑ Close on Exit                   │
└────────────────────────────────────┘
          [Save Settings]
```

### Export/Import Connections

#### Export to ICMSF

1. Settings → **Export Connection**
2. Enter encryption password (min 12 characters)
3. Save `.icmsf` file

**Security:**
- File is encrypted with AES-256-GCM
- 600,000 PBKDF2 iterations
- HMAC-SHA512 integrity verification

#### Import from ICMSF

1. Dashboard → **Import Connection**
2. Select `.icmsf` file
3. Enter decryption password

---

## Troubleshooting

### App Won't Open

**Problem:** "Terminium.app is damaged and can't be opened"

**Solution:**
```bash
# Remove quarantine attribute
sudo xattr -rd com.apple.quarantine /Applications/Terminium.app

# Or remove extended attributes entirely
sudo xattr -cr /Applications/Terminium.app
```

### Permission Denied

**Problem:** Can't save connections or settings

**Solution:**
```bash
# Fix permissions
chmod -R 755 ~/Library/Application\ Support/Terminium
```

### Can't Connect to Server

**Problem:** Connection times out

**Solutions:**
1. **Check server is running:**
   ```bash
   ping your-server-ip
   ```

2. **Verify SSH port is open:**
   ```bash
   nc -zv your-server-ip 22
   ```

3. **Check firewall settings:**
   - System Preferences → Security & Privacy → Firewall
   - Ensure Terminium is allowed

4. **Verify server-side:**
   ```bash
   # On server
   sudo systemctl status sshd
   sudo ufw status
   ```

### SSH Key Issues

**Problem:** "Permission denied (publickey)"

**Solutions:**

1. **Check key permissions:**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```

2. **Verify key is on server:**
   ```bash
   # On server
   cat ~/.ssh/authorized_keys
   ```

3. **Test SSH manually:**
   ```bash
   ssh -i ~/.ssh/id_rsa user@server
   ```

### Performance Issues

**Problem:** Terminal is slow or laggy

**Solutions:**

1. **Reduce scrollback:**
   - Settings → Scrollback Lines → 1000

2. **Disable cursor blink:**
   - Settings → Uncheck "Cursor Blink"

3. **Check network:**
   ```bash
   ping -c 10 your-server-ip
   ```

4. **Monitor resources:**
   - Activity Monitor → Search "Terminium"
   - Check CPU and Memory usage

---

## Keyboard Shortcuts

### Global
| Shortcut | Action |
|----------|--------|
| `⌘+,` | Open Settings |
| `⌘+Q` | Quit Terminium |
| `⌘+H` | Hide Window |
| `⌘+M` | Minimize Window |

### Dashboard
| Shortcut | Action |
|----------|--------|
| `⌘+N` | New Connection |
| `⌘+F` | Search Connections |
| `⌘+W` | Close Window |

### Terminal
| Shortcut | Action |
|----------|--------|
| `⌘+C` | Copy (or interrupt) |
| `⌘+V` | Paste |
| `⌘+F` | Find |
| `⌘+K` | Clear Screen |
| `⌘+T` | New Tab |
| `⌘+W` | Close Tab |
| `⌘+1-9` | Switch to Tab |

---

## Security Best Practices

### SSH Keys

1. **Generate strong keys:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Use passphrases:**
   - Always encrypt your private keys
   - Use 12+ character passphrases

3. **Never share private keys:**
   - Only upload public keys (`.pub`) to servers
   - Store private keys securely

### ICMSF Files

1. **Strong passwords:**
   - Minimum 12 characters
   - Use password manager
   - Mix uppercase, lowercase, numbers, symbols

2. **Secure storage:**
   - Don't email passwords with files
   - Use separate channels for password sharing
   - Store in encrypted folders

3. **Regular rotation:**
   - Change passwords periodically
   - Re-export with new passwords
   - Delete old files

### macOS Security

1. **FileVault encryption:**
   - System Preferences → Security & Privacy → FileVault
   - Turn on FileVault

2. **Firewall:**
   - System Preferences → Security & Privacy → Firewall
   - Turn on Firewall

3. **Gatekeeper:**
   - Keep Gatekeeper enabled
   - Only install apps from trusted sources

---

## Uninstallation

### Complete Removal

```bash
# Remove application
sudo rm -rf /Applications/Terminium.app

# Remove application data
rm -rf ~/Library/Application\ Support/Terminium
rm -rf ~/Library/Preferences/com.terminium.app.plist
rm -rf ~/Library/Caches/Terminium

# Remove logs
rm -rf ~/Library/Logs/Terminium
```

### Keep Settings

```bash
# Only remove application
sudo rm -rf /Applications/Terminium.app

# Settings remain in:
~/Library/Application Support/Terminium
```

---

## FAQ

### Q: Does Terminium support TouchID?
**A:** Not yet, but it's on the roadmap for future releases.

### Q: Can I use multiple windows?
**A:** Yes! File → New Window or `⌘+N`

### Q: Does it work on older macOS versions?
**A:** Terminium requires macOS 10.13 or later. For best experience, use macOS 12+.

### Q: Is it compatible with Apple Silicon?
**A:** Yes! Native ARM64 builds available for M1/M2/M3 Macs.

### Q: Can I sync connections across Macs?
**A:** Use ICMSF export/import to transfer connections manually. Cloud sync coming soon.

### Q: Does it support SFTP?
**A:** Not yet, planned for a future release.

### Q: Can I customize the theme?
**A:** Currently supports Dark theme. Light theme and custom themes coming soon.

---

## Getting Help

- **Documentation:** [docs/USER_GUIDE.md](USER_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/Terminium/issues)
- **Security:** Report vulnerabilities privately via email

---

## Version History

### v1.0.0 (Current)
- ✅ Initial macOS release
- ✅ SSH connection management
- ✅ ICMSF import/export
- ✅ Terminal emulation
- ✅ Dark theme

### Coming Soon
- SFTP file transfer
- Port forwarding
- Snippet library
- TouchID integration
- iCloud sync

---

**Enjoy using Terminium on macOS! 🚀**
