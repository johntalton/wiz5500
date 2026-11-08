import { describe, it } from 'node:test'
import Assert from 'node:assert/strict'

import { SOCKET_STATUS, SOCKET_COMMANDS, SOCKET_PROTOCOL } from '@johntalton/wiz5500'
import {
	ConverterSocket,
	isBufferSize,
	isSocketStatus,
	isSocketCommand
} from '@johntalton/wiz5500/converter'

describe('isBufferSize', () => {
	it('should handle valid size', () => {
		const result = isBufferSize(2)
		Assert.equal(result, true)
	})

	it('should handle invalid size', () => {
		const result = isBufferSize(3)
		Assert.equal(result, false)
	})
})

describe('isSocketStatus', () => {
	it('should handle valid', () => {
		const result = isSocketStatus(SOCKET_STATUS.ESTABLISHED)
		Assert.equal(result, true)
	})

	it('should handle invalid', () => {
		const result = isSocketStatus(-1)
		Assert.equal(result, false)
	})
})

describe('isSocketCommand', () => {
	it('should handle valid', () => {
		const result = isSocketCommand(SOCKET_COMMANDS.NOOP)
		Assert.equal(result, true)
	})

	it('should handle invalid', () => {
		const result = isSocketCommand(-1)
		Assert.equal(result, false)
	})
})

