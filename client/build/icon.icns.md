# macOS Icon Generation

To create the `.icns` icon file for macOS:

## Requirements

- macOS with iconutil (built-in)
- PNG source image (1024x1024px minimum)

## Steps

1. Create an icon set folder:
```bash
mkdir Terminium.iconset
```

2. Create required icon sizes:
```bash
# From your source image (icon.png)
sips -z 16 16     icon.png --out Terminium.iconset/icon_16x16.png
sips -z 32 32     icon.png --out Terminium.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out Terminium.iconset/icon_32x32.png
sips -z 64 64     icon.png --out Terminium.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out Terminium.iconset/icon_128x128.png
sips -z 256 256   icon.png --out Terminium.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out Terminium.iconset/icon_256x256.png
sips -z 512 512   icon.png --out Terminium.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out Terminium.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out Terminium.iconset/icon_512x512@2x.png
```

3. Convert to .icns:
```bash
iconutil -c icns Terminium.iconset
```

4. Place in build directory:
```bash
mv Terminium.icns client/assets/icon.icns
```

## Placeholder

Until you create a proper icon, electron-builder will use a default icon.

Recommended design:
- Terminal/console theme
- Blue/cyan colors (matching Terminium brand)
- Simple, recognizable at small sizes
- Works on both light and dark backgrounds
