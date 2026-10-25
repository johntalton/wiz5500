import { BitSmush } from '@johntalton/bitsmush'
import { ConverterUtil } from './converter.util.js'

/** @import { SPIBufferSource } from './spi.js' */
/** @import { SocketCommand, SocketStatus, BufferSize, SocketMode } from './types.js' */

export class ConverterSocket {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketMode}
	 */
	static toMode(buffer) {
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
	static fromMode(mode) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketCommand}
	 */
	static toCommand(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {SocketCommand} command
	 * @returns {SPIBufferSource}
	 */
	static fromCommand(command) {
		return ConverterUtil.fromU8(command)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {}
	 */
	static toSocketInterrupt(buffer) {
		const interrupt = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {} interrupt
	 * @returns {SPIBufferSource}
	 */
	static fromSocketInterrupt(interrupt) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketStatus}
	 */
	static toStatus(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toMaximumSegmentSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {SPIBufferSource}
	 */
	static fromMaximumSegmentSize(size) {
		return ConverterUtil.fromU16BE(size)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toIPTypeOfService(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} typeOfService
	 * @returns {SPIBufferSource}
	 */
	static fromIPTypeOfService(typeOfService) {
		return ConverterUtil.fromU8(typeOfService)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toIPTimeToLive(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} timeToLive
	 * @returns {SPIBufferSource}
	 */
	static fromIPTimeToLive(timeToLive) {
		return ConverterUtil.fromU8(timeToLive)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static toReceiveBufferSize(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static fromReceiveBufferSize(size) {
		return ConverterUtil.fromU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static toTransmitBufferSize(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static fromTransmitBufferSize(size) {
		return ConverterUtil.fromU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toTXFreeSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toTXReadPointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toTXWritePointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static fromTXWritePointer(pointer) {
		return ConverterUtil.fromU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toRXReceiveSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toRXReadPointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static fromRXReadPointer(pointer) {
		return ConverterUtil.fromU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toRXWritePointer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 */
	static toInterruptMask(buffer) {
		const mask = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {} mask
	 * @returns {SPIBufferSource}
	 */
	static fromInterruptMask(mask) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toFragmentOffsetInIPHeader(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} offset
	 * @returns {SPIBufferSource}
	 */
	static fromFragmentOffsetInIPHeader(offset) {
		return ConverterUtil.fromU16BE(offset)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static toKeepAliveTimer(buffer) {
		// todo units 5s
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {number} time
	 * @returns {SPIBufferSource}
	 */
	static fromKeepAliveTimer(time) {
		// todo units 5s
		return ConverterUtil.fromU8(time)
	}
}