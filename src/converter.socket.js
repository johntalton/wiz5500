import { BitSmush } from '@johntalton/bitsmush'
import { ConverterUtil } from './converter.util.js'
import { BUFFER_SIZES } from './defs.js'

/** @import { SPIBufferSource } from './spi.js' */
/** @import { SocketCommand, SocketStatus, BufferSize, SocketMode } from './types.js' */

/**
 * @param {number} size
 * @returns {size is BufferSize}
 */
export function isBufferSize(size) {
	return BUFFER_SIZES.includes(size)
}

export class ConverterSocket {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketMode}
	 */
	static decodeMode(buffer) {
		const mode = ConverterUtil.toU8(buffer)



		return {
			enableMulticast,
			enableMACFilter,
			blockBroadcasting,
			noDelayACK,
			enableUnicast,
			blockIPv6,
			protocol
		}
	}

	/**
	 * @param {SocketMode} mode
	 * @returns {SPIBufferSource}
	 */
	static encodeMode(mode) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketCommand}
	 */
	static decodeCommand(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {SocketCommand} command
	 * @returns {SPIBufferSource}
	 */
	static encodeCommand(command) {
		return ConverterUtil.fromU8(command)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {}
	 */
	static decodeSocketInterrupt(buffer) {
		const interrupt = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {} interrupt
	 * @returns {SPIBufferSource}
	 */
	static encodeSocketInterrupt(interrupt) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketStatus}
	 */
	static decodeStatus(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeMaximumSegmentSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {SPIBufferSource}
	 */
	static encodeMaximumSegmentSize(size) {
		return ConverterUtil.fromU16BE(size)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeIPTypeOfService(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} typeOfService
	 * @returns {SPIBufferSource}
	 */
	static encodeIPTypeOfService(typeOfService) {
		return ConverterUtil.fromU8(typeOfService)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeIPTimeToLive(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} timeToLive
	 * @returns {SPIBufferSource}
	 */
	static encodeIPTimeToLive(timeToLive) {
		return ConverterUtil.fromU8(timeToLive)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static decodeReceiveBufferSize(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static encodeReceiveBufferSize(size) {
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return ConverterUtil.fromU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static decodeTransmitBufferSize(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static encodeTransmitBufferSize(size) {
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return ConverterUtil.fromU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXFreeSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXReadPointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXWritePointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static encodeTXWritePointer(pointer) {
		return ConverterUtil.fromU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXReceiveSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXReadPointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static encodeRXReadPointer(pointer) {
		return ConverterUtil.fromU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXWritePointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 */
	static decodeInterruptMask(buffer) {
		const mask = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {} mask
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptMask(mask) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeFragmentOffsetInIPHeader(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} offset
	 * @returns {SPIBufferSource}
	 */
	static encodeFragmentOffsetInIPHeader(offset) {
		return ConverterUtil.fromU16BE(offset)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeKeepAliveTimer(buffer) {
		// todo units 5s
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {number} time
	 * @returns {SPIBufferSource}
	 */
	static encodeKeepAliveTimer(time) {
		// todo units 5s
		return ConverterUtil.fromU8(time)
	}
}