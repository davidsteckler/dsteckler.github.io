import Cocoa

final class BackendController {
    var onEvent: (([String: Any]) -> Void)?
    private var process: Process?
    private var input: FileHandle?
    private var output: FileHandle?
    private var errors: FileHandle?
    private var buffer = Data()
    private var generation = UUID()

    func start() {
        stop()
        let token = UUID(); generation = token
        let support = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library/Application Support/AppleTVRemote")
        let python = support.appendingPathComponent("zen-v4-venv/bin/python3")
        guard let backend = Bundle.main.resourceURL?.appendingPathComponent("backend.py"),
              FileManager.default.isExecutableFile(atPath: python.path) else {
            onEvent?(["type": "error", "message": "Run Install Zen Remote.command from the downloaded folder first."]); return
        }
        let p = Process(), stdinPipe = Pipe(), stdoutPipe = Pipe(), stderrPipe = Pipe()
        p.executableURL = python; p.arguments = ["-u", backend.path]
        p.standardInput = stdinPipe; p.standardOutput = stdoutPipe; p.standardError = stderrPipe
        input = stdinPipe.fileHandleForWriting; output = stdoutPipe.fileHandleForReading
        errors = stderrPipe.fileHandleForReading; process = p
        output?.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            DispatchQueue.main.async {
                guard let self = self, self.generation == token else { return }
                self.consume(data)
            }
        }
        // Drain diagnostics separately so Python warnings cannot corrupt the JSON stream.
        errors?.readabilityHandler = { handle in _ = handle.availableData }
        p.terminationHandler = { [weak self] _ in
            DispatchQueue.main.async {
                guard let self = self, self.generation == token else { return }
                self.input = nil
                self.onEvent?(["type": "disconnected", "message": "Connection service stopped. Choose Restart Service below."])
            }
        }
        do { try p.run() }
        catch { onEvent?(["type": "error", "message": "Could not start: \(error.localizedDescription)"]) }
    }
    func stop() {
        generation = UUID()
        output?.readabilityHandler = nil; errors?.readabilityHandler = nil
        try? input?.close()
        if let p = process, p.isRunning { p.terminate() }
        process = nil; input = nil; output = nil; errors = nil; buffer.removeAll()
    }
    private func consume(_ data: Data) {
        guard !data.isEmpty else { return }
        buffer.append(data)
        while let range = buffer.firstRange(of: Data([10])) {
            let line = buffer.subdata(in: 0..<range.lowerBound)
            buffer.removeSubrange(0...range.lowerBound)
            if let object = (try? JSONSerialization.jsonObject(with: line)) as? [String: Any] { onEvent?(object) }
        }
    }
    func send(_ object: [String: Any]) {
        guard let input = input, var data = try? JSONSerialization.data(withJSONObject: object) else { return }
        data.append(10)
        do { try input.write(contentsOf: data) }
        catch { onEvent?(["type": "disconnected", "message": "Connection service unavailable. Choose Restart Service."]) }
    }
    func command(_ command: String) { send(["command": command]) }
}

