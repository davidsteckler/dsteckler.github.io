#!/usr/bin/env python3
"""Line-delimited JSON transport. One serialized command stream; never replay inputs."""
import asyncio
import ipaddress
import json
import os
from pathlib import Path
import shutil
import sys
import time

import pyatv
from pyatv.const import Protocol, PairingRequirement, FeatureName, FeatureState, InputAction, DeviceModel
from pyatv.exceptions import NotSupportedError
from pyatv.storage.file_storage import FileStorage

SUPPORT = Path.home() / 'Library/Application Support/AppleTVRemote'

class ConnectionListener:
    def __init__(self, backend, connection):
        self.backend = backend
        self.connection = connection

    def connection_lost(self, exception):
        if self.backend.atv is self.connection:
            self.backend.atv = None
            self.backend.emit('disconnected', message='Connection lost. Press Connect to reconnect.')
        tasks = self.connection.close()
        if tasks:
            asyncio.gather(*tasks, return_exceptions=True)

    def connection_closed(self):
        pass


class Backend:
    def __init__(self, support=SUPPORT):
        self.support = Path(support)
        self.loop = asyncio.get_running_loop()
        self.storage = FileStorage(str(self.support / 'zen-v4.conf'), self.loop)
        self.atv = None
        self.devices = []
        self.target = {}
        self.pairing = None
        self.pair_config = None
        self.pair_queue = []
        self.ready = False

    def emit(self, kind, **fields):
        print(json.dumps(dict(type=kind, **fields)), flush=True)

    async def initialize(self):
        self.support.mkdir(parents=True, exist_ok=True)
        destination = self.support / 'zen-v4.conf'
        if not destination.exists() and (self.support / 'pyatv.conf').exists():
            shutil.copy2(self.support / 'pyatv.conf', destination)
            destination.chmod(0o600)
        await self.storage.load()
        try:
            self.target = json.loads((self.support / 'zen-device.json').read_text())
        except (FileNotFoundError, ValueError):
            pass
        self.ready = True
        self.emit('ready', target=self.target)

    @staticmethod
    def is_tv(config):
        # An AirPlay-only Mac is discoverable too; it is not a remote-control target.
        model = config.device_info.model
        tv_models = {DeviceModel.Gen2, DeviceModel.Gen3, DeviceModel.Gen4, DeviceModel.Gen4K, DeviceModel.AppleTV4KGen2, DeviceModel.AppleTV4KGen3, DeviceModel.AppleTVGen1}
        return model in tv_models or any(config.get_service(p) for p in (Protocol.Companion, Protocol.MRP, Protocol.DMAP))

    @staticmethod
    def describe(config):
        return dict(name=config.name, address=str(config.address), identifier=config.identifier or '',
                    protocols=[s.protocol.name for s in config.services],
                    controllable=Backend.is_tv(config))

    async def scan(self, host=''):
        kwargs = {}
        if host:
            address = ipaddress.ip_address(host.strip())
            if address.version != 4:
                raise ValueError('Use the Apple TV’s IPv4 address, for example 192.168.1.25.')
            kwargs['hosts'] = [str(address)]
        self.emit('status', message='Looking for Apple TVs…')
        self.devices = await asyncio.wait_for(
            pyatv.scan(self.loop, timeout=8, storage=self.storage, **kwargs), 12)
        self.emit('devices', devices=[self.describe(d) for d in self.devices])
        return self.devices

    def matching(self, devices, target):
        identifier = target.get('identifier')
        if identifier:
            # Never silently switch TVs if a remembered IP is reassigned.
            return next((d for d in devices if identifier in d.all_identifiers), None)
        address = target.get('address')
        if address:
            return next((d for d in devices if str(d.address) == address), None)
        name = target.get('name', '').strip().casefold()
        matches = [d for d in devices if d.name.casefold() == name and self.is_tv(d)]
        if len(matches) > 1:
            raise RuntimeError('Several Apple TVs share that name. Choose one by its IP address.')
        return matches[0] if matches else None

    async def resolve(self, target):
        match = self.matching(self.devices, target)
        if match:
            return match
        if target.get('address'):
            match = self.matching(await self.scan(target['address']), target)
            if match:
                return match
        match = self.matching(await self.scan(), target)
        if not match:
            raise RuntimeError('Apple TV was not found. Click Find TVs, or enter its IP from your router’s device list. Check the same home network and Local Network permission.')
        return match

    async def close_connection(self):
        atv, self.atv = self.atv, None
        if atv:
            tasks = atv.close()
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)

    async def connect(self, target=None):
        await self.cancel_pairing()
        await self.close_connection()
        self.devices = []
        config = await self.resolve(target or self.target)
        if not self.is_tv(config):
            raise RuntimeError('That device advertises AirPlay but was not identified as an Apple TV.')
        self.target = self.describe(config)
        needed = [s for s in config.services if s.enabled and
                  s.protocol in (Protocol.AirPlay, Protocol.Companion, Protocol.MRP) and
                  s.pairing == PairingRequirement.Mandatory and not s.credentials]
        if needed:
            self.emit('pair_required', message='Select Pair / Repair to enter the code displayed on your TV.')
            return
        self.emit('status', message=f'Connecting to {config.name}…')
        try:
            self.atv = await asyncio.wait_for(pyatv.connect(config, self.loop, storage=self.storage), 20)
        except Exception:
            raise RuntimeError('Connection failed. Try Pair / Repair if credentials expired, or Find TVs if its address changed.')
        self.listener = ConnectionListener(self, self.atv)
        self.atv.listener = self.listener
        # Reject a misleading “connected” state when only AirPlay streaming works.
        if self.atv.features.get_feature(FeatureName.Up).state == FeatureState.Unsupported:
            await self.close_connection()
            self.emit('pair_required', message='Navigation is unavailable. Use Pair / Repair to authorize remote control.')
            return
        path = self.support / 'zen-device.json'
        temporary = path.with_suffix('.tmp')
        temporary.write_text(json.dumps(self.target))
        temporary.chmod(0o600)
        temporary.replace(path)
        self.emit('connected', message=f'Connected to {config.name}', device=self.target)

    async def save_credentials(self):
        await self.storage.save()
        path = self.support / 'zen-v4.conf'
        if path.exists():
            path.chmod(0o600)

    async def cancel_pairing(self):
        if self.pairing:
            pairing, self.pairing = self.pairing, None
            await pairing.close()
        self.pair_queue = []

    async def begin_pairing(self, target):
        await self.cancel_pairing()
        await self.close_connection()
        self.pair_config = await self.resolve(target or self.target)
        if not self.is_tv(self.pair_config):
            raise RuntimeError('Choose an Apple TV in the device list.')
        self.target = self.describe(self.pair_config)
        # Both protocols are useful on modern tvOS; keep a completed first step if second fails.
        for protocol in (Protocol.AirPlay, Protocol.Companion, Protocol.MRP):
            service = self.pair_config.get_service(protocol)
            if service and service.enabled and service.pairing in (PairingRequirement.Mandatory, PairingRequirement.Optional):
                self.pair_queue.append(protocol)
        if not self.pair_queue:
            raise RuntimeError('This device is not offering pairing. Check Apple TV remote access settings using an iPhone Remote or HDMI-CEC TV remote.')
        await self.next_pairing()

    async def next_pairing(self):
        if not self.pair_queue:
            # Rescan so newly saved credentials are applied to fresh service objects.
            self.devices = []
            await self.connect(self.target)
            return
        protocol = self.pair_queue.pop(0)
        self.pairing = await pyatv.pair(self.pair_config, protocol, self.loop, storage=self.storage)
        await asyncio.wait_for(self.pairing.begin(), 20)
        if not self.pairing.device_provides_pin:
            await self.cancel_pairing()
            raise RuntimeError('This older pairing method requires entering a PIN on the TV and needs another input device.')
        self.emit('pin_required', message=f'Enter the {protocol.name} code shown on your TV. A second code may follow.')

    async def finish_pairing(self, pin):
        if not self.pairing:
            raise RuntimeError('Click Pair / Repair to request a fresh code.')
        if not isinstance(pin, str) or len(pin) != 4 or not pin.isascii() or not pin.isdigit():
            self.emit('pin_required', message='Enter exactly four digits from the TV, including any leading zero.')
            return
        pairing = self.pairing
        try:
            pairing.pin(int(pin))
            await asyncio.wait_for(pairing.finish(), 20)
            if not pairing.has_paired:
                raise RuntimeError('Pairing was not accepted. Click Pair / Repair to try again.')
            await self.save_credentials()
        except Exception:
            await self.cancel_pairing()
            raise RuntimeError('Pairing failed or the code expired. Click Pair / Repair for a new code.')
        finally:
            if self.pairing is pairing:
                await pairing.close()
                self.pairing = None
        await self.next_pairing()

    async def control(self, msg):
        if not self.atv:
            raise RuntimeError('Connect to your Apple TV first.')
        cmd = msg['command']
        remote = self.atv.remote_control
        simple = {'up':'up','down':'down','left':'left','right':'right','select':'select',
                  'back':'menu','home':'home','play_pause':'play_pause',
                  'skip_forward':'skip_forward','skip_backward':'skip_backward'}
        if cmd in simple:
            await getattr(remote, simple[cmd])()
        elif cmd == 'home_hold':
            await remote.home(action=InputAction.Hold)
        elif cmd in ('volume_up', 'volume_down'):
            await getattr(self.atv.audio, cmd)()
        elif cmd in ('power_on', 'power_off'):
            await getattr(self.atv.power, 'turn_on' if cmd == 'power_on' else 'turn_off')()
        elif cmd == 'text':
            await self.atv.keyboard.text_append(str(msg.get('text', ''))[:4096])
        elif cmd == 'list_apps':
            apps = await self.atv.apps.app_list()
            self.emit('apps', apps=[dict(name=a.name or a.identifier, id=a.identifier) for a in apps])
        elif cmd == 'launch_app':
            await self.atv.apps.launch_app(str(msg['app_id']))
        else:
            raise ValueError('Unknown command.')

    async def dispatch(self, msg):
        cmd = msg.get('command')
        try:
            if not self.ready:
                raise RuntimeError('Setup failed. Restart the app after checking its saved pairing file.')
            if cmd == 'scan':
                await self.cancel_pairing()
                await self.close_connection()
                await self.scan(str(msg.get('host', '')))
                self.emit('discovery_finished', message='Choose your Apple TV, then Connect or Pair / Repair.' if any(self.is_tv(d) for d in self.devices) else 'No Apple TV found. Try its IP address or check Local Network permission.')
            elif cmd == 'connect':
                await self.connect(msg.get('target'))
            elif cmd == 'pair':
                await self.begin_pairing(msg.get('target', {}))
            elif cmd == 'pin':
                await self.finish_pairing(msg.get('pin', ''))
            elif cmd == 'cancel_pair':
                await self.cancel_pairing()
                self.emit('status', message='Pairing cancelled. You can start again.')
            else:
                await asyncio.wait_for(self.control(msg), 10)
                self.emit('ok', command=cmd)
        except NotSupportedError:
            self.emit('error', message='This Apple TV or audio setup does not support that control.', connected=self.atv is not None)
        except (ConnectionError, asyncio.TimeoutError, OSError):
            if cmd in ('pair', 'pin'):
                await self.cancel_pairing()
            await self.close_connection()
            self.emit('disconnected', message='Apple TV did not respond. Press Connect, then try the control again.')
        except Exception as exc:
            if cmd in ('pair', 'pin'):
                await self.cancel_pairing()
            self.emit('error', message=str(exc) or type(exc).__name__, connected=self.atv is not None)

