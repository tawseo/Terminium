# Building Terminium DMG Files

## Quick Build Guide

### On macOS:

```bash
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Build for your Mac architecture
npm run dist:mac

# Or specific architectures:
npm run dist:mac:intel      # Intel Macs
npm run dist:mac:arm        # Apple Silicon (M1/M2/M3)
npm run dist:mac:universal  # Both architectures
```

### Build Output Location

After building, DMG files will be in:
```
client/release/
├── Terminium-1.0.0-mac.dmg          # Main DMG installer
├── Terminium-1.0.0-mac.zip          # ZIP version
├── Terminium-1.0.0-mac-arm64.dmg    # Apple Silicon (if built separately)
├── Terminium-1.0.0-x64.dmg          # Intel (if built separately)
└── mac/
    └── Terminium.app                # Application bundle
```

## If You Don't Have a Mac

### Option 1: Use GitHub Actions (Recommended)

1. **Push code to GitHub**:
   ```bash
   git push origin main
   ```

2. **Create a release**:
   ```bash
   git tag v1.0.0
   git push --tags
   ```

3. **GitHub Actions builds automatically** (if configured)
   - Builds all architectures
   - Uploads DMG files to release
   - Available for download

### Option 2: Use macOS Virtual Machine

**Using VirtualBox or VMware:**
- Install macOS VM (requires macOS host or special setup)
- Clone repository in VM
- Build inside VM

**Cloud macOS (paid services):**
- MacStadium
- AWS EC2 Mac instances
- MacinCloud

### Option 3: Use CI/CD Service

**Services that provide macOS builders:**
- GitHub Actions (free for public repos)
- CircleCI
- Travis CI
- GitLab CI

## Current Repository State

**What exists now:**
- ✅ Complete source code
- ✅ Build configuration (package.json)
- ✅ macOS entitlements
- ✅ Notarization scripts
- ✅ Documentation

**What needs to be created:**
- ⏳ DMG files (run build command)
- ⏳ App icons (optional, will use default)
- ⏳ DMG background (optional, will use default)

## Building Without macOS (Alternative)

If you only want to test the app without creating DMG:

```bash
# On any platform (Windows/Linux/Mac)
cd client
npm install
npm run dev
```

This opens Terminium in development mode (no DMG needed).

## Quick Start (macOS)

```bash
# Clone repo
git clone https://github.com/yourusername/Terminium.git
cd Terminium/client

# Install
npm install

# Build DMG (takes 2-5 minutes)
npm run dist:mac

# Find DMG
ls -lh release/*.dmg

# Install
open release/Terminium-*.dmg
```

## Expected Build Time

- **Intel Mac**: 3-5 minutes
- **Apple Silicon**: 2-4 minutes
- **Universal**: 5-8 minutes (builds both)

## Build Output

**File sizes:**
- Intel DMG: ~150-200 MB
- ARM DMG: ~140-190 MB
- Universal DMG: ~280-380 MB

## Troubleshooting

**"electron-builder not found":**
```bash
npm install --save-dev electron-builder
```

**"Cannot find module":**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Permission denied":**
```bash
sudo chown -R $USER:$USER .
```

## Next Steps After Building

1. **Test the DMG:**
   - Mount it: `open release/Terminium-*.dmg`
   - Drag to Applications
   - Test launching

2. **Share the DMG:**
   - Upload to GitHub Releases
   - Host on your server
   - Share download link

3. **Sign & Notarize (optional):**
   - See [MACOS_BUILD.md](../docs/MACOS_BUILD.md)
   - Requires Apple Developer account
   - Removes security warnings

## Where to Download (After Release)

**Once built and released:**
- GitHub Releases page
- Your website
- Direct download link

**Example:**
```
https://github.com/yourusername/Terminium/releases/download/v1.0.0/Terminium-1.0.0-mac.dmg
```