final class NavigationPad: NSView {
    var send: ((String) -> Void)?
    var enabled = false { didSet { needsDisplay = true } }
    private var origin = NSPoint.zero
    private var lastScroll = Date.distantPast
    override var acceptsFirstResponder: Bool { true }
    override func draw(_ rect: NSRect) {
        NSColor.controlBackgroundColor.setFill()
        NSBezierPath(roundedRect: bounds, xRadius: 22, yRadius: 22).fill()
        let labels: [(String, CGFloat, CGFloat)] = [("▲",0.5,0.83),("▼",0.5,0.17),("◀",0.17,0.5),("▶",0.83,0.5),("OK",0.5,0.5)]
        for (text,x,y) in labels {
            let attrs: [NSAttributedString.Key: Any] = [.font:NSFont.systemFont(ofSize: 20, weight: .medium), .foregroundColor:enabled ? NSColor.labelColor : NSColor.disabledControlTextColor]
            let size = text.size(withAttributes: attrs)
            text.draw(at:NSPoint(x:bounds.width*x-size.width/2,y:bounds.height*y-size.height/2),withAttributes:attrs)
        }
        if window?.firstResponder === self {
            NSColor.controlAccentColor.withAlphaComponent(0.65).setStroke()
            let ring = NSBezierPath(roundedRect: bounds.insetBy(dx:2,dy:2), xRadius:20,yRadius:20)
            ring.lineWidth = 2; ring.stroke()
        }
    }
    override func becomeFirstResponder() -> Bool { needsDisplay = true; return true }
    override func resignFirstResponder() -> Bool { needsDisplay = true; return true }
    override func mouseDown(with event: NSEvent) { window?.makeFirstResponder(self); origin = convert(event.locationInWindow, from:nil) }
    override func mouseUp(with event: NSEvent) {
        guard enabled else { return }
        let end = convert(event.locationInWindow, from:nil), dx = end.x-origin.x, dy = end.y-origin.y
        if hypot(dx,dy) > 20 { send?(abs(dx) > abs(dy) ? (dx > 0 ? "right":"left") : (dy > 0 ? "up":"down")); return }
        let x = end.x/bounds.width, y = end.y/bounds.height
        if y > 0.69 { send?("up") } else if y < 0.31 { send?("down") }
        else if x < 0.31 { send?("left") } else if x > 0.69 { send?("right") } else { send?("select") }
    }
    override func scrollWheel(with event:NSEvent) {
        guard enabled, Date().timeIntervalSince(lastScroll) > 0.14,
              abs(event.scrollingDeltaX)+abs(event.scrollingDeltaY) > 1 else { return }
        lastScroll = Date()
        send?(abs(event.scrollingDeltaX)>abs(event.scrollingDeltaY) ? (event.scrollingDeltaX>0 ? "left":"right") : (event.scrollingDeltaY>0 ? "up":"down"))
    }
    override func keyDown(with event:NSEvent) {
        guard enabled else { return }
        let map:[UInt16:String] = [123:"left",124:"right",125:"down",126:"up",36:"select",76:"select",53:"back",49:"play_pause"]
        if let cmd = map[event.keyCode] { send?(cmd) } else { super.keyDown(with:event) }
    }
}

final class AppDelegate:NSObject, NSApplicationDelegate {
    private var window:NSWindow!
    private let backend = BackendController()
    private let picker = NSPopUpButton(frame:.zero,pullsDown:false)
    private let host = NSTextField(string:"")
    private let status = NSTextField(wrappingLabelWithString:"Starting connection service…")
    private let textInput = NSTextField(string:"")
    private let pad = NavigationPad()
    private var devices = [[String:Any]]()
    private var savedTarget = [String:Any]()
    private var controlButtons = [NSButton]()
    private var connectionButtons = [NSButton]()
    private var connected = false
    private var pairing = false
    private var busy = false
    private var pinAlert:NSAlert?
    private let appsPicker = NSPopUpButton(frame:.zero,pullsDown:false)
    private var appIDs = [String]()

