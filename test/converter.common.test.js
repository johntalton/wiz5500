import { describe, it } from 'node:test'
import Assert from 'node:assert/strict'

import { PHY_OPERATIONAL_MODE } from '@johntalton/wiz5500'
import { ConverterCommon, isOperationMode } from '@johntalton/wiz5500/converter'

describe('isOperationMode', () => {
	it('should handle valid', () => {
		const result = isOperationMode(2)
		Assert.equal(result, true)
	})

	it('should handle in-valid', () => {
		const result = isOperationMode(42)
		Assert.equal(result, false)
	})
})

describe('Converter.Common', () => {
	describe('decodeMode', () => {
		it('should handle ', () => {
			const buffer = Uint8Array.from([ 0b0010_0010 ])
			const result = ConverterCommon.decodeMode(buffer)
			Assert.deepEqual(result, {
				reset: false,
				wakeOnLAN: true,
				blockPing: false,
				enablePPPoE: false,
				forceARP: true
			})
		})

	})

	describe('encodeMode', () => {
		it('should handle defaults', () => {
			const buffer = ConverterCommon.encodeMode({
				reset: false,
				wakeOnLAN: false,
				blockPing: false,
				enablePPPoE: false,
				forceARP: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeInterruptAssertWaitTime', () => {
		it('should handle zero value', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterCommon.decodeInterruptAssertWaitTime(buffer)
			Assert.ok(result.blank)
			Assert.equal(result.toLocaleString('en-US'), '')
		})

		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0x01, 0x10 ])
			const result = ConverterCommon.decodeInterruptAssertWaitTime(buffer)
			Assert.ok(!result.blank)
			Assert.equal(result.toLocaleString('en-US'), '7,280 ns')
		})

	})

	describe('encodeInterruptAssertWaitTime', () => {
		it('should handle zero value', () => {
			const buffer = ConverterCommon.encodeInterruptAssertWaitTime(new Temporal.Duration())
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0, 0 ]))
		})

		it('should handle value', () => {
			const buffer = ConverterCommon.encodeInterruptAssertWaitTime(Temporal.Duration.from({ microseconds: 7, nanoseconds: 280 }))
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0x01, 0x10 ]))
		})

	})

	describe('decodeInterrupt', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0b1010_0000 ])
			const result = ConverterCommon.decodeInterrupt(buffer)
			Assert.deepEqual(result, {
				conflict: true,
				unreachable: false,
				closedPPPoE: true,
				magicWOL: false
			})
		})

	})

	describe('encodeInterrupt', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodeInterrupt({
				// empty
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeInterruptMask', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0b1101_0000 ])
			const result = ConverterCommon.decodeInterruptMask(buffer)
			Assert.deepEqual(result, {
				enableConflict: true,
				enableUnreachable: true,
				enableClosedPPPoE: false,
				enableMagicWOL: true
			})
		})

	})

	describe('encodeInterruptMask', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodeInterruptMask({
				enableConflict: false,
				enableUnreachable: false,
				enableClosedPPPoE: false,
				enableMagicWOL: false
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeSocketInterrupt', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0b1010_0000 ])
			const result = ConverterCommon.decodeSocketInterrupt(buffer)
			Assert.deepEqual(result, [
				false, false, false, false,
				false, true,  false, true
			])
		})

	})

	describe('decodeSocketInterruptMask', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0b1111_0001 ])
			const result = ConverterCommon.decodeSocketInterruptMask(buffer)
			Assert.deepEqual(result, [
				true, false, false, false,
				true, true,  true,  true
			])
		})

	})

	describe('encodeSocketInterruptMask', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodeSocketInterruptMask([
				false, false, false, false,
				false, false, false, false
			])
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0000_0000 ]))
		})

	})

	describe('decodeRetryTime', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0x00, 0x00 ])
			const result = ConverterCommon.decodeRetryTime(buffer)
			Assert.equal(result.toJSON(), 'PT0S')
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x00 ])
			Assert.throws(() => ConverterCommon.decodeRetryTime(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

	})

	describe('encodeRetryTime', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodeRetryTime(Temporal.Duration.from({ seconds: 6, milliseconds: 553, microseconds: 500 }))
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xFF, 0xFF ]))
		})

	})

	describe('decodeRetryCount', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 42 ])
			const result = ConverterCommon.decodeRetryCount(buffer)
			Assert.equal(result, 42)
		})

	})

	describe('encodeRetryCount', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodeRetryCount(42)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 42 ]))
		})

	})

	describe('decodePPPLinkControlProtocolRequestTimer', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0xFF ])
			const result = ConverterCommon.decodePPPLinkControlProtocolRequestTimer(buffer)
			Assert.equal(result.toJSON(), 'PT6.375S')
		})

	})

	describe('encodePPPLinkControlProtocolRequestTimer', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodePPPLinkControlProtocolRequestTimer(
				Temporal.Duration.from({ seconds: 6, milliseconds: 370 })
			)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xFF ]))
		})

	})

	describe('decodePPPLinkControlProtocolMagicNumber', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 77 ])
			const result = ConverterCommon.decodePPPLinkControlProtocolMagicNumber(buffer)
			Assert.equal(result, 77)
		})

	})

	describe('encodePPPLinkControlProtocolMagicNumber', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodePPPLinkControlProtocolMagicNumber(77)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 77 ]))
		})

	})

	describe('decodePPPSessionIdentification', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0xBE, 0xEF ])
			const result = ConverterCommon.decodePPPSessionIdentification(buffer)
			Assert.equal(result, 0xBEEF)
		})

	})

	describe('encodePPPSessionIdentification', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodePPPSessionIdentification(0xF00D)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xF0, 0x0D ]))
		})

	})

	describe('decodePPPMaximumSegmentSize', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0xBE, 0xEF ])
			const result = ConverterCommon.decodePPPMaximumSegmentSize(buffer)
			Assert.equal(result, 0xBEEF)
		})

	})

	describe('encodePPPMaximumSegmentSize', () => {
		it('should handle value', () => {
			const buffer = ConverterCommon.encodePPPMaximumSegmentSize(0xCAFE)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0xCA, 0xFE ]))
		})

	})

	describe('decodePHYConfig', () => {
		it('should handle basic', () => {
			const buffer = Uint8Array.from([ 0b1001_0101 ])
			const result = ConverterCommon.decodePHYConfig(buffer)
			Assert.deepEqual(result, {
				reset: false,
				softwareConfiguredMode: false,
				mode: PHY_OPERATIONAL_MODE.HALF_DUPLEX_100BT,
				fullDuplex: true,
				highSpeed: false,
				up: true
			})
		})

	})

	describe('encodePHYConfig', () => {
		it('should handle basic', () => {
			const buffer = ConverterCommon.encodePHYConfig({
				reset: true,
				softwareConfiguredMode: false,
				mode: PHY_OPERATIONAL_MODE.AUTO_NEGOTIATION
			})
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0b0011_1000 ]))
		})

	})

	describe('decodeChipVersion', () => {
		it('should handle default id', () => {
			const buffer = Uint8Array.from([ 4 ])
			const result = ConverterCommon.decodeChipVersion(buffer)
			Assert.equal(result, 4)
		})
	})
})
