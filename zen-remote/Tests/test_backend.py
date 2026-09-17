import asyncio
import ipaddress
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import AsyncMock, MagicMock, patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'Resources'))
from backend import Backend
from pyatv.conf import AppleTV, ManualService
from pyatv.const import Protocol, PairingRequirement, FeatureState

def device(name='Game Room', address='192.168.1.50', identifier='tv-one', credentials='saved'):
    c = AppleTV(ipaddress.ip_address(address), name)
    c.add_service(ManualService(identifier, Protocol.Companion, 1234, {}, credentials=credentials,
                               pairing_requirement=PairingRequirement.Mandatory))
    return c

def connection():
    c = MagicMock()
    c.features.get_feature.return_value.state = FeatureState.Available
    c.close.return_value = set()
    c.remote_control.up = AsyncMock()
    c.audio.volume_up = AsyncMock()
    c.keyboard.text_append = AsyncMock()
    return c

class BackendTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.b = Backend(self.temp.name)
        self.events = []
        self.b.emit = lambda kind, **data: self.events.append(dict(type=kind, **data))
        await self.b.initialize()
    async def asyncTearDown(self):
        await self.b.cancel_pairing()
        await self.b.close_connection()
        self.temp.cleanup()

    async def test_direct_ip_discovery(self):
        with patch('backend.pyatv.scan', AsyncMock(return_value=[device()])) as scan:
            await self.b.scan('192.168.1.50')
            self.assertEqual(scan.call_args.kwargs['hosts'], ['192.168.1.50'])
        self.assertEqual(self.events[-1]['devices'][0]['address'], '192.168.1.50')

    async def test_mac_is_not_tv(self):
        mac = AppleTV(ipaddress.ip_address('192.168.1.9'), 'MacBook Pro')
        mac.add_service(ManualService('mac', Protocol.AirPlay, 7000, {}))
        self.assertFalse(self.b.is_tv(mac))
        self.assertTrue(self.b.is_tv(device()))

    async def test_saved_identity_rejects_reassigned_ip(self):
        self.assertIsNone(self.b.matching([device(identifier='other')], {'identifier':'tv-one','address':'192.168.1.50'}))

    async def test_changed_ip_rediscovered_by_identity(self):
        moved = device(address='192.168.1.60')
        with patch('backend.pyatv.scan', AsyncMock(side_effect=[[],[moved]])):
            found = await self.b.resolve({'identifier':'tv-one','address':'192.168.1.50'})
        self.assertEqual(str(found.address), '192.168.1.60')

    async def test_duplicate_name_requires_selection(self):
        with self.assertRaisesRegex(RuntimeError, 'Several'):
            self.b.matching([device(),device(address='192.168.1.60',identifier='two')],{'name':'Game Room'})

    async def test_missing_credentials_requests_pairing(self):
        self.b.devices = [device(credentials=None)]
        with patch('backend.pyatv.scan', AsyncMock(return_value=self.b.devices)), patch('backend.pyatv.connect', AsyncMock()) as connect:
            await self.b.connect({'identifier':'tv-one'})
            connect.assert_not_called()
        self.assertEqual(self.events[-1]['type'], 'pair_required')

    async def test_connect_remembers_device(self):
        self.b.devices = [device()]
        with patch('backend.pyatv.scan', AsyncMock(return_value=self.b.devices)), patch('backend.pyatv.connect', AsyncMock(return_value=connection())):
            await self.b.connect({'identifier':'tv-one'})
        saved = json.loads((Path(self.temp.name)/'zen-device.json').read_text())
        self.assertEqual(saved['identifier'], 'tv-one')
        self.assertEqual(self.events[-1]['type'], 'connected')

    async def test_non_navigation_connection_is_rejected(self):
        self.b.devices = [device()]
        c = connection(); c.features.get_feature.return_value.state = FeatureState.Unsupported
        with patch('backend.pyatv.scan', AsyncMock(return_value=self.b.devices)), patch('backend.pyatv.connect', AsyncMock(return_value=c)):
            await self.b.connect({'identifier':'tv-one'})
        self.assertIsNone(self.b.atv)
        self.assertEqual(self.events[-1]['type'], 'pair_required')

    async def test_input_never_replayed_after_timeout(self):
        c = connection(); c.remote_control.up.side_effect = asyncio.TimeoutError()
        self.b.atv = c
        await self.b.dispatch({'command':'up'})
        self.assertEqual(c.remote_control.up.await_count, 1)
        self.assertIsNone(self.b.atv)
        self.assertEqual(self.events[-1]['type'], 'disconnected')

    async def test_volume_and_text_use_supported_interfaces(self):
        self.b.atv = connection()
        await self.b.dispatch({'command':'volume_up'})
        await self.b.dispatch({'command':'text','text':'hello'})
        self.b.atv.audio.volume_up.assert_awaited_once()
        self.b.atv.keyboard.text_append.assert_awaited_once_with('hello')

    async def test_two_protocol_pairing_saves_each_step(self):
        conf = device(credentials=None)
        conf.add_service(ManualService('airplay-id', Protocol.AirPlay, 7000, {},pairing_requirement=PairingRequirement.Mandatory))
        self.b.devices = [conf]
        sessions = []
        async def pair(config, protocol, loop, storage):
            p = MagicMock(); p.begin = AsyncMock(); p.close = AsyncMock()
            p.device_provides_pin = True; p.has_paired = True
            async def finish():
                settings = await storage.get_settings(config)
                getattr(settings.protocols, protocol.name.lower()).credentials = 'test-credential'
            p.finish = AsyncMock(side_effect=finish); sessions.append(p); return p
        with patch('backend.pyatv.pair', side_effect=pair), patch.object(self.b, 'connect', AsyncMock()) as connect:
            await self.b.begin_pairing({'identifier':'tv-one'})
            self.assertEqual(self.events[-1]['type'], 'pin_required')
            await self.b.finish_pairing('0123')
            sessions[0].pin.assert_called_once_with(123)
            self.assertEqual(self.events[-1]['type'], 'pin_required')
            connect.assert_not_called()
            await self.b.finish_pairing('4567')
            connect.assert_awaited_once()
        saved = json.loads((Path(self.temp.name)/'zen-v4.conf').read_text())
        self.assertIn('test-credential', json.dumps(saved))
        self.assertEqual(len(sessions),2)
        for p in sessions: p.close.assert_awaited_once()

    async def test_cancel_releases_pair_session(self):
        p = MagicMock(); p.close = AsyncMock(); self.b.pairing = p
        self.b.pair_queue = [Protocol.Companion]
        await self.b.cancel_pairing()
        p.close.assert_awaited_once(); self.assertFalse(self.b.pair_queue)

    async def test_invalid_host_does_not_scan(self):
        with patch('backend.pyatv.scan',AsyncMock()) as scan:
            await self.b.dispatch({'command':'scan','host':'not an ip'})
            scan.assert_not_called()
        self.assertEqual(self.events[-1]['type'],'error')

    async def test_corrupt_storage_not_overwritten(self):
        path = Path(self.temp.name)/'zen-v4.conf'; path.write_text('corrupt')
        b = Backend(self.temp.name)
        with self.assertRaises(Exception): await b.initialize()
        self.assertEqual(path.read_text(),'corrupt')

    async def test_legacy_credentials_copied_not_modified(self):
        # Generate valid storage with the actual pinned pyatv implementation.
        await self.b.storage.get_settings(device())
        await self.b.save_credentials()
        path = Path(self.temp.name)/'zen-v4.conf'
        old = Path(self.temp.name)/'pyatv.conf'; old.write_bytes(path.read_bytes()); original = old.read_bytes(); path.unlink()
        b = Backend(self.temp.name); b.emit = lambda *a, **k:None
        await b.initialize()
        self.assertEqual(old.read_bytes(),original)
        self.assertEqual(path.read_bytes(),original)

    async def test_invalid_pin_preserves_pairing_for_retry(self):
        p = MagicMock(); p.close = AsyncMock(); p.finish = AsyncMock()
        self.b.pairing = p
        await self.b.dispatch({'command':'pin','pin':'12'})
        p.close.assert_not_called(); p.finish.assert_not_called()
        self.assertIs(self.b.pairing,p)
        self.assertEqual(self.events[-1]['type'],'pin_required')

    async def test_pairing_timeout_releases_session(self):
        conf = device(credentials=None); self.b.devices = [conf]
        p = MagicMock(); p.begin = AsyncMock(side_effect=asyncio.TimeoutError()); p.close = AsyncMock()
        with patch('backend.pyatv.pair',AsyncMock(return_value=p)):
            await self.b.dispatch({'command':'pair','target':{'identifier':'tv-one'}})
        p.close.assert_awaited_once()
        self.assertIsNone(self.b.pairing)
        self.assertEqual(self.events[-1]['type'],'disconnected')

    async def test_scan_disconnects_old_tv(self):
        c = connection(); self.b.atv = c
        with patch('backend.pyatv.scan',AsyncMock(return_value=[device()])):
            await self.b.dispatch({'command':'scan'})
        c.close.assert_called_once(); self.assertIsNone(self.b.atv)
        self.assertEqual(self.events[-1]['type'],'discovery_finished')

    async def test_old_connection_callback_cannot_disconnect_new_tv(self):
        from backend import ConnectionListener
        old = connection(); new = connection(); self.b.atv = new
        listener = ConnectionListener(self.b,old)
        listener.connection_lost(ConnectionError())
        self.assertIs(self.b.atv,new)
        new.close.assert_not_called()

if __name__ == '__main__': unittest.main()