    func applicationDidFinishLaunching(_ notification:Notification) {
        buildUI()
        backend.onEvent = { [weak self] event in self?.event(event) }
        backend.start()
    }
    func applicationWillTerminate(_ notification:Notification) { backend.stop() }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender:NSApplication) -> Bool { true }

    private func button(_ title:String,_ command:String,control:Bool=false) -> NSButton {
        let b = NSButton(title:title,target:self,action:#selector(action(_:)))
        b.identifier = NSUserInterfaceItemIdentifier(command); b.bezelStyle = .rounded
        b.heightAnchor.constraint(equalToConstant:32).isActive = true
        if control { controlButtons.append(b) }
        else if ["scan","connect","pair"].contains(command) { connectionButtons.append(b) }
        return b
    }
    private func row(_ views:[NSView]) -> NSStackView {
        let r = NSStackView(views:views); r.orientation = .horizontal; r.spacing = 8; r.distribution = .fillEqually
        return r
    }
    private func label(_ text:String,_ size:CGFloat=12) -> NSTextField {
        let l = NSTextField(wrappingLabelWithString:text); l.font = .systemFont(ofSize:size); l.textColor = .secondaryLabelColor; return l
    }
    private func buildUI() {
        let menu = NSMenu(), appMenu = NSMenu(), appItem = NSMenuItem()
        appMenu.addItem(withTitle:"Quit Zen Remote",action:#selector(NSApplication.terminate(_:)),keyEquivalent:"q")
        appItem.submenu = appMenu; menu.addItem(appItem)
        let editItem = NSMenuItem(title:"Edit",action:nil,keyEquivalent:""); let edit = NSMenu(title:"Edit")
        for (title,selector,key) in [("Cut","cut:","x"),("Copy","copy:","c"),("Paste","paste:","v"),("Select All","selectAll:","a")] {
            edit.addItem(withTitle:title,action:NSSelectorFromString(selector),keyEquivalent:key)
        }
        editItem.submenu = edit; menu.addItem(editItem); NSApp.mainMenu = menu
        window = NSWindow(contentRect:NSRect(x:0,y:0,width:470,height:760),styleMask:[.titled,.closable,.miniaturizable,.resizable],backing:.buffered,defer:false)
        window.title = "Zen Remote"; window.minSize = NSSize(width:470,height:788)
        let root = NSView(); window.contentView = root
        let title = label("Apple TV Remote",26); title.textColor = .labelColor; title.font = .systemFont(ofSize:26,weight:.semibold)
        picker.addItem(withTitle:"Find your Apple TV…")
        picker.target = self; picker.action = #selector(selectedDevice)
        host.placeholderString = "Apple TV IP (optional)"; host.toolTip = "Find its address in your router’s connected-device list."
        status.font = .systemFont(ofSize:12); status.maximumNumberOfLines = 3
        status.heightAnchor.constraint(equalToConstant:49).isActive = true
        pad.heightAnchor.constraint(equalToConstant:190).isActive = true
        pad.setAccessibilityLabel("Apple TV directional pad. Use arrow keys, Return to select, Escape to go back, Space to play or pause.")
        pad.send = { [weak self] cmd in if self?.connected == true { self?.backend.command(cmd) } }
        textInput.placeholderString = "Type into the selected TV search field"
        appsPicker.addItem(withTitle:"Load apps to choose one")
        let rows:[NSView] = [title,picker,row([host,button("Find TVs","scan")]),
            row([button("Connect","connect"),button("Pair / Repair","pair")]),status,pad,
            label("Click arrows or swipe • Return: OK • Esc: Back • Space: Play"),
            row([button("Back","back",control:true),button("Home","home",control:true),button("Hold Home","home_hold",control:true)]),
            row([button("−10 sec","skip_backward",control:true),button("Play / Pause","play_pause",control:true),button("+10 sec","skip_forward",control:true)]),
            row([button("Volume −","volume_down",control:true),button("Volume +","volume_up",control:true),button("Wake","power_on",control:true),button("Sleep","power_off",control:true)]),
            row([textInput,button("Send Text","text",control:true)]),
            row([appsPicker,button("Load Apps","list_apps",control:true),button("Open","launch_app",control:true)]),
            row([button("Connection Help","help"),button("Restart Service","restart")])]
        let stack = NSStackView(views:rows); stack.orientation = .vertical; stack.alignment = .leading; stack.spacing = 10
        stack.translatesAutoresizingMaskIntoConstraints = false; root.addSubview(stack)
        NSLayoutConstraint.activate([stack.topAnchor.constraint(equalTo:root.topAnchor,constant:20),stack.leadingAnchor.constraint(equalTo:root.leadingAnchor,constant:20),stack.trailingAnchor.constraint(equalTo:root.trailingAnchor,constant:-20),stack.bottomAnchor.constraint(lessThanOrEqualTo:root.bottomAnchor,constant:-16)])
        for view in rows { view.widthAnchor.constraint(equalTo:stack.widthAnchor).isActive = true }
        host.setContentCompressionResistancePriority(.defaultLow,for:.horizontal)
        textInput.setContentCompressionResistancePriority(.defaultLow,for:.horizontal)
        refreshControls()
        window.center(); window.makeKeyAndOrderFront(nil); NSApp.activate(ignoringOtherApps:true)
    }
    private func refreshControls() {
        picker.isEnabled = !busy && !pairing
        host.isEnabled = !busy && !pairing
        for b in controlButtons { b.isEnabled = connected && !pairing && !busy }
        for b in connectionButtons { b.isEnabled = !pairing && !busy }
        pad.enabled = connected && !pairing && !busy
    }
    private func target() -> [String:Any] {
        let ip = host.stringValue.trimmingCharacters(in:.whitespacesAndNewlines)
        if !ip.isEmpty { return ["address":ip] }
        let i = picker.indexOfSelectedItem
        if i >= 0 && i < devices.count { return devices[i] }
        return savedTarget
    }
    @objc private func selectedDevice() {
        host.stringValue = ""
        connected = false
        status.stringValue = "Press Connect to control the selected Apple TV."
        refreshControls()
    }
    @objc private func action(_ sender:NSButton) {
        let cmd = sender.identifier?.rawValue ?? ""
        if cmd == "help" {
            let a = NSAlert(); a.messageText = "Connecting without a physical remote"
            a.informativeText = "1. Put the Mac and Apple TV on the same home network. Temporarily disconnect a VPN.\n\n2. Allow this app in System Settings → Privacy & Security → Local Network, if that setting is available.\n\n3. Click Find TVs. If discovery fails, find Apple TV in your router’s device list and enter its IP here.\n\n4. Click Pair / Repair and enter each code shown on the television.\n\nIf asleep and undiscoverable, unplug Apple TV power briefly and reconnect it, then try again.\n\nIf Apple TV is not on your network, an Ethernet cable (on supported models), iPhone Remote, or an HDMI-CEC TV remote may help you get it online. The Mac app cannot set up Wi-Fi before it can reach the TV.\n\nTV volume and TV power depend on your HDMI-CEC/audio setup. A Mac cannot transmit infrared remote commands."
            a.beginSheetModal(for:window); return
        }
        if cmd == "restart" { connected = false; busy = false; pairing = false; status.stringValue = "Restarting…"; backend.start(); refreshControls(); return }
        if cmd == "scan" { connected = false; busy = true; backend.send(["command":cmd,"host":host.stringValue.trimmingCharacters(in:.whitespacesAndNewlines)]) }
        else if cmd == "connect" || cmd == "pair" {
            let t = target(); if t.isEmpty { status.stringValue = "Click Find TVs or enter the Apple TV’s IP address first."; return }
            busy = true; connected = false; backend.send(["command":cmd,"target":t])
        } else if cmd == "text" { backend.send(["command":cmd,"text":textInput.stringValue]) }
        else if cmd == "launch_app" {
            let i = appsPicker.indexOfSelectedItem; if i >= 0 && i < appIDs.count { backend.send(["command":cmd,"app_id":appIDs[i]]) }
        } else { backend.command(cmd); window.makeFirstResponder(pad) }
        refreshControls()
    }
    private func event(_ e:[String:Any]) {
        let type = e["type"] as? String ?? ""
        if let message = e["message"] as? String { status.stringValue = message }
        switch type {
        case "ready":
            savedTarget = e["target"] as? [String:Any] ?? [:]
            busy = true
            if savedTarget.isEmpty { backend.command("scan") }
            else { backend.send(["command":"connect","target":savedTarget]) }
        case "devices":
            let previousID = target()["identifier"] as? String
            devices = (e["devices"] as? [[String:Any]] ?? []).filter { $0["controllable"] as? Bool == true }
            picker.removeAllItems()
            for d in devices { picker.addItem(withTitle:"\(d["name"] as? String ?? "Apple TV") · \(d["address"] as? String ?? "")") }
            if devices.isEmpty { picker.addItem(withTitle:"No Apple TV found") }
            else if let i = devices.firstIndex(where: { ($0["identifier"] as? String) == previousID }) { picker.selectItem(at:i) }
        case "connected":
            connected = true; busy = false; pairing = false
            savedTarget = e["device"] as? [String:Any] ?? savedTarget
            window.makeFirstResponder(pad)
        case "pair_required", "disconnected": connected = false; busy = false; pairing = false
        case "error":
            connected = e["connected"] as? Bool ?? false; busy = false; pairing = false
        case "discovery_finished": busy = false; pairing = false; connected = false
        case "status":
            // Progress messages leave controls locked; final scan/cancel messages unlock.
            let m = e["message"] as? String ?? ""
            if m.hasPrefix("Pairing cancelled") { busy = false; pairing = false }
        case "pin_required":
            busy = false; pairing = true
            let a = NSAlert(); pinAlert = a
            a.messageText = "Pair with Apple TV"; a.informativeText = e["message"] as? String ?? "Enter the TV code."
            let pin = NSTextField(frame:NSRect(x:0,y:0,width:220,height:28)); pin.placeholderString = "4-digit code"
            a.accessoryView = pin; a.addButton(withTitle:"Pair"); a.addButton(withTitle:"Cancel")
            a.beginSheetModal(for:window) { [weak self] response in
                guard let self = self else { return }; self.pinAlert = nil; self.busy = true
                if response == .alertFirstButtonReturn { self.backend.send(["command":"pin","pin":pin.stringValue.trimmingCharacters(in:.whitespacesAndNewlines)]) }
                else { self.backend.command("cancel_pair") }
                self.refreshControls()
            }
            a.window.makeFirstResponder(pin)
        case "apps":
            let apps = (e["apps"] as? [[String:String]] ?? []).sorted { ($0["name"] ?? "") < ($1["name"] ?? "") }
            appsPicker.removeAllItems(); appIDs = []
            for a in apps { appsPicker.addItem(withTitle:a["name"] ?? "App"); appIDs.append(a["id"] ?? "") }
            if apps.isEmpty { appsPicker.addItem(withTitle:"No apps reported") }
        case "ok":
            if e["command"] as? String == "text" { textInput.stringValue = "" }
        default: break
        }
        status.textColor = type == "error" || type == "disconnected" ? .systemOrange : .secondaryLabelColor
        refreshControls()
    }
}
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
