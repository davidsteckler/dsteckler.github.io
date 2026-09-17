#!/bin/bash
set -euo pipefail
umask 077
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SUPPORT="$HOME/Library/Application Support/AppleTVRemote"
DEST="$HOME/Applications/Apple TV Remote Zen.app"
VENV="$SUPPORT/zen-v4-venv"
STAGE=""
finish() {
  result=$?
  trap - EXIT
  if [[ -n "$STAGE" && -d "$STAGE" ]]; then rm -rf "$STAGE"; fi
  if [[ $result -ne 0 ]]; then
    echo
    echo "Installation stopped. Copy the error above if you need help."
    echo "Your original pairing file has not been changed."
  fi
  read -r -p "Press Return to close." || true
  exit "$result"
}
trap finish EXIT
if [[ "$(uname -s)" != Darwin ]]; then echo "Run this installer on your Mac."; exit 1; fi
if [[ ! -f "$SCRIPT_DIR/Sources/main.swift" || ! -f "$SCRIPT_DIR/Resources/backend.py" ]]; then
  echo "Extract the entire ZIP first. Keep Sources and Resources beside this installer."; exit 1
fi
if ! xcrun --find swiftc >/dev/null 2>&1; then
  echo "Apple Command Line Tools are needed. Install them in the dialog, then run this installer again."
  xcode-select --install || true
  exit 1
fi
mkdir -p "$SUPPORT" "$HOME/Applications"
# Keep the old runtime untouched. Prefer its existing Python on this Mac.
if [[ ! -x "$VENV/bin/python3" ]]; then
  PYTHON=""
  for candidate in "$SUPPORT/venv/bin/python3" /opt/homebrew/bin/python3 /usr/local/bin/python3 /usr/bin/python3; do
    if [[ -x "$candidate" ]] && "$candidate" -c 'import sys; sys.exit(not ((3,9) <= sys.version_info[:2] <= (3,13)))' 2>/dev/null; then
      PYTHON="$candidate"; break
    fi
  done
  if [[ -z "$PYTHON" ]]; then
    echo "Install Python 3.13 for macOS from https://www.python.org/downloads/macos/ and run this again."
    exit 1
  fi
  "$PYTHON" -m venv "$VENV"
fi
echo "Installing remote connection support…"
"$VENV/bin/python3" -m pip install --disable-pip-version-check 'pyatv==0.16.1'
"$VENV/bin/python3" -c 'import pyatv' 
STAGE="$(mktemp -d "$HOME/Applications/.zen-build.XXXXXX")"
APP="$STAGE/Apple TV Remote Zen.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
echo "Building Zen Remote for this Mac…"
SDK_PATH="$(xcrun --sdk macosx --show-sdk-path)"
MACOSX_DEPLOYMENT_TARGET=12.0 xcrun swiftc -swift-version 5 -O -sdk "$SDK_PATH" -framework Cocoa \
  "$SCRIPT_DIR/Sources/main.swift" -o "$APP/Contents/MacOS/AppleTVRemoteZen"
cp "$SCRIPT_DIR/Resources/backend.py" "$APP/Contents/Resources/backend.py"
cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleDisplayName</key><string>Zen Remote</string>
<key>CFBundleExecutable</key><string>AppleTVRemoteZen</string>
<key>CFBundleIdentifier</key><string>com.david.appletvremotezen</string>
<key>CFBundleName</key><string>Apple TV Remote Zen</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>4.1</string>
<key>CFBundleVersion</key><string>5</string>
<key>LSMinimumSystemVersion</key><string>12.0</string>
<key>NSHighResolutionCapable</key><true/>
<key>NSLocalNetworkUsageDescription</key><string>Find and control your Apple TV on your home network.</string>
<key>NSBonjourServices</key><array><string>_mediaremotetv._tcp</string><string>_companion-link._tcp</string><string>_airplay._tcp</string><string>_raop._tcp</string><string>_appletv-v2._tcp</string><string>_touch-able._tcp</string></array>
</dict></plist>
PLIST
plutil -lint "$APP/Contents/Info.plist"
codesign --force --deep --sign - "$APP"
BACKUP=""
if [[ -d "$DEST" ]]; then
  BACKUP="$HOME/Applications/Apple TV Remote Zen Backup $(date +%Y%m%d-%H%M%S).app"
  mv "$DEST" "$BACKUP"
fi
if ! mv "$APP" "$DEST"; then
  if [[ -n "$BACKUP" ]]; then mv "$BACKUP" "$DEST"; fi
  exit 1
fi
echo "Installed: $DEST"
echo "Close any older Remote window. The new version has Find TVs and Pair / Repair."
open -n "$DEST"
