# GitHub Actions Workflows

Automated build workflows for Terminium cross-platform releases.

## 🚀 Available Workflows

### 1. Build macOS Client
**File**: `build-macos.yml`

**Builds**:
- Intel Macs (x64)
- Apple Silicon (ARM64) - M1/M2/M3
- Universal Binary (both architectures)

**Triggers**:
- On version tags: `v1.0.0`, `v1.1.0`, etc.
- Manual trigger from GitHub UI

**Outputs**:
- `Terminium-*-x64.dmg` (Intel)
- `Terminium-*-arm64.dmg` (Apple Silicon)
- `Terminium-*-universal.dmg` (Universal)
- ZIP versions of each

### 2. Build Windows Client
**File**: `build-windows.yml`

**Builds**:
- NSIS Installer (.exe)
- Portable version (.exe)

**Triggers**:
- On version tags
- Manual trigger

**Outputs**:
- `Terminium-Setup-*.exe` (Installer)
- `Terminium-*-portable.exe` (Portable)

### 3. Build Linux Client
**File**: `build-linux.yml`

**Builds**:
- AppImage (universal)
- Debian package (.deb)

**Triggers**:
- On version tags
- Manual trigger

**Outputs**:
- `Terminium-*.AppImage`
- `Terminium_*.deb`

---

## 📦 Creating a Release

### Automatic Release (Recommended)

1. **Update version in package.json**:
   ```bash
   cd client
   npm version patch  # 1.0.0 → 1.0.1
   # or
   npm version minor  # 1.0.0 → 1.1.0
   # or
   npm version major  # 1.0.0 → 2.0.0
   ```

2. **Commit and tag**:
   ```bash
   git add client/package.json
   git commit -m "chore: bump version to v1.0.1"
   git tag v1.0.1
   ```

3. **Push with tags**:
   ```bash
   git push origin main
   git push origin v1.0.1
   ```

4. **GitHub Actions automatically**:
   - ✅ Builds macOS (3 architectures)
   - ✅ Builds Windows (2 versions)
   - ✅ Builds Linux (2 formats)
   - ✅ Creates GitHub Release
   - ✅ Uploads all installers
   - ✅ Total: 7+ downloadable files

5. **Release is ready!**
   - Go to: `github.com/yourrepo/releases`
   - Download links available immediately

### Manual Trigger

If you want to build without creating a release:

1. Go to **Actions** tab on GitHub
2. Select workflow (e.g., "Build macOS Client")
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow** button

Artifacts will be available in the Actions run (30-day retention).

---

## ⏱️ Build Times

| Platform | Build Time | Artifact Size |
|----------|------------|---------------|
| macOS (x64) | ~5 min | ~180 MB |
| macOS (ARM64) | ~4 min | ~170 MB |
| macOS (Universal) | ~8 min | ~330 MB |
| Windows | ~6 min | ~150 MB |
| Linux | ~5 min | ~120 MB |

**Total time for all platforms**: ~15-20 minutes (parallel builds)

---

## 📋 Workflow Status

Check build status:
- GitHub repo → **Actions** tab
- Status badges (add to README):

```markdown
![macOS Build](https://github.com/yourusername/Terminium/actions/workflows/build-macos.yml/badge.svg)
![Windows Build](https://github.com/yourusername/Terminium/actions/workflows/build-windows.yml/badge.svg)
![Linux Build](https://github.com/yourusername/Terminium/actions/workflows/build-linux.yml/badge.svg)
```

---

## 🔐 Code Signing (Optional)

### macOS Code Signing

To enable automatic code signing and notarization:

1. **Get Apple Developer account** ($99/year)

2. **Export certificate**:
   - Keychain Access → Export certificate as .p12
   - Set a password

3. **Add GitHub Secrets**:
   Go to: Settings → Secrets and variables → Actions

   Add these secrets:
   - `APPLE_ID`: Your Apple ID email
   - `APPLE_ID_PASSWORD`: App-specific password
   - `APPLE_TEAM_ID`: Your team ID
   - `CSC_LINK`: Base64 of .p12 file
   - `CSC_KEY_PASSWORD`: .p12 password

   **Create CSC_LINK**:
   ```bash
   base64 -i certificate.p12 | pbcopy
   # Paste into GitHub Secret
   ```

4. **Update workflow** (add to build-macos.yml):
   ```yaml
   - name: Build DMG
     env:
       APPLE_ID: ${{ secrets.APPLE_ID }}
       APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
       APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
       CSC_LINK: ${{ secrets.CSC_LINK }}
       CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
     run: npm run dist:mac
   ```

### Windows Code Signing

1. **Get code signing certificate**

2. **Add GitHub Secrets**:
   - `WIN_CSC_LINK`: Base64 of .pfx file
   - `WIN_CSC_KEY_PASSWORD`: Certificate password

---

## 🐛 Troubleshooting

### Build Fails

**Check the logs**:
1. Actions tab → Failed workflow
2. Click on the job
3. Expand failed step
4. Review error messages

**Common issues**:

**"Module not found"**
- Solution: Run `npm ci` instead of `npm install`
- Already configured in workflows ✓

**"Permission denied"**
- Solution: Check file permissions in repo
- May need to update workflow permissions

**"Out of disk space"**
- Solution: GitHub runners have limited space
- Clean up unnecessary files in workflow

### Artifacts Not Uploading

**Check**:
1. File paths are correct
2. Files actually exist after build
3. GitHub token has proper permissions

**Fix**:
```yaml
- name: List files
  run: ls -R client/release/
```

### Release Not Created

**Requirements**:
- Must push a tag starting with `v`
- Tag must be on a commit
- Workflow must complete successfully

**Verify**:
```bash
git tag
git push origin v1.0.0
```

---

## 📊 Monitoring

### Build Notifications

GitHub automatically sends notifications for:
- ✅ Build success
- ❌ Build failure

**Configure**:
- Settings → Notifications
- Watch repository → Custom → Actions

### Build History

View all builds:
- Actions tab → Select workflow
- See: Success/Failure rate, Duration, Trends

---

## 🔄 Updating Workflows

### Add New Platform

1. Create new workflow file
2. Copy structure from existing workflow
3. Modify build commands
4. Test with manual trigger

### Modify Existing

1. Edit `.github/workflows/*.yml`
2. Commit and push
3. Workflow updates automatically

---

## 📖 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [electron-builder CI](https://www.electron.build/configuration/configuration)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## 💡 Best Practices

1. **Version tags**: Always use semantic versioning (v1.0.0)
2. **Test locally first**: `npm run dist` before pushing
3. **Check artifacts**: Download and test before releasing
4. **Keep secrets secure**: Never commit credentials
5. **Monitor builds**: Fix failures quickly
6. **Update dependencies**: Keep actions versions current

---

## 🎯 Quick Reference

**Create release**:
```bash
npm version patch && git push --follow-tags
```

**Manual build**:
GitHub → Actions → Select workflow → Run workflow

**Download artifacts**:
GitHub → Actions → Select run → Artifacts section

**View releases**:
`github.com/yourrepo/releases`

---

**Need help?** Check workflow logs or open an issue.
