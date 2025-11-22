# Terminium Client

Cross-platform desktop SSH client for Terminium.

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
```

### Run Development Mode
```bash
npm run dev
```

This starts:
- Vite dev server (React UI) on port 3001
- Electron in development mode

### Build
```bash
npm run build
```

### Create Distributables
```bash
# All platforms (requires platform-specific tools)
npm run dist

# Specific platforms
npm run dist:mac
npm run dist:win
npm run dist:linux
```

## Project Structure

```
client/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # App entry point
│   │   ├── preload.ts     # IPC bridge
│   │   ├── ssh-manager.ts # SSH connections
│   │   └── icmsf-manager.ts # ICMSF encryption
│   ├── renderer/          # React UI
│   │   ├── components/    # React components
│   │   ├── styles/        # Global styles
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # React entry point
│   └── types/             # TypeScript definitions
├── dist/                  # Build output
├── release/               # Distributables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Technologies

- **Electron:** Desktop app framework
- **React:** UI library
- **TypeScript:** Type safety
- **Vite:** Build tool
- **xterm.js:** Terminal emulation
- **ssh2:** SSH protocol
- **styled-components:** Component styling

## Components

### Main Process
- **index.ts:** Application lifecycle, window management
- **ssh-manager.ts:** SSH connection handling
- **icmsf-manager.ts:** File encryption/decryption
- **preload.ts:** Secure IPC communication

### Renderer Process
- **FirstRunSetup:** Initial setup wizard
- **Dashboard:** Connection management
- **Terminal:** SSH terminal interface
- **ConnectionCard:** Connection display
- **NewConnectionModal:** Add connection form
- **Settings:** Application settings

## IPC API

Communication between renderer and main process:

```typescript
window.terminium = {
  connection: {
    save: (connection) => Promise<{success: boolean}>
    list: () => Promise<SSHConnection[]>
    delete: (id) => Promise<{success: boolean}>
  },
  ssh: {
    connect: (connection) => Promise<{success, sessionId?, error?}>
    write: (sessionId, data) => Promise<{success, error?}>
    resize: (sessionId, cols, rows) => Promise<{success, error?}>
    disconnect: (sessionId) => Promise<{success, error?}>
    onData: (callback) => void
  },
  icmsf: {
    export: (data, password) => Promise<{success, filePath?, error?}>
    import: (password) => Promise<{success, data?, error?}>
  },
  settings: {
    get: () => Promise<AppSettings>
    set: (settings) => Promise<{success: boolean}>
  },
  app: {
    isFirstRun: () => Promise<boolean>
    completeSetup: () => Promise<{success: boolean}>
  }
}
```

## Styling

Using styled-components with dark theme (Tokyo Night colors):

```typescript
const Button = styled.button`
  background: #7aa2f7;
  color: #1a1b26;
  border-radius: 6px;
  padding: 10px 20px;
  // ...
`;
```

## Terminal Configuration

xterm.js with custom theme matching UI:

```typescript
const term = new XTerm({
  theme: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    // Tokyo Night colors
  },
  fontSize: 14,
  fontFamily: 'Monaco, Menlo, Consolas, monospace',
  cursorBlink: true,
  scrollback: 10000,
});
```

## Building for Distribution

### macOS
```bash
npm run dist:mac
```

Creates:
- `Terminium.dmg` - Disk image
- `Terminium.app.zip` - Zipped app

Requirements:
- macOS for building
- Apple Developer ID for signing (optional)

### Windows
```bash
npm run dist:win
```

Creates:
- `Terminium Setup.exe` - Installer
- `Terminium Portable.exe` - Portable version

Can build from any platform.

### Linux
```bash
npm run dist:linux
```

Creates:
- `Terminium.AppImage` - Universal Linux binary
- `terminium.deb` - Debian/Ubuntu package

## Code Signing

### macOS
Set environment variables:
```bash
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
```

### Windows
Configure in `package.json`:
```json
{
  "build": {
    "win": {
      "certificateFile": "cert.pfx",
      "certificatePassword": "password"
    }
  }
}
```

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Debugging

### Main Process
```bash
# Enable DevTools
export ELECTRON_ENABLE_LOGGING=1
npm run dev
```

View logs in terminal.

### Renderer Process
DevTools automatically open in development mode.

## Performance

### Optimization Tips
- Use React.memo for expensive components
- Virtualize long lists
- Lazy load routes
- Minimize bundle size

### Bundle Analysis
```bash
npm run build
npx vite-bundle-visualizer
```

## Common Issues

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
- Ensure all dependencies installed
- Check Node.js version (18+)
- Clear dist folder: `rm -rf dist`

### Electron Won't Start
- Check main process logs
- Verify preload script path
- Check for syntax errors in main process

## Release Checklist

- [ ] Update version in package.json
- [ ] Test on all platforms
- [ ] Build distributables
- [ ] Test installers
- [ ] Create GitHub release
- [ ] Upload build artifacts
- [ ] Update documentation

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## License

MIT License - See [LICENSE](../LICENSE)