async def main():
    os.umask(0o077)
    backend = Backend()
    try:
        await backend.initialize()
    except Exception:
        backend.emit('error', message='Could not load saved pairing data. Existing files were kept. Check zen-v4.conf in Application Support/AppleTVRemote.')
    reader = asyncio.StreamReader()
    await asyncio.get_running_loop().connect_read_pipe(lambda: asyncio.StreamReaderProtocol(reader), sys.stdin)
    queue = asyncio.Queue(maxsize=24)
    async def receive():
        while line := await reader.readline():
            try:
                msg = json.loads(line)
                if not isinstance(msg, dict):
                    continue
                queue.put_nowait((time.monotonic(), msg))
            except asyncio.QueueFull:
                backend.emit('status', message='Please wait for the current action to finish.')
            except ValueError:
                backend.emit('error', message='Invalid command data.')
        await queue.put((time.monotonic(), None))
    receiver = asyncio.create_task(receive())
    try:
        while True:
            received, msg = await queue.get()
            if msg is None:
                break
            # Discard stale navigation after a long network operation.
            if msg.get('command') in ('up','down','left','right','select','back','play_pause','volume_up','volume_down') and time.monotonic()-received > 1.5:
                continue
            await backend.dispatch(msg)
    finally:
        receiver.cancel()
        await backend.cancel_pairing()
        await backend.close_connection()

if __name__ == '__main__':
    asyncio.run(main())
