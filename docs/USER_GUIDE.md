# Terminium User Guide

## First-Time Setup

### Option 1: New Server Connection

1. **Launch Terminium** - Start the application
2. **Select "New Server Connection"**
3. **Create Credentials:**
   - Enter your username
   - Create a strong password (min 8 characters)
4. **Enter Server Details:**
   - Server IP address (e.g., 192.168.1.100)
   - SSH port (default: 22)
   - API port (default: 3000)
5. **Complete Setup** - Click "Complete Setup"

### Option 2: Import Connection File

1. **Launch Terminium**
2. **Select "Import Connection"**
3. **Choose your .icmsf file**
4. **Enter the file password**
5. **Connection imported!**

## Managing Connections

### Adding a New Connection

1. Click **"+ New Connection"** in the dashboard
2. Fill in connection details:
   - **Name:** Friendly name for this server
   - **Host:** IP address or hostname
   - **Port:** SSH port (usually 22)
   - **Username:** Your username on the remote server
   - **Authentication:** Choose password or private key
   - **Group:** Optional category for organization

3. Click **"Save Connection"**

### Connecting to a Server

1. Click on a connection card in the dashboard
2. Terminal window opens automatically
3. Start working!

### Deleting a Connection

1. Click the **×** button on a connection card
2. Confirm deletion

## Using the Terminal

### Basic Operations

- **Type commands** as you would in any terminal
- **Copy:** Select text (auto-copies on Linux/macOS) or Ctrl+C
- **Paste:** Right-click or Ctrl+V
- **Scroll:** Mouse wheel or trackpad
- **Clear:** Type `clear` or Ctrl+L

### Keyboard Shortcuts

- `Ctrl+C` - Interrupt current command
- `Ctrl+D` - End of file / exit
- `Ctrl+Z` - Suspend current process
- `Ctrl+L` - Clear screen
- `Ctrl+A` - Move to line start
- `Ctrl+E` - Move to line end

### Disconnecting

Click the **←** back button in the terminal header to disconnect and return to dashboard.

## Exporting Connection Files (ICMSF)

Share your server configuration securely:

1. **Navigate to Settings** (⚙️ icon)
2. Click **"Export Connection"**
3. Enter encryption password
4. Save `.icmsf` file
5. Share file with team members

**Security Note:** The password you set encrypts the entire file. Share the password through a separate secure channel.

## Settings

### Appearance

- **Theme:** Light or Dark mode
- **Font Size:** Terminal text size (8-24)
- **Font Family:** Monospace font for terminal

### Terminal

- **Cursor Style:** Block, Underline, or Bar
- **Cursor Blink:** Enable/disable blinking cursor
- **Scrollback Lines:** How many lines to keep in history (1000-50000)
- **Close on Exit:** Automatically close terminal when session ends

### Saving Settings

Click **"Save Settings"** to apply changes. Restart terminal sessions to see updates.

## ICMSF Files

### What is ICMSF?

ICMSF (Import Connection Mothership Server File) is Terminium's encrypted connection file format.

**Contains:**
- Server IP address
- Connection ports (SSH, API)
- Authentication certificates
- User credentials (encrypted)

**File extension:** `.icmsf`
**Encryption:** AES-256-GCM

### Importing ICMSF Files

1. Launch Terminium
2. Select **"Import Connection"** (or File > Import)
3. Select `.icmsf` file
4. Enter password
5. Connection details loaded!

### Exporting ICMSF Files

1. Settings > Export Connection
2. Configure connection details
3. Set strong password
4. Save file

### Best Practices

- **Strong passwords:** Min 12 characters, mixed case, numbers, symbols
- **Secure storage:** Keep `.icmsf` files in encrypted storage
- **Separate password sharing:** Don't email password with file
- **Regular rotation:** Update passwords periodically

## Tips & Tricks

### Connection Groups

Organize connections by environment:
- Production
- Staging
- Development
- Personal

### Multiple Sessions

Open multiple terminal windows to different servers simultaneously.

### Quick Connect

Double-click a connection card for instant connection.

### Search Connections

Use Ctrl+F (Cmd+F on Mac) to search connections by name or host.

## Troubleshooting

### Can't Connect to Server

1. **Check server is online:** `ping server-ip`
2. **Verify SSH is running:** On server, `sudo systemctl status sshd`
3. **Check credentials:** Ensure username/password or keys are correct
4. **Firewall:** Make sure port 22 is open

### Terminal Not Responding

1. Press **Ctrl+C** to interrupt
2. If frozen, disconnect and reconnect
3. Check server load: `top` or `htop`

### ICMSF Import Failed

- **Wrong password:** Double-check password
- **Corrupted file:** Try re-downloading
- **Old version:** Update Terminium to latest version

### Performance Issues

1. **Reduce scrollback:** Settings > Scrollback Lines > Lower value
2. **Disable cursor blink:** Settings > Cursor Blink > Off
3. **Check network:** Use `ping` to test latency

## Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Report bugs on GitHub
- **Community:** Join our Discord/Slack

## Security Best Practices

1. **Use SSH keys** instead of passwords when possible
2. **Rotate credentials** regularly
3. **Enable 2FA** on servers when available
4. **Keep Terminium updated** for latest security patches
5. **Encrypt disk** where Terminium stores data
6. **Use VPN** when connecting over public networks
