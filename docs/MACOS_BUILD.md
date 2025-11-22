# Building Terminium for macOS

Developer guide for building and distributing Terminium on macOS.

## Prerequisites

### Required Software

1. **macOS**: 10.15 (Catalina) or later
2. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

3. **Node.js** 18+:
   ```bash
   # Using Homebrew
   brew install node@18

   # Or download from nodejs.org
   ```

4. **npm** 9+: (comes with Node.js)

### Optional (For Distribution)

- **Apple Developer Account** ($99/year)
  - Required for code signing
  - Required for notarization
  - Required for App Store distribution

## Quick Build

### Development Build

```bash
cd client
npm install
npm run dev
```

This opens Terminium in development mode with hot reload.

### Production Build

```bash
npm run build
```

Creates optimized production files in `dist/`

### Create Distributable

```bash
# All architectures (Universal, Intel, ARM)
npm run dist:mac

# Intel only
npm run dist:mac:intel

# Apple Silicon only (M1/M2/M3)
npm run dist:mac:arm

# Universal (both Intel and ARM)
npm run dist:mac:universal
```

**Output**: `release/` directory containing:
- `Terminium-1.0.0-mac.dmg` - Installer
- `Terminium-1.0.0-mac.zip` - Portable version
- `mac/Terminium.app` - Application bundle

## Build Architecture Guide

### Intel Macs (x64)

```bash
npm run dist:mac:intel
```

**Produces**:
- `Terminium-1.0.0-x64.dmg`
- Works on: All Intel Macs

**File size**: ~150-200MB

### Apple Silicon (ARM64)

```bash
npm run dist:mac:arm
```

**Produces**:
- `Terminium-1.0.0-arm64.dmg`
- Works on: M1/M2/M3 Macs

**File size**: ~140-190MB
**Performance**: 10-15% faster than x64 on Apple Silicon

### Universal Binary

```bash
npm run dist:mac:universal
```

**Produces**:
- `Terminium-1.0.0-universal.dmg`
- Works on: All Macs (Intel + Apple Silicon)

**File size**: ~280-380MB (combines both architectures)

**When to use**:
- ✅ Single download for all users
- ✅ Professional distribution
- ❌ Larger file size

**When to use separate builds**:
- ✅ Smaller downloads
- ✅ Faster CI/CD builds
- ✅ Architecture-specific optimizations

## Code Signing (Optional but Recommended)

### Why Code Sign?

- ✅ Removes "unidentified developer" warning
- ✅ Users can open without security overrides
- ✅ Required for App Store
- ✅ Required for notarization
- ✅ Professional distribution

### Prerequisites

