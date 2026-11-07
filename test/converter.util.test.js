import os from 'node:os'
import { describe, it } from 'node:test'
import Assert from 'node:assert/strict'

import {
	ConverterUtil,
	parseDotQuad,
	parseHardwareAddress
} from '@johntalton/wiz5500/converter'

describe('parseDotQuad', () => {
	it('should handle undefined', () => {
		const result = parseDotQuad(undefined)
		Assert.equal(result, undefined)
	})

	it('should handle empty string', () => {
		Assert.throws(() => parseDotQuad(''), {
			message: 'invalid dot quad range',
			name: 'RangeError'
		})
	})

	it('should handle simple ip', () => {
		const result = parseDotQuad('192.168.0.1')
		Assert.deepEqual(result, [ 192, 168, 0, 1])
	})

	it('should handle invalid octet ip', () => {
		Assert.throws(() => parseDotQuad('10.0.0.300'), {
			message: 'invalid dot quad range',
			name: 'RangeError'
		})
	})
})

describe('parseHardwareAddress', () => {
	it('should handle undefined', () => {
		const result = parseHardwareAddress(undefined)
		Assert.equal(result, undefined)
	})

	it('should handle empty string', () => {
		Assert.throws(() => parseHardwareAddress(''), {
			message: 'invalid HW address',
			name: 'Error'
		})
	})

	it('should handle simple', () => {
		const result = parseHardwareAddress('a:b:c:d:e:f')
		Assert.deepEqual(result, [ 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ])
	})

	it('should handle invalid octet', () => {
		Assert.throws(() => parseHardwareAddress('a:b:c:d:e:G'), {
			message: 'invalid HW octet range',
			name: 'RangeError'
		})
	})
})

describe('Converter.Util', () => {
	describe('decodeU16BE', () => {
		it('should handle big-endian value', () => {
			const buffer = Uint8Array.from([ 0x01, 0x02 ])
			const result = ConverterUtil.decodeU16BE(buffer)
			Assert.equal(result, 258)
		})

		it('should handle big-endian value (ArrayBuffer)', () => {
			const buffer = Uint8Array.from([ 0x02, 0x01 ])
			const result = ConverterUtil.decodeU16BE(buffer.buffer)
			Assert.equal(result, 513)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ 0x42 ])
			Assert.throws(() => ConverterUtil.decodeU16BE(buffer), {
				message: 'Offset is outside the bounds of the DataView',
				name: 'RangeError'
			})
		})

		it('should handle big-endian value (from platform)', () => {
			const buffer = os.endianness() === 'LE' ?
				Uint16Array.from([ 0xEFBE ]) :
				Uint16Array.from([ 0xBEEF ])
			const result = ConverterUtil.decodeU16BE(buffer)
			Assert.equal(result, 0xBEEF)
		})

		it('should handle big-endian value (from DataView)', () => {
			const dv = new DataView(new ArrayBuffer(2))
			dv.setUint16(0, 0xDEAD, false)
			const result = ConverterUtil.decodeU16BE(dv.buffer)
			Assert.equal(result, 0xDEAD)
		})
	})

	describe('encodeU16BE', () => {
		it('should handle encoding big-endian', () => {
			const buffer = ConverterUtil.encodeU16BE(1025)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)

			Assert.deepEqual(u8, Uint8Array.from([ 0x04, 0x01 ]))
		})

		it('should handle overflow 16bit', () => {
			Assert.throws(() => ConverterUtil.encodeU16BE(0xFF_00_00), {
				message: 'value exceeds 16-bit',
				name: 'RangeError'
			})
		})

		it('should handle negative values', () => {
			Assert.throws(() => ConverterUtil.encodeU16BE(-1), {
				message: 'value must be positive',
				name: 'RangeError'
			})
		})
	})

	describe('decodeU8', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 42 ])
			const result = ConverterUtil.decodeU8(buffer)
			Assert.equal(result, 42)
		})

		it('should handle value (ArrayBuffer)', () => {
			const buffer = Uint8Array.from([ 77 ])
			const result = ConverterUtil.decodeU8(buffer.buffer)
			Assert.equal(result, 77)
		})

		it('should handle invalid buffer length', () => {
			const buffer = Uint8Array.from([ ])
			Assert.throws(() => ConverterUtil.decodeU8(buffer), {
				message: 'undefined buffer value',
				name: 'Error'
			})

		})
	})

	describe('encodeU8', () => {
		it('should handle value', () => {
			const buffer = ConverterUtil.encodeU8(42)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 42 ]))
		})

		it('should handle overflow 8bit', () => {
			Assert.throws(() => ConverterUtil.encodeU8(300), {
				message: 'value exceeds max',
				name: 'RangeError'
			})
		})

		it('should handle negative value', () => {
			Assert.throws(() => ConverterUtil.encodeU8(-1), {
				message: 'value must be positive',
				name: 'RangeError'
			})
		})
	})


	describe('decodeAddress', () => {
		it('should ', () => {

		})

	})

	describe('encodeAddress', () => {
		it('should ', () => {

		})

	})

	describe('decodeHardwareAddress', () => {
		it('should ', () => {

		})

	})

	describe('encodeHardwareAddress', () => {
		it('should ', () => {

		})

	})

	describe('decodePort', () => {
		it('should handle value', () => {
			const buffer = Uint8Array.from([ 0xF0, 0x0D ])
			const value = ConverterUtil.decodePort(buffer)
			Assert.equal(value, 0xF00D)
		})

	})

	describe('encodePort', () => {
		it('should handle value', () => {
			const buffer = ConverterUtil.encodePort(8443)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)
			Assert.deepEqual(u8, Uint8Array.from([ 0x20, 0xFB  ]))
		})
	})
})
