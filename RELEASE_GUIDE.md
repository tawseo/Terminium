# 🚀 Terminium Release Guide

Complete guide for creating and publishing Terminium releases with GitHub Actions.

## Quick Release (2 Minutes)

```bash
# 1. Update version
cd client
npm version patch  # or minor/major

# 2. Commit and tag
git add .
git commit -m "chore: release v1.0.1"
git push origin main

# 3. Push tag (triggers builds)
git push --tags

# 4. Wait 15-20 minutes
# GitHub Actions builds everything automatically

# 5. Done! Check releases
# https://github.com/yourrepo/releases
```

## 📦 What Gets Built Automatically

When you push a version tag (e.g., `v1.0.0`), GitHub Actions automatically builds:

### macOS (3 builds)
- ✅ `Terminium-1.0.0-x64.dmg` - Intel Macs (~180 MB)
- ✅ `Terminium-1.0.0-arm64.dmg` - Apple Silicon M1/M2/M3 (~170 MB)
- ✅ `Terminium-1.0.0-universal.dmg` - Works on all Macs (~330 MB)
- ✅ ZIP versions of each

### Windows (2 builds)
- ✅ `Terminium-Setup-1.0.0.exe` - Installer (~150 MB)
- ✅ `Terminium-1.0.0-portable.exe` - Portable version

### Linux (2 builds)
- ✅ `Terminium-1.0.0.AppImage` - Universal Linux (~120 MB)
- ✅ `terminium_1.0.0_amd64.deb` - Debian/Ubuntu package

**Total**: 7+ downloadable files automatically created and uploaded!

## 📋 Step-by-Step Release Process

### 1. Prepare Release

**Update version**:
```bash
cd client

# For bug fixes (1.0.0 → 1.0.1)
npm version patch

# For new features (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git tag
- Updates `package-lock.json`

**Update changelog** (optional but recommended):
```bash
# Edit CHANGELOG.md
echo "## v1.0.1 - $(date +%Y-%m-%d)

### Added
- New feature X

### Fixed
- Bug Y
- Issue Z

### Changed
- Improved performance
" >> CHANGELOG.md
```

### 2. Commit Changes

```bash
git add client/package.json client/package-lock.json CHANGELOG.md
git commit -m "chore: release v1.0.1"
```

### 3. Tag Release

```bash
# Tag is already created by npm version
# Just push it
git push origin main
git push origin v1.0.1

# Or push all tags at once
git push --follow-tags
```

### 4. Monitor Build Progress

1. Go to your GitHub repository
2. Click **Actions** tab
3. You'll see 3 workflows running:
   - 🍎 Build macOS Client
   - 🪟 Build Windows Client
   - 🐧 Build Linux Client

**Build times**:
- Each workflow: 4-8 minutes
- Total (parallel): 15-20 minutes

### 5. Verify Release

Once all workflows complete:

1. Go to **Releases** tab
2. Click on your version (e.g., `v1.0.1`)
3. Verify all files are uploaded:
   ```
   Assets (7+)
   ├── Terminium-1.0.1-x64.dmg
   ├── Terminium-1.0.1-arm64.dmg
   ├── Terminium-1.0.1-universal.dmg
   ├── Terminium-Setup-1.0.1.exe
   ├── Terminium-1.0.1-portable.exe
   ├── Terminium-1.0.1.AppImage
   └── terminium_1.0.1_amd64.deb
   ```

### 6. Edit Release Notes

GitHub auto-creates the release, but you should add details:

1. Click **Edit** on the release
2. Add release notes:
   ```markdown
   ## Terminium v1.0.1

   ### 🎉 What's New
   - Feature A
   - Feature B

   ### 🐛 Bug Fixes
   - Fixed issue X
   - Fixed issue Y

   ### 📥 Downloads
   Choose the right version for your system:

   **macOS:**
   - Intel Macs: `Terminium-1.0.1-x64.dmg`
   - Apple Silicon (M1/M2/M3): `Terminium-1.0.1-arm64.dmg`
   - Universal (all Macs): `Terminium-1.0.1-universal.dmg`

   **Windows:**
   - Installer: `Terminium-Setup-1.0.1.exe`
   - Portable: `Terminium-1.0.1-portable.exe`

   **Linux:**
   - Universal: `Terminium-1.0.1.AppImage`
   - Debian/Ubuntu: `terminium_1.0.1_amd64.deb`

   ### 📖 Installation Guides
   - [macOS](docs/MACOS_INSTALLATION.md)
   - [Windows](docs/WINDOWS_INSTALLATION.md)
   - [Linux](docs/LINUX_INSTALLATION.md)
   ```

3. Click **Update release**

### 7. Announce Release

Share the news:
- Twitter/X: "Terminium v1.0.1 is out! 🚀 Download: [link]"
- Discord/Slack: Post in announcement channel
- Email: Notify your users
- Reddit: Post in relevant subreddits

## 🔄 Pre-release / Beta Testing

For beta versions:

```bash
# Create pre-release tag
npm version prerelease --preid=beta
# Creates: 1.0.1-beta.0