describe('Converter.Socket', () => {
	describe('decodeMode', () => {
		it('should handle CLOSED', () => {
			const buffer = Uint8Array.from([ 0b0000_0000 ])
			const result = ConverterSocket.decodeMode(buffer)
			Assert.deepEqual(result, {
				protocol: SOCKET_PROTOCOL.CLOSED
			})
		})

		it('should handle TCP', () => {
			const buffer = Uint8Array.from([ 0b0000_0001 ])
			const result = ConverterSocket.decodeMode(buffer)
			Assert.deepEqual(result, {
				protocol: SOCKET_PROTOCOL.TCP,
				enableNoDelayedACK: false
			})
		})

		it('should handle UDP', () => {
			const buffer = Uint8Array.from([ 0b0000_0010 ])
			const result = ConverterSocket.decodeMode(buffer)
			Assert.deepEqual(result, {
				protocol: SOCKET_PROTOCOL.UDP,
				enabledUDPMulticasting: false,
				enableBroadcastBlocking: false,
				enableIGMPv1: false,
				enableUnicastBlocking: false
			})
		})

		it('should handle MACRAW', () => {
			const buffer = Uint8Array.from([ 0b0000_0100 ])
			const result = ConverterSocket.decodeMode(buffer)
			Assert.deepEqual(result, {
				protocol: SOCKET_PROTOCOL.MAC_RAW,
				enableMACFiltering: false,
				enableBroadcastBlocking: false,
				enableMulticastBlocking: false,
				enableIPv6Blocking: false
			})
		})

		it('should handle unknown protocol', () => {
			const buffer = Uint8Array.from([ 0b0000_1111 ])
			Assert.throws(() => ConverterSocket.decodeMode(buffer), {
				message: 'unknown socket protocol',
				name: 'Error'
			})
		})
	})

	describe('encodeMode', () => {
		it('should handle CLOSED', () => {
			const buffer = ConverterSocket.encodeMode({
				protocol: SOCKET_PROTOCOL.CLOSED
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

		it('should handle TCP', () => {
			const buffer = ConverterSocket.encodeMode({
				protocol: SOCKET_PROTOCOL.TCP,
				enableNoDelayedACK: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0001 ]))
		})

		it('should handle UDP', () => {
			const buffer = ConverterSocket.encodeMode({
				protocol: SOCKET_PROTOCOL.UDP,
				enableBroadcastBlocking: false,
				enabledUDPMulticasting: false,
				enableIGMPv1: false,
				enableUnicastBlocking: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0010 ]))
		})

		it('should handle MACRAW', () => {
			const buffer = ConverterSocket.encodeMode({
				protocol: SOCKET_PROTOCOL.MAC_RAW,
				enableBroadcastBlocking: false,
				enableIPv6Blocking: false,
				enableMACFiltering: false,
				enableMulticastBlocking: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0100 ]))
		})

		it('should handle unknown protocol', () => {
			Assert.throws(() => ConverterSocket.encodeMode({
				protocol: 0xF
			}), {
				message: 'unknown socket protocol',
				name: 'Error'
			})
		})
	})

	describe('decodeCommand', () => {
		it('should handle valid', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeCommand(buffer)
			Assert.equal(result, SOCKET_COMMANDS.NOOP)
		})

	})

	describe('encodeCommand', () => {
		it('should handle value', () => {
			const command = SOCKET_COMMANDS.NOOP
			const buffer = ConverterSocket.encodeCommand(command)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0x00 ]))
		})

	})

	describe('decodeSocketInterrupt', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeSocketInterrupt(buffer)
			Assert.deepEqual(result, {
				connect: false,
				disconnect: false,
				receive: false,
				sendOk: false,
				timeout: false
			})
		})

	})

	describe('encodeSocketInterrupt', () => {
		it('should handle value', () => {
			const buffer = ConverterSocket.encodeSocketInterrupt({
				// empty
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeStatus', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeStatus(buffer)
			Assert.equal(result, 0)
		})

	})

	describe('decodeMaximumSegmentSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeMaximumSegmentSize(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeMaximumSegmentSize(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('encodeMaximumSegmentSize', () => {
		it('should handle value', () => {
			const segSize = 0xCA_FE
			const buffer = ConverterSocket.encodeMaximumSegmentSize(segSize)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xCA, 0xFE ]))
		})

	})

	describe('decodeIPTypeOfService', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeIPTypeOfService(buffer)
			Assert.equal(result, 0)
		})

	})

	describe('encodeIPTypeOfService', () => {
		it('should handle value', () => {
			const tos = 77
			const buffer = ConverterSocket.encodeIPTypeOfService(tos)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 77 ]))
		})

	})

	describe('decodeIPTimeToLive', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeIPTimeToLive(buffer)
			Assert.equal(result, 0)
		})

	})

	describe('encodeIPTimeToLive', () => {
		it('should handle value', () => {
			const ttl = 42
			const buffer = ConverterSocket.encodeIPTimeToLive(ttl)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 42 ]))
		})

	})

	describe('decodeReceiveBufferSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeReceiveBufferSize(buffer)
			Assert.equal(result, 0)
		})

	})

	describe('encodeReceiveBufferSize', () => {
		it('should handle value', () => {
			const size = 16
			const buffer = ConverterSocket.encodeReceiveBufferSize(size)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 16 ]))
		})

	})

	describe('decodeTransmitBufferSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeTransmitBufferSize(buffer)
			Assert.equal(result, 0)
		})

	})

	describe('encodeTransmitBufferSize', () => {
		it('should handle value', () => {
			const size = 2
			const buffer = ConverterSocket.encodeTransmitBufferSize(size)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 2 ]))
		})

	})

	describe('decodeTXFreeSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeTXFreeSize(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeTXFreeSize(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('decodeTXReadPointer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeTXReadPointer(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeTXReadPointer(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('decodeTXWritePointer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeTXWritePointer(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeTXWritePointer(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('encodeTXWritePointer', () => {
		it('should handle value', () => {
			const pointer = 0xCA_FE
			const buffer = ConverterSocket.encodeTXWritePointer(pointer)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xCA, 0xFE ]))
		})

	})

	describe('decodeRXReceiveSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeRXReceiveSize(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeRXReceiveSize(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('decodeRXReadPointer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeRXReadPointer(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeRXReadPointer(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})
	})

	describe('encodeRXReadPointer', () => {
		it('should handle value', () => {
			const pointer = 0xDE_AD
			const buffer = ConverterSocket.encodeRXReadPointer(pointer)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xDE, 0xAD ]))
		})

	})

	describe('decodeRXWritePointer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeRXWritePointer(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeRXWritePointer(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})
	})

	describe('decodeInterruptMask', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeInterruptMask(buffer)
			Assert.deepEqual(result, {
				enableConnect: false,
				enableDisconnect: false,
				enableReceive: false,
				enableSendOk: false,
				enableTimeout: false
			})
		})

	})

	describe('encodeInterruptMask', () => {
		it('should handle value', () => {
			const buffer = ConverterSocket.encodeInterruptMask({
				enableConnect: false,
				enableDisconnect: false,
				enableReceive: false,
				enableSendOk: false,
				enableTimeout: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeFragmentOffsetInIPHeader', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterSocket.decodeFragmentOffsetInIPHeader(buffer)
			Assert.equal(result, 0)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterSocket.decodeFragmentOffsetInIPHeader(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('encodeFragmentOffsetInIPHeader', () => {
		it('should handle value', () => {
			const offset = 0xBE_EF
			const buffer = ConverterSocket.encodeFragmentOffsetInIPHeader(offset)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xBE, 0xEF ]))
		})

	})

	describe('decodeKeepAliveTimer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			const result = ConverterSocket.decodeKeepAliveTimer(buffer)
			Assert.deepEqual(result, new Temporal.Duration())
		})

	})

	describe('encodeKeepAliveTimer', () => {
		it('should handle value', () => {
			const buffer = ConverterSocket.encodeKeepAliveTimer(Temporal.Duration.from({ minutes: 21, seconds: 15 }))
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xFF ]))
		})

		it('should handle value out of range', () => {
			 Assert.throws(() => ConverterSocket.encodeKeepAliveTimer(Temporal.Duration.from({ minutes: 22 })), {
				message: 'duration exceeds max',
				name: 'RangeError'
			 })
		})

		it('should handle negative duration', () => {
			Assert.throws(() => ConverterSocket.encodeKeepAliveTimer(Temporal.Duration.from({ minutes: -1 })), {
				message: 'duration must be positive',
				name: 'RangeError'
			})
		})

	})
})