1. **Apple Developer Account**
2. **Developer ID Certificate**:
   - Log in to [developer.apple.com](https://developer.apple.com)
   - Certificates, IDs & Profiles
   - Create "Developer ID Application" certificate
   - Download and install in Keychain

### Sign the App

#### Automatic (Recommended)

electron-builder signs automatically if it finds your certificate.

**Verify certificates**:
```bash
security find-identity -v -p codesigning
```

You should see:
```
1) XXXXXXXXXX "Developer ID Application: Your Name (TEAM_ID)"
```

#### Manual Signing

```bash
# After building
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  release/mac/Terminium.app

# Verify
codesign --verify --deep --strict --verbose=2 \
  release/mac/Terminium.app
```

### Environment Variables

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
export APPLE_TEAM_ID="YOUR_TEAM_ID"
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"
```

Then:
```bash
source ~/.zshrc
npm run dist:mac
```

## Notarization (For Distribution)

### What is Notarization?

Apple's automated security scan:
- Required for macOS 10.15+
- Scans for malware
- Allows app to run without warnings
- Takes 5-30 minutes

### Setup

1. **Create App-Specific Password**:
   - Go to [appleid.apple.com](https://appleid.apple.com)
   - Sign In → App-Specific Passwords
   - Generate password
   - Save it securely

2. **Set Environment Variables**:
   ```bash
   export APPLE_ID="your@email.com"
   export APPLE_ID_PASSWORD="xxxx-xxxx-xxxx-xxxx"
   export APPLE_TEAM_ID="XXXXXXXXXX"
   ```

3. **Install Notarization Package**:
   ```bash
   npm install --save-dev @electron/notarize
   ```

4. **Update package.json**:
   ```json
   {
     "build": {
       "afterSign": "build/notarize.js"
     }
   }
   ```

### Notarize

```bash
npm run dist:mac
```

electron-builder will:
1. Build app
2. Sign app
3. Upload to Apple for notarization
4. Wait for approval (~5-30 min)
5. Staple notarization ticket to app
6. Create final DMG

**Check status**:
```bash
xcrun notarytool history \
  --apple-id "your@email.com" \
  --password "xxxx-xxxx-xxxx-xxxx" \
  --team-id "XXXXXXXXXX"
```

**Manual notarization**:
```bash
# Submit
xcrun notarytool submit release/Terminium-1.0.0-mac.dmg \
  --apple-id "your@email.com" \
  --password "xxxx-xxxx-xxxx-xxxx" \
  --team-id "XXXXXXXXXX" \
  --wait

# Staple ticket
xcrun stapler staple release/mac/Terminium.app
```

## DMG Customization

### Background Image

Create `client/assets/dmg-background.png`:
- Size: 540x380px
- Format: PNG
- Content: Branded background with installation instructions

**Template**:
```
┌─────────────────────────────────┐
│                                 │
│    [Terminium Icon]             │
│           ↓                     │
│    Drag to Applications         │
│                                 │
│                [Applications]   │
└─────────────────────────────────┘
```

### Icon

1. Create 1024x1024px PNG icon
2. Convert to .icns:
   ```bash
   # See client/build/icon.icns.md
   ```

## Troubleshooting

### "No identity found" Error

**Problem**: No signing certificate found

**Solution**:
```bash
# Check certificates
security find-identity -v -p codesigning

# Import certificate (if you have .p12 file)
security import certificate.p12 -k ~/Library/Keychains/login.keychain
```

### "App is damaged" on First Launch

**Problem**: Quarantine attribute from download

**Solution**:
```bash
xattr -cr /Applications/Terminium.app
```

### Notarization Fails

**Check logs**:
```bash
xcrun notarytool log <submission-id> \
  --apple-id "your@email.com" \
  --password "xxxx-xxxx-xxxx-xxxx" \
  --team-id "XXXXXXXXXX"
```

**Common issues**:
- Missing entitlements
- Unsigned frameworks
- Hardened runtime not enabled

### Build Fails on Apple Silicon

**Problem**: Native modules not compiled for ARM

**Solution**:
```bash
# Rebuild native modules
npm rebuild --arch=arm64

# Or clean install
rm -rf node_modules package-lock.json
npm install
```

### Universal Build Too Large

**Problem**: >500MB DMG file

**Solutions**:
1. Build separate Intel/ARM versions
2. Exclude unnecessary node_modules:
   ```json
   {
     "build": {
       "files": [
         "!node_modules/large-package/**/*"
       ]
     }
   }
   ```

## Performance Optimization

### Build Time

**Slow builds?**

1. **Use architecture-specific builds**:
   ```bash
   npm run dist:mac:arm  # Instead of universal
   ```

2. **Skip notarization in development**:
   ```bash
   unset APPLE_ID
   npm run dist:mac
   ```

3. **Parallel builds**:
   ```bash
   npm run build && \
   electron-builder --mac --x64 & \
   electron-builder --mac --arm64 &
   wait
   ```

### App Size

**Reduce DMG size**:

1. **Exclude dev dependencies**:
   - Already done in package.json

2. **Compress better**:
   ```json
   {
     "dmg": {
       "compression": "store"  // or "normal"
     }
   }
   ```

3. **Prune node_modules**:
   ```bash
   npm prune --production
   ```

## CI/CD (GitHub Actions)

### macOS Build Workflow

`.github/workflows/build-mac.yml`:

```yaml
name: Build macOS

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: |
          cd client
          npm ci

      - name: Build
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
        run: |
          cd client
          npm run dist:mac:universal

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: macos-builds
          path: client/release/*.dmg

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: client/release/*.dmg
```

**Secrets to set**:
- `APPLE_ID`
- `APPLE_ID_PASSWORD`
- `APPLE_TEAM_ID`
- `CSC_LINK`: Base64 of .p12 certificate
- `CSC_KEY_PASSWORD`: Certificate password

## Testing

### Pre-release Checklist

- [ ] Build completes without errors
- [ ] App launches on fresh macOS install
- [ ] SSH connections work
- [ ] ICMSF import/export works
- [ ] Settings persist
- [ ] No console errors
- [ ] Dark mode works
- [ ] Tested on Intel Mac
- [ ] Tested on Apple Silicon Mac
- [ ] Code signed (no warnings)
- [ ] Notarized (if distributing)

### Beta Testing

1. **TestFlight** (App Store only):
   - Requires App Store build
   - External testing up to 10,000 users

2. **Direct Distribution**:
   - Share DMG directly
   - Request feedback via GitHub issues
   - Track crashes with Sentry

### Version Numbers

Follow semantic versioning:
- `1.0.0` - Major release
- `1.1.0` - Minor update (new features)
- `1.1.1` - Patch (bug fixes)

**Update**:
```bash
cd client
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## Distribution Channels

### 1. GitHub Releases (Recommended)

**Pros**:
- Free
- Direct control
- Fast updates
- No review process

**Steps**:
1. Tag release: `git tag v1.0.0`
2. Push: `git push --tags`
3. GitHub Actions builds automatically
4. Release created with DMG attached

### 2. Mac App Store

**Pros**:
- Trusted platform
- Automatic updates
- Wider reach

**Cons**:
- $99/year
- Review process (1-7 days)
- Sandboxing requirements
- More restrictions

**Requirements**:
- App Store certificate
- App Store provisioning profile
- Sandbox entitlements
- Different build target

### 3. Homebrew Cask

**Pros**:
- Popular with developers
- Easy updates
- Command-line install

**Steps**:
1. Release on GitHub
2. Create Homebrew formula
3. Submit PR to homebrew-cask

**Future**:
```bash
brew install --cask terminium
```

## Support

- **Build Issues**: Check GitHub Issues
- **Code Signing**: Apple Developer Forums
- **Notarization**: Apple Developer Support

---

**Happy building! 🚀**
