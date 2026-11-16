import { describe, it } from 'node:test'
import Assert from 'node:assert/strict'

import { PHY_OPERATIONAL_MODE, SOCKET_PROTOCOL, Wiz5500 } from '@johntalton/wiz5500'

import { MockBus } from './mock.bus.js'

describe('Wiz5500', () => {
	describe('readMode', () => {
		it('should ', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b1010_1000 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readMode()
			Assert.deepEqual(result, {
				reset: true,
				wakeOnLAN: true,
				blockPing: false,
				enablePPPoE: true,
				forceARP: false,
			})
		})
	})

	describe('writeMode', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeMode({
				reset: false,
				wakeOnLAN: true,
				blockPing: false,
				enablePPPoE: false,
				forceARP: true,
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x00, 0x00 << 3 | 0b1 << 2, 0b0010_0010
			]))
		})
	})

	describe('readGatewayAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 10, 0, 0, 100 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readGatewayAddress()
			Assert.deepEqual(result, {
				a: 10, b: 0, c: 0, d: 100,
				dotQuad: '10.0.0.100'
			})
		})
	})

	describe('writeGatewayAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeGatewayAddress('10.0.0.1')
			Assert.deepEqual(bus.bytesWritten, 7)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x01, 0x00 << 3 | 0b1 << 2, 10, 0, 0, 1
			]))
		})
	})

	describe('readSubnetMaskAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 255, 255, 255, 0 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readSubnetMaskAddress()
			Assert.deepEqual(result, {
				a: 255, b: 255, c: 255, d: 0,
				dotQuad: '255.255.255.0'
			})
		})
	})

	describe('writeSubnetMaskAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeSubnetMaskAddress('255.0.0.0')
			Assert.deepEqual(bus.bytesWritten, 7)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x05, 0x00 << 3 | 0b1 << 2, 255, 0, 0, 0
			]))
		})
	})

	describe('readSourceHardwareAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readSourceHardwareAddress()
			Assert.deepEqual(result, {
				a: 0xa, b: 0xb, c: 0xc, d: 0xd, e: 0xe, f: 0xf,
				canonical: '0A:0B:0C:0D:0E:0F'
			})
		})
	})

	describe('writeSourceHardwareAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeSourceHardwareAddress('0:0:0:0:0:F')
			Assert.deepEqual(bus.bytesWritten, 9)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x009, 0x00 << 3 | 0b1 << 2, 0,0,0,0,0,0xF
			]))
		})
	})

	describe('readSourceIPAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 192, 168, 0, 1 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readSourceIPAddress()
			Assert.deepEqual(result, {
				a: 192, b: 168, c: 0, d: 1,
				dotQuad: '192.168.0.1'
			})
		})
	})

	describe('writeSourceIPAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeSourceIPAddress('10.0.0.20')
			Assert.deepEqual(bus.bytesWritten, 7)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x0F, 0x00 << 3 | 0b1 << 2, 10, 0, 0, 20
			]))
		})
	})

	describe('readInterruptAssertWaitTime', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xFF, 0xFF ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readInterruptAssertWaitTime()
			Assert.deepEqual(result.toJSON(), 'PT0.001747627S')
		})
	})

	describe('writeInterruptAssertWaitTime', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const duration = Temporal.Duration.from({ microseconds: 54, nanoseconds: 650  })
			await wiz.writeInterruptAssertWaitTime(duration)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x13, 0x00 << 3 | 0b1 << 2, 0x8, 0
			]))
		})
	})

	describe('readInterrupt', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b0110_0000]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readInterrupt()
			Assert.deepEqual(result, {
				conflict: false,
				unreachable: true,
				closedPPPoE: true,
				magicWOL: false
			})
		})
	})

	describe('writeInterrupt', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeInterrupt({
				conflict: true,
				unreachable: true,
				closedPPPoE: false,
				magicWOL: false
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x15, 0x00 << 3 | 0b1 << 2, 0b1100_0000
			]))
		})
	})

	describe('readInterruptMask', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b1100_0000 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readInterruptMask()
			Assert.deepEqual(result, {
				enableConflict: true,
				enableUnreachable: true,
				enableClosedPPPoE: false,
				enableMagicWOL: false
			})
		})
	})

	describe('writeInterruptMask', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeInterruptMask({
				enableConflict: true,
				enableUnreachable: false,
				enableClosedPPPoE: false,
				enableMagicWOL: true,
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x16, 0x00 << 3 | 0b1 << 2, 0b1001_0000
			]))
		})
	})

	describe('readSocketInterrupt', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b0000_1111 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readSocketInterrupt()
			Assert.deepEqual(result, [
				true, true, true, true,
				false, false, false, false
			])
		})
	})

	describe('readSocketInterruptMask', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b0111_0101 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readSocketInterruptMask()
			Assert.deepEqual(result, [
				true, false, true, false,
				true, true, true, false
			])
		})
	})

	describe('writeSocketInterruptMask', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writeSocketInterruptMask([
				true, true, false, false,
				false, true, true, false
			])
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x18, 0x00 << 3 | 0b1 << 2, 0b0110_0011
			]))
		})
	})

	describe('readRetryTime', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 78, 32 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readRetryTime()
			Assert.deepEqual(result.toJSON(), 'PT2S')
		})
	})

	describe('writeRetryTime', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const duration = Temporal.Duration.from({ microseconds: 15 * 100 })
			await wiz.writeRetryTime(duration)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x19, 0x00 << 3 | 0b1 << 2, 0, 15
			]))
		})
	})

	describe('readRetryCount', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 77 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readRetryCount()
			Assert.deepEqual(result, 77)
		})
	})

	describe('writeRetryCount', () => {
		it('should write value ', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const count = 42
			await wiz.writeRetryCount(count)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1B, 0x00 << 3 | 0b1 << 2, 42
			]))
		})
	})

	describe('readPPPLinkControlProtocolRequestTimer', () => {
		it('should ', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xA0 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPPPLinkControlProtocolRequestTimer()
			Assert.deepEqual(result.toJSON(), 'PT4S')
		})
	})

	describe('writePPPLinkControlProtocolRequestTimer', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const duration = Temporal.Duration.from({ seconds: 2 })
			await wiz.writePPPLinkControlProtocolRequestTimer(duration)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1C, 0x00 << 3 | 0b1 << 2, 80
			]))
		})
	})

	describe('readPPPLinkControlProtocolMagicNumber', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 77 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPPPLinkControlProtocolMagicNumber()
			Assert.deepEqual(result, 77)
		})
	})

	describe('writePPPLinkControlProtocolMagicNumber', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const magic = 42
			await wiz.writePPPLinkControlProtocolMagicNumber(magic)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1D, 0x00 << 3 | 0b1 << 2, 42
			]))
		})
	})

	describe('readPPPDestinationMACAddress', () => {
		it('should read value ', async () => {
			const bus = new MockBus(Uint8Array.from([ 0,0,0,0,0,0xFF]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPPPDestinationMACAddress()
			Assert.deepEqual(result, {
				a: 0, b: 0, c: 0, d: 0, e: 0, f: 0xFF,
				canonical: '00:00:00:00:00:FF'
			})
		})
	})

	describe('writePPPDestinationMACAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writePPPDestinationMACAddress('0:0:0:0:0:F')
			Assert.deepEqual(bus.bytesWritten, 9)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1E, 0x00 << 3 | 0b1 << 2, 0,0,0,0,0,0xF
			]))
		})
	})

	describe('readPPPSessionIdentification', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0, 77 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPPPSessionIdentification()
			Assert.deepEqual(result, 77)
		})
	})

	describe('writePPPSessionIdentification', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const id = 42
			await wiz.writePPPSessionIdentification(id)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x24, 0x00 << 3 | 0b1 << 2, 0, 42
			]))
		})
	})

	describe('readPPPMaximumSegmentSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xDE, 0xAD]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPPPMaximumSegmentSize()
			Assert.deepEqual(result, 0xDEAD)
		})
	})

	describe('writePPPMaximumSegmentSize', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const size = 42
			await wiz.writePPPMaximumSegmentSize(size)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x26, 0x00 << 3 | 0b1 << 2, 0, 42
			]))
		})
	})

	describe('readUnreachableAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 10, 0, 0, 255 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readUnreachableAddress()
			Assert.deepEqual(result, {
				a: 10, b: 0, c: 0, d: 255,
				dotQuad: '10.0.0.255'
			})
		})
	})

	describe('readUnreachablePort', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xCA, 0xFE ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readUnreachablePort()
			Assert.deepEqual(result, 0xCAFE)
		})
	})

	describe('readPHYConfig', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b1011_0110 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readPHYConfig()
			Assert.deepEqual(result, {
				reset: false,
				softwareConfiguredMode: false,
				mode: PHY_OPERATIONAL_MODE.POWER_DOWN,
				fullDuplex: true,
				highSpeed: true,
				up: false
			})
		})
	})

	describe('writePHYConfig', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			await wiz.writePHYConfig({
				mode: PHY_OPERATIONAL_MODE.AUTO_NEGOTIATION,
				reset: false,
				softwareConfiguredMode: false
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x2E, 0x00 << 3 | 0b1 << 2, 0b1011_1000
			]))
		})
	})

	describe('readChipVersion', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 4 ]))
			const wiz = new Wiz5500(bus)
			const result = await wiz.readChipVersion()
			Assert.deepEqual(result, 4)
		})
	})

	describe('readSocketMode', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b0000_0001 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketMode(socketNumber)
			Assert.deepEqual(result, {
				protocol: SOCKET_PROTOCOL.TCP,
				enableNoDelayedACK: false
			})
		})
	})

	describe('writeSocketMode', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			await wiz.writeSocketMode(socketNumber, {
				protocol: 1,
				enableNoDelayedACK: false
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x00, 0x0D << 3 | 0b1 << 2, 0b0000_0001
			]))
		})
	})

	describe('readSocketCommand', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 42 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketCommand(socketNumber)
			Assert.deepEqual(result, 42)
		})
	})

	describe('writeSocketCommand', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const command = 33
			await wiz.writeSocketCommand(socketNumber, command)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x01, 0x0D << 3 | 0b1 << 2, 33
			]))
		})
	})

	describe('readSocketSocketInterrupt', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b0000_0001 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketSocketInterrupt(socketNumber)
			Assert.deepEqual(result, {
				connect: true,
				disconnect: false,
				receive: false,
				sendOk: false,
				timeout: false
			})
		})
	})

	describe('writeSocketSocketInterrupt', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			await wiz.writeSocketSocketInterrupt(socketNumber, {
				connect: true
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x02, 0x0D << 3 | 0b1 << 2, 0b0000_0001
			]))
		})
	})

	describe('readSocketStatus', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 77 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketStatus(socketNumber)
			Assert.deepEqual(result, 77)
		})
	})

	describe('readSocketSourcePort', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xCA, 0xFE ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketSourcePort(socketNumber)
			Assert.deepEqual(result, 0xCAFE)
		})
	})

	describe('writeSocketSourcePort', () => {
		it('should ', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const port = 0xCAFE
			await wiz.writeSocketSourcePort(socketNumber, port)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x04, 0x0D << 3 | 0b1 << 2, 0xCA, 0xFE
			]))
		})
	})

	describe('readSocketDestinationHardwareAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketDestinationHardwareAddress(socketNumber)
			Assert.deepEqual(result, {
				a: 0xA, b: 0xB, c: 0xC, d: 0xD, e: 0xE, f: 0xF,
				canonical: '0A:0B:0C:0D:0E:0F'
			})
		})
	})

	describe('writeSocketDestinationHardwareAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			await wiz.writeSocketDestinationHardwareAddress(socketNumber, 'A0:00:00:00:00:0F')
			Assert.deepEqual(bus.bytesWritten, 9)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x06, 0x0D << 3 | 0b1 << 2, 0xA0, 0, 0, 0, 0, 0x0F,
			]))
		})
	})

	describe('readSocketDestinationIPAddress', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 10,0,0,20]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketDestinationIPAddress(socketNumber)
			Assert.deepEqual(result, {
				a: 10, b: 0, c: 0, d: 20,
				dotQuad: '10.0.0.20'
			})
		})
	})

	describe('writeSocketDestinationIPAddress', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			await wiz.writeSocketDestinationIPAddress(socketNumber, '10.0.0.20')
			Assert.deepEqual(bus.bytesWritten, 7)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x0C, 0x0D << 3 | 0b1 << 2, 10,0,0,20
			]))
		})
	})

	describe('readSocketDestinationPort', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0,77 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketDestinationPort(socketNumber)
			Assert.deepEqual(result, 77)
		})
	})

	describe('writeSocketDestinationPort', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const port = 0xCAFE
			await wiz.writeSocketDestinationPort(socketNumber, port)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x10, 0x0D << 3 | 0b1 << 2, 0xCA, 0xFE
			]))
		})
	})

	describe('readSocketMaximumSegmentSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0, 42 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketMaximumSegmentSize(socketNumber)
			Assert.deepEqual(result, 42)
		})
	})

	describe('writeSocketMaximumSegmentSize', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const size = 42
			await wiz.writeSocketMaximumSegmentSize(socketNumber, size)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x12, 0x0D << 3 | 0b1 << 2, 0, 42
			]))
		})
	})

	describe('readSocketIPTypeOfService', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 77 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketIPTypeOfService(socketNumber)
			Assert.deepEqual(result, 77)
		})
	})

	describe('writeSocketIPTypeOfService', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const tos = 42
			await wiz.writeSocketIPTypeOfService(socketNumber, tos)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x15, 0x0D << 3 | 0b1 << 2, 42
			]))
		})
	})

	describe('readSocketIPTimeToLive', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 77 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketIPTimeToLive(socketNumber)
			Assert.deepEqual(result, 77)
		})
	})

	describe('writeSocketIPTimeToLive', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const ttl = 42
			await wiz.writeSocketIPTimeToLive(socketNumber, ttl)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x16, 0x0D << 3 | 0b1 << 2, 42
			]))
		})
	})

	describe('readSocketReceiveBufferSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 8 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketReceiveBufferSize(socketNumber)
			Assert.deepEqual(result, 8)
		})
	})

	describe('writeSocketReceiveBufferSize', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const size = 8
			await wiz.writeSocketReceiveBufferSize(socketNumber, size)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1E, 0x0D << 3 | 0b1 << 2, 8
			]))
		})
	})

	describe('readSocketTransmitBufferSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 4 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketTransmitBufferSize(socketNumber)
			Assert.deepEqual(result, 4)
		})
	})

	describe('writeSocketTransmitBufferSize', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const size = 4
			await wiz.writeSocketTransmitBufferSize(socketNumber, size)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x1F, 0x0D << 3 | 0b1 << 2, 4
			]))
		})
	})

	describe('readSocketTXFreeSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0, 42 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketTXFreeSize(socketNumber)
			Assert.deepEqual(result, 42)
		})
	})

	describe('readSocketTXReadPointer', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xDE, 0xAD ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketTXReadPointer(socketNumber)
			Assert.deepEqual(result, 0xDEAD)
		})
	})

	describe('readSocketTXWritePointer', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xFE, 0xED ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketTXWritePointer(socketNumber)
			Assert.deepEqual(result, 0xFEED)
		})
	})

	describe('writeSocketTXWritePointer', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const pointer = 0xBEEF
			await wiz.writeSocketTXWritePointer(socketNumber, pointer)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x24, 0x0D << 3 | 0b1 << 2, 0xBE, 0xEF
			]))
		})
	})

	describe('readSocketRXReceiveSize', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0x00, 42 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketRXReceiveSize(socketNumber)
			Assert.deepEqual(result, 42)
		})
	})

	describe('readSocketRXReadPointer', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xCA, 0xFE ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketRXReadPointer(socketNumber)
			Assert.deepEqual(result, 0xCAFE)
		})
	})

	describe('writeSocketRXReadPointer', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const pointer = 0xCAFE
			await wiz.writeSocketRXReadPointer(socketNumber, pointer)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x28, 0x0D << 3 | 0b1 << 2, 0xCA, 0xFE
			]))
		})
	})

	describe('readSocketRXWritePointer', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xCA, 0xFE ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketRXWritePointer(socketNumber)
			Assert.deepEqual(result, 0xCAFE)
		})
	})

	describe('readSocketSocketInterruptMask', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0b000_1101]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketSocketInterruptMask(socketNumber)
			Assert.deepEqual(result, {
				enableConnect: true,
				enableDisconnect: false,
				enableReceive: true,
				enableSendOk: false,
				enableTimeout: true
			})
		})
	})

	describe('writeSocketSocketInterruptMask', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			await wiz.writeSocketSocketInterruptMask(socketNumber, {
				enableConnect: true,
				enableDisconnect: false,
				enableReceive: true,
				enableSendOk: false,
				enableTimeout: true
			})
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x2C, 0x0D << 3 | 0b1 << 2, 0b0000_1101
			]))
		})
	})

	describe('readSocketFragmentOffsetInIPHeader', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xF0, 0x0D ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketFragmentOffsetInIPHeader(socketNumber)
			Assert.deepEqual(result, 0xF00D)
		})
	})

	describe('writeSocketFragmentOffsetInIPHeader', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const offset = 42
			await wiz.writeSocketFragmentOffsetInIPHeader(socketNumber, offset)
			Assert.deepEqual(bus.bytesWritten, 5)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x2D, 0x0D << 3 | 0b1 << 2, 0, 42
			]))
		})
	})

	describe('readSocketKeepAliveTimer', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 42 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const result = await wiz.readSocketKeepAliveTimer(socketNumber)
			Assert.deepEqual(result.toJSON(), 'PT210S')
		})
	})

	describe('writeSocketKeepAliveTimer', () => {
		it('should write value', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const time = Temporal.Duration.from({ seconds: 2 })
			await wiz.writeSocketKeepAliveTimer(socketNumber, time)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0x00, 0x2F, 0x0D << 3 | 0b1 << 2, 0
			]))
		})
	})

	describe('readSocketRX', () => {
		it('should read value', async () => {
			const bus = new MockBus(Uint8Array.from([ 42, 77 ]))
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const address = 0xF00D
			const length = 2
			const result = await wiz.readSocketRX(socketNumber, address, length)
			Assert.deepEqual(result, Uint8Array.from([ 42, 77 ]))
		})
	})

	describe('writeSocketTX', () => {
		it('should ', async () => {
			const bus = new MockBus()
			const wiz = new Wiz5500(bus)
			const socketNumber = 3
			const address = 0xF00D
			const buffer = Uint8Array.from([ 42 ])
			await wiz.writeSocketTX(socketNumber, address, buffer)
			Assert.deepEqual(bus.bytesWritten, 4)
			Assert.deepEqual(bus.buffer, Uint8Array.from([
				0xF0, 0x0D, 0x0E << 3 | 0b1 << 2, 42
			]))
		})
	})

})
