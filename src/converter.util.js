/** biome-ignore-all lint/style/noNestedTernary: just cause */
import { ADDRESS_SIZE, HARDWARE_ADDRESS_SIZE } from './defs.js'

/** @import { SPIBufferSource } from '@johntalton/and-other-delights' */
/** @import {
	Address,
	AddressInput,
	HardwareAddressInput,
	HardwareAddressOutput
} from './types.js' */

export const MAX_16_BIT_VALUE = 0xFF_FF
export const MAX_8_BIT_VALUE = 0xFF

/**
 * @param {string} address
 */
export function parseDotQuad(address) {
	if(address === undefined) { return undefined }

	const parts = address
		.split('.')
		.map(quad => Number.parseInt(quad, 10))

	const outOfRange = !parts.every(part => ((part <= 255) && (part >= 0)))
	if(outOfRange) { throw new RangeError('invalid dot quad range') }

	return parts
}

/**
 * @param {string} address
 * @returns {Array<number>|undefined}
 */
export function parseHardwareAddress(address) {
	if(address === undefined) { return undefined }

	const parts = address
		.split(':')
		.map(part => Number.parseInt(part, 16))

	if(parts.length !== HARDWARE_ADDRESS_SIZE) { throw new Error('invalid HW address') }

	const outOfRange = !parts.every(part => ((part <= 255) && (part >= 0)))
	if(outOfRange) { throw new RangeError('invalid HW octet range') }

	return parts
}

export class ConverterUtil {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeU16BE(buffer) {
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new DataView(buffer)

		return dv.getUint16(0, false)
	}

	/**
	 * @param {number} value
	 * @returns {SPIBufferSource}
	 */
	static encodeU16BE(value) {
		if(value < 0) { throw new RangeError('value must be positive') }
		if(value > MAX_16_BIT_VALUE) { throw new RangeError('value exceeds 16-bit') }
		const dv = new DataView(new ArrayBuffer(2))
		dv.setUint16(0, value, false)
		return dv
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeU8(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ value ] = u8

		if(value === undefined) { throw new Error('undefined buffer value') }

		return value
	}

	/**
	 * @param {number} value
	 * @returns {SPIBufferSource}
	 */
	static encodeU8(value) {
		if(value < 0) { throw new RangeError('value must be positive') }
		if(value > MAX_8_BIT_VALUE) { throw new RangeError('value exceeds max') }
		return Uint8ClampedArray.from([ value ])
	}

	//
	//
	//

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Address}
	 */
	static decodeAddress(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ a, b, c, d ] = u8

		if(a === undefined) { throw new Error('undefined address part (a)') }
		if(b === undefined) { throw new Error('undefined address part (b)') }
		if(c === undefined) { throw new Error('undefined address part (c)') }
		if(d === undefined) { throw new Error('undefined address part (d)') }

		return {
			a, b, c, d,
			dotQuad: `${a}.${b}.${c}.${d}`
		}
	}

	/**
	 * @param {AddressInput} address
	 * @returns {SPIBufferSource}
	 */
	static encodeAddress(address) {
		const parts = (typeof address === 'string') ? parseDotQuad(address) :
			Array.isArray(address) ? address :
			(address instanceof Object && 'a' in address) ? [ address.a, address.b, address.c, address.d] :
			(address instanceof Object && 'dotQuad' in address) ? parseDotQuad(address.dotQuad) :
			undefined

		if(parts === undefined) { throw new Error('failed to parse address') }
		if(!Array.isArray(parts)) { throw new Error('invalid parts array') }
		if(parts.length !== ADDRESS_SIZE) { throw new Error('invalid parts length') }

		const ok = parts.every(part => part <= 255 && part >= 0)
		if(!ok) { throw new RangeError('out of bounds') }

		// console.log('encode address parts', parts)

		return Uint8Array.from(parts)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {HardwareAddressOutput}
	*/
	static decodeHardwareAddress(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ a, b, c, d, e, f ] = u8

		if(a === undefined) { throw new Error('undefined hardware address part (a)') }
		if(b === undefined) { throw new Error('undefined hardware address part (b)') }
		if(c === undefined) { throw new Error('undefined hardware address part (c)') }
		if(d === undefined) { throw new Error('undefined hardware address part (d)') }
		if(e === undefined) { throw new Error('undefined hardware address part (e)') }
		if(f === undefined) { throw new Error('undefined hardware address part (f))') }

		const canonical = [...u8].map(octet => octet.toString(16).padStart(2, '0')).join(':')

		return {
			a, b, c, d, e, f,
			canonical
		}
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {SPIBufferSource}
	 */
	static encodeHardwareAddress(hardwareAddress) {
		const parts = (typeof hardwareAddress === 'string') ? parseHardwareAddress(hardwareAddress) :
			(Array.isArray(hardwareAddress)) ? hardwareAddress :
			(hardwareAddress instanceof Object && 'a' in hardwareAddress) ? [
				hardwareAddress.a,
				hardwareAddress.b,
				hardwareAddress.c,
				hardwareAddress.d,
				hardwareAddress.e,
				hardwareAddress.f
			] :
			undefined

		if(parts === undefined) { throw new Error('failed to parse address') }
		if(!Array.isArray(parts)) { throw new Error('invalid parts array') }
		if(parts.length !== HARDWARE_ADDRESS_SIZE) { throw new Error('invalid parts length') }

		const ok = parts.every(part => part <= 255 && part >= 0)
		if(!ok) { throw new RangeError('out of bounds') }

		return Uint8Array.from(parts)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePort(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} port
	 * @returns {SPIBufferSource}
	 */
	static encodePort(port) {
		return ConverterUtil.encodeU16BE(port)
	}
}
