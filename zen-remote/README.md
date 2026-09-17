# Zen Remote 4.1 — Apple TV remote for your Mac

## Install

1. Quit the old Remote app.
2. Extract the entire ZIP. Keep `Sources` and `Resources` inside the `Zen-Remote-4` folder.
3. Open `Install Zen Remote.command`. If macOS blocks this locally built installer, use System Settings → Privacy & Security → Open Anyway after attempting to open it. If it has lost its executable permission, open Terminal, type `bash `, drag the installer into Terminal, and press Return.
4. The installer builds and opens **Apple TV Remote Zen** in your home Applications folder. Allow local network access when asked.

Requires macOS 12 or later, Apple Command Line Tools, Python 3.9–3.13, and internet during installation. The installer can reuse the Python from the old app to create a separate runtime. If Command Line Tools are missing, it opens Apple's installation prompt; rerun after they finish. If Python is missing, install Python 3.13 from https://www.python.org/downloads/macos/ and rerun.

The app is compiled on your Mac for its processor. This ZIP contains source and an installer, not a precompiled or Apple-notarized app. No administrator password is used by this installer; Apple's own prerequisite installers may request one.

## Connect without a physical Apple TV remote

Turn on your television and select the Apple TV HDMI input so you can see pairing codes.

1. **Find TVs** scans your home network. Select your Apple TV from the list.
2. Try **Connect** to reuse saved pairing. On later launches the app tries the last successfully connected TV automatically.
3. If pairing is needed or the old credentials stopped working, choose **Pair / Repair**. Enter the four-digit code shown on your TV. A second code may follow for additional controls; enter that too.
4. Once connected, use the directional pad or your keyboard.

### If Game Room does not appear

- Verify that your Mac and Apple TV are connected to the same home network; guest networks often isolate devices. Temporarily disconnect a VPN while testing.
- If your version of macOS offers it, check System Settings → Privacy & Security → Local Network for the app (or Python, if macOS lists the helper separately).
- Look in your router's connected-device list for the Apple TV's IP address. Enter it into **Apple TV IP**, then click **Find TVs** or **Connect**. Direct IP discovery can help when multicast discovery fails, but still needs network access to the TV.
- If asleep and undiscoverable, briefly disconnect and reconnect Apple TV power, wait for it to start, then scan again. You do not need a physical Apple TV remote for this step.
- If the Apple TV has not joined your current network, the Mac app cannot configure Wi-Fi until it can reach the device. Ethernet on supported Apple TVs, an iPhone's Apple TV Remote, or an HDMI-CEC TV remote may provide a way to get it online. First-time setup and older Apple TV models may still need another input device.

The app identifies devices by their saved identifiers and rediscovers their address when connecting. It does not silently connect to another TV that takes over the old IP. If the connection drops, press **Connect**. Failed button presses are not replayed automatically.

## Controls

- Click arrows and **OK**; swipe across the pad for a single directional step. Scroll for rate-limited navigation.
- Click the pad to focus keyboard control: arrow keys navigate, Return selects, Escape goes back, Space plays/pauses. Keyboard shortcuts are active while the pad has focus, so typing into a text field stays local.
- **Home**, **Hold Home**, playback skipping, volume, **Wake**, and **Sleep** are available where the device supports them.
- Select a search/text field on the TV, type into the Mac's text box, then **Send Text**. It appends text and clears the Mac field only after success. App support varies; use an on-screen keyboard when text input is unsupported.
- **Load Apps**, select an app, then **Open** to launch it.
- **Restart Service** restarts the connection helper if it stops.

Volume and television power depend on the Apple TV, audio route, and HDMI-CEC configuration. The Mac does not have an infrared transmitter; this cannot replace an IR-only volume remote. Siri voice input is not included.

## What changed from V3

- Device selection and direct IPv4 discovery replace exact-name-only connection.
- Pairing is built into the app; it no longer requires an earlier app's First-Time Setup.
- Saved-device restoration and stable identity matching survive renames and IP changes.
- Commands run in order. Stale navigation is discarded instead of piling up during a slow connection.
- Connection errors and unsupported controls produce different messages. A successful AirPlay-only connection is not presented as working navigation.
- Volume uses the audio API; text entry and app launching have visible controls.
- Installer builds before replacing the old app, keeps a timestamped backup, and uses a separate Python environment with pyatv pinned to 0.16.1.

## Your existing pairing and rollback

The first launch copies `~/Library/Application Support/AppleTVRemote/pyatv.conf` into `zen-v4.conf` if the new file does not exist. The original pairing file and old Python environment are left intact. New credentials stay in `zen-v4.conf`; device selection stays in `zen-device.json`. These files are local to your Mac. Do not send pairing files or codes when asking for help.

To return to the previous app, quit V4 and open the timestamped **Apple TV Remote Zen Backup …** app in your home Applications folder. V4 does not delete it.

## Validation and limits

The included 19 automated backend tests pass against pyatv 0.16.1. They cover direct IP discovery, device identity after IP changes, duplicate names, pairing prompts, two-protocol pairing and credential persistence, preserving old credentials, unsupported navigation, command timeouts without replay, volume/text interfaces, cancellation, invalid addresses, corrupt storage, invalid PIN retries, pairing timeout cleanup, switching TVs, and late callbacks from old connections. Network/device calls are simulated; file storage uses the real library. Installer shell syntax was checked.

This build was prepared in Linux. The AppKit interface could not be compiled or visually tested here, and live discovery, pairing, and control still require testing with your Mac and Apple TV. The installer compiles the interface on your Mac and prints any error before replacing the installed app.

Developer test command, with the pinned dependency installed:

```
python3 -m unittest discover -s Tests -v
```

API references: [Discovery and pairing](https://pyatv.dev/development/scan_pair_and_connect/), [credential storage](https://pyatv.dev/development/storage/), [audio controls](https://pyatv.dev/development/audio/).