git push --follow-tags
```

Then:
1. Go to Releases
2. Edit the release
3. Check ✅ **"This is a pre-release"**
4. Users can opt-in to test

## 🐛 If Something Goes Wrong

### Build Fails

1. **Check workflow logs**:
   - Actions → Failed workflow → Click job → View errors

2. **Common fixes**:
   ```bash
   # Fix the issue locally
   cd client
   npm run build  # Test build
   npm run dist   # Test packaging

   # Push fix
   git add .
   git commit -m "fix: build issue"
   git push

   # Re-tag (delete old tag first)
   git tag -d v1.0.1
   git push origin :refs/tags/v1.0.1
   git tag v1.0.1
   git push --tags
   ```

### Missing Files in Release

1. **Check artifacts**:
   - Actions → Successful workflow → Scroll to Artifacts
   - Download and verify

2. **If artifacts exist but not in release**:
   - Workflow may have failed to upload
   - Check `softprops/action-gh-release` step logs
   - May need to manually upload from artifacts

### Wrong Version Number

```bash
# Delete tag locally and remotely
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1

# Delete release on GitHub
# (Releases → Edit → Delete)

# Fix version
cd client
npm version 1.0.2

# Push again
git push --follow-tags
```

## 📊 Monitoring Builds

### Add Status Badges

Add to README.md:

```markdown
![macOS Build](https://github.com/yourusername/Terminium/actions/workflows/build-macos.yml/badge.svg)
![Windows Build](https://github.com/yourusername/Terminium/actions/workflows/build-windows.yml/badge.svg)
![Linux Build](https://github.com/yourusername/Terminium/actions/workflows/build-linux.yml/badge.svg)
```

### Set Up Notifications

1. GitHub → Settings → Notifications
2. Enable: "Actions - Workflow run failures"
3. Get email when builds fail

## 🎯 Release Checklist

Before tagging:
- [ ] All tests pass locally
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if needed)
- [ ] Documentation updated
- [ ] No uncommitted changes

After tagging:
- [ ] All workflows succeed (check Actions tab)
- [ ] All files uploaded to release
- [ ] Download and test each platform
- [ ] Release notes added
- [ ] Announcement posted

## 📅 Release Schedule (Recommended)

### Patch Releases (1.0.x)
- **Frequency**: Every 2-4 weeks
- **Contains**: Bug fixes, minor improvements
- **Example**: v1.0.1, v1.0.2

### Minor Releases (1.x.0)
- **Frequency**: Every 2-3 months
- **Contains**: New features, enhancements
- **Example**: v1.1.0, v1.2.0

### Major Releases (x.0.0)
- **Frequency**: Once or twice a year
- **Contains**: Breaking changes, major features
- **Example**: v2.0.0, v3.0.0

## 🔐 Code Signing (Optional)

For production releases, consider code signing:

### macOS
- Requires: Apple Developer account ($99/year)
- Removes: "Unidentified developer" warning
- Process: See [MACOS_BUILD.md](docs/MACOS_BUILD.md)

### Windows
- Requires: Code signing certificate (~$100-300/year)
- Removes: SmartScreen warning
- Providers: DigiCert, Sectigo, SSL.com

## 💡 Tips

1. **Test locally first**:
   ```bash
   npm run dist:mac    # Test before releasing
   ```

2. **Use semantic versioning**:
   - MAJOR.MINOR.PATCH
   - Breaking.Features.Fixes

3. **Keep changelogs**:
   - Users appreciate knowing what changed

4. **Test on real machines**:
   - Download artifacts and test
   - Don't just trust CI

5. **Backup old releases**:
   - Don't delete old versions
   - Users may need to downgrade

## 🚀 Advanced: Automated Releases

For fully automated releases:

1. Use Conventional Commits
2. Use semantic-release
3. Auto-generate CHANGELOG
4. Auto-bump version
5. Auto-create release

See: [semantic-release](https://github.com/semantic-release/semantic-release)

---

## 📞 Need Help?

- **Build issues**: Check workflow logs
- **Questions**: Open GitHub issue
- **Community**: Join Discord/Slack

---

**Happy releasing! 🎉**
