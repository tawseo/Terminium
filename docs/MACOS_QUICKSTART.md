# Terminium for macOS - Quick Start

Get up and running with Terminium on your Mac in 5 minutes.

## 📥 Installation (2 minutes)

### Step 1: Download
1. Download latest release for your Mac:
   - **Intel Mac**: `Terminium-1.0.0-x64.dmg`
   - **Apple Silicon (M1/M2/M3)**: `Terminium-1.0.0-arm64.dmg`
   - **Universal (works on both)**: `Terminium-1.0.0-universal.dmg`

   **Don't know which Mac you have?**
   - Click  → About This Mac
   - Check "Chip" or "Processor"

### Step 2: Install
1. Open the `.dmg` file
2. Drag Terminium to Applications folder
3. Eject the DMG

### Step 3: Open
1. Go to Applications
2. Double-click Terminium
3. If you see security warning:
   - System Preferences → Security & Privacy
   - Click "Open Anyway"

**Done!** Terminium is now running.

## ⚡ First Connection (3 minutes)

### New Server Setup

**When Terminium opens:**

1. **Click "New Server Connection"**

2. **Create account:**
   - Username: `yourusername`
   - Password: `YourStrongPassword123!` (min 12 chars)
   - Click Next

3. **Enter server details:**
   - Server IP: Your server's IP address
   - SSH Port: `22`
   - API Port: `3000`
   - Click Complete Setup

4. **Add SSH connection:**
   - Click "+ New Connection"
   - Name: `My Server`
   - Host: Your server IP
   - Username: `root` (or your username)
   - Select "Private Key"
   - Paste your SSH private key
   - Click Save

5. **Connect:**
   - Click the connection card
   - Terminal opens!
   - Start typing commands

## 🔑 SSH Key Setup

**Don't have SSH keys? Generate them:**

```bash
# Open Terminal (⌘+Space, type "Terminal")
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter to accept defaults
# Set a passphrase (or leave empty)

# View your public key
cat ~/.ssh/id_ed25519.pub
```

**Copy public key to server:**

```bash
# From your Mac
ssh-copy-id username@your-server-ip

# Or manually:
cat ~/.ssh/id_ed25519.pub | ssh username@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Use private key in Terminium:**

```bash
# View private key
cat ~/.ssh/id_ed25519
```

Copy the entire output (including `-----BEGIN` and `-----END` lines) and paste into Terminium's "Private Key" field.

## 📝 Common Tasks

### Multiple Connections

1. Dashboard → "+ New Connection"
2. Fill in details
3. Save
4. Repeat for each server

### Organize Connections

Use the "Group" field:
- `Production`
- `Development`
- `Testing`
- `Personal`

### Export Connections

1. Settings (⚙️) → Export Connection
2. Enter password (min 12 chars)
3. Save `.icmsf` file
4. Share with team (send password separately!)

### Import on Another Mac

1. Dashboard → Import Connection
2. Select `.icmsf` file
3. Enter password
4. Done!

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘+N` | New connection |
| `⌘+T` | New terminal tab |
| `⌘+W` | Close tab/window |
| `⌘+C` | Copy (or Ctrl+C in terminal) |
| `⌘+V` | Paste |
| `⌘+F` | Find |
| `⌘+K` | Clear terminal |
| `⌘+,` | Settings |

## 🔧 Troubleshooting

### Can't open app

```bash
# Remove quarantine
sudo xattr -rd com.apple.quarantine /Applications/Terminium.app
```

### Connection refused

1. Check server is running
2. Check IP address is correct
3. Check port 22 is open
4. Try manually: `ssh user@server-ip`

### Permission denied

1. Verify SSH key is correct
2. Check key is on server:
   ```bash
   ssh user@server "cat ~/.ssh/authorized_keys"
   ```
3. Check key permissions:
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   ```

## 📚 Next Steps

- [Complete macOS Installation Guide](MACOS_INSTALLATION.md)
- [User Guide](USER_GUIDE.md)
- [Server Setup](../server/README.md)

## 💡 Tips

1. **Use SSH keys** instead of passwords
2. **Set passphrases** on private keys
3. **Backup `.icmsf`** files securely
4. **Enable FileVault** on your Mac
5. **Use groups** to organize servers

---

**Need help?** Open an issue on GitHub or check the full documentation.

**Enjoy Terminium! 🚀**
