/** biome-ignore-all lint/style/noNestedTernary: just cause */
import { ADDRESS_SIZE, HARDWARE_ADDRESS_SIZE } from './defs.js'

/** @import { SPIBufferSource } from './spi.js' */
/** @import {
	Address,
	AddressInput,
	HardwareAddress,
	HardwareAddressInput
} from './types.js' */

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
 */
export function parseHardwareAddress(address) {
	if(address === undefined) { return undefined }

	const parts = address
		.split(':')
		.map(part => Number.parseInt(part, 16))

	const outOfRange = !parts.every(part => ((part <= 255) && (part >= 0)))
	if(outOfRange) { throw new RangeError('invalid dot quad range') }

	return parts
}

export class ConverterUtil {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toU16BE(buffer) {
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset) :
			new DataView(buffer)

		return dv.getUint16(0, false)
	}

	/**
	 * @param {number} value
	 * @returns {SPIBufferSource}
	 */
	static fromU16BE(value) {
		const dv = new DataView(new ArrayBuffer(2))
		dv.setUint16(0, value, false)
		return dv
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toU8(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset) :
			new Uint8Array(buffer)

		const [ value ] = u8

		if(value === undefined) { throw new Error('undefined value') }

		return value
	}

	/**
	 * @param {number} value
	 * @returns {SPIBufferSource}
	 */
	static fromU8(value) {
		return Uint8ClampedArray.from([ value ])
	}

	//
	//
	//

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Address}
	 */
	static toAddress(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset) :
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
	static fromAddress(address) {
		const parts = (typeof address === 'string') ? parseDotQuad(address) :
			Array.isArray(address) ? address :
			('a' in address) ? [ address.a, address.b, address.c, address.d] :
			('dotQuad' in address) ? parseDotQuad(address.dotQuad) :
			undefined

		if(parts === undefined) { throw new Error('failed to parse address') }
		if(!Array.isArray(parts)) { throw new Error('invalid parts') }
		if(parts.length !== ADDRESS_SIZE) { throw new Error('invalid parts length') }

		const ok = parts.every(part => part <= 255 && part >= 0)
		if(!ok) { throw new Error('invalid parts') }

		return Uint8Array.from(parts)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {HardwareAddress}
	*/
	static toHardwareAddress(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset) :
			new Uint8Array(buffer)

		const [ a, b, c, d, e, f ] = u8

		if(a === undefined) { throw new Error('undefined hardware address part (a)') }
		if(b === undefined) { throw new Error('undefined hardware address part (b)') }
		if(c === undefined) { throw new Error('undefined hardware address part (c)') }
		if(d === undefined) { throw new Error('undefined hardware address part (d)') }
		if(e === undefined) { throw new Error('undefined hardware address part (e)') }
		if(f === undefined) { throw new Error('undefined hardware address part (f))') }

		return {
			a, b, c, d, e, f
		}
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {SPIBufferSource}
	 */
	static fromHardwareAddress(hardwareAddress) {
		const parts = (typeof hardwareAddress === 'string') ? parseHardwareAddress(hardwareAddress) :
			(Array.isArray(hardwareAddress)) ? hardwareAddress :
			('a' in hardwareAddress) ? [
				hardwareAddress.a,
				hardwareAddress.b,
				hardwareAddress.c,
				hardwareAddress.d,
				hardwareAddress.e,
				hardwareAddress.f
			] :
			undefined

		if(parts === undefined) { throw new Error('failed to parse address') }
		if(!Array.isArray(parts)) { throw new Error('invalid parts') }
		if(parts.length !== HARDWARE_ADDRESS_SIZE) { throw new Error('invalid parts length') }

		const ok = parts.every(part => part <= 255 && part >= 0)
		if(!ok) { throw new Error('invalid parts') }

		return Uint8Array.from(parts)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toPort(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} port
	 * @returns {SPIBufferSource}
	 */
	static fromPort(port) {
		return ConverterUtil.fromU16BE(port)
	}
}
