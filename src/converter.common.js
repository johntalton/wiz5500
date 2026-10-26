/** biome-ignore-all lint/style/noExcessiveLinesPerFile: <explanation> */
import { BitSmush } from '@johntalton/bitsmush'
import { ConverterUtil } from './converter.util.js'

/** @import {
	Mode,
	Interrupt,
	InterruptMask,
	SocketInterrupt,
	SocketInterruptMask,
	PHYConfig,
	PHYConfigWithStatus
} from './types.js' */
/** @import { SPIBufferSource } from './spi.js' */


export class Converter {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Mode}
	 */
	static decodeMode(buffer) {
		const mode = ConverterUtil.toU8(buffer)

		const reset = BitSmush.extractBits(mode, 7, 1) === 1
		const wakeOnLAN = BitSmush.extractBits(mode, 5, 1) === 1
		const blockPing = BitSmush.extractBits(mode, 4, 1) === 1
		const enablePPPoE = BitSmush.extractBits(mode, 3, 1) === 1
		const forceARP = BitSmush.extractBits(mode, 1, 1) === 1

		return {
			reset,
			wakeOnLAN,
			blockPing,
			enablePPPoE,
			forceARP
		}
	}

	/**
	 * @param {Mode} mode
	 * @returns {SPIBufferSource}
	 */
	static encodeMode(mode) {
		const rst = mode.reset ? 1 : 0
		const wol = mode.wakeOnLAN ? 1 : 0
		const pb = mode.blockPing ? 1 : 0
		const pppoe = mode.enablePPPoE ? 1 : 0
		const farp = mode.forceARP ? 1 : 0

		const value = BitSmush.smushBits(
			[ [7,1], [5,1], [4,1], [3,1], [1,1] ],
			[ rst, wol, pb, pppoe, farp ])

		return ConverterUtil.fromU8(value)
	}


	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeInterruptLowLevelTimer(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} level
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptLowLevelTimer(level) {
		return ConverterUtil.fromU16BE(level)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Interrupt}
	 */
	static decodeInterrupt(buffer) {
		const interrupt = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {Interrupt} interrupt
	 * @returns {SPIBufferSource}
	 */
	static encodeInterrupt(interrupt) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {InterruptMask}
	 */
	static decodeInterruptMask(buffer) {
		const mask = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {InterruptMask} interruptMask
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptMask(interruptMask) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketInterrupt}
	 */
	static decodeSocketInterrupt(buffer) {
		const interrupt = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {SocketInterrupt} socketInterrupt
	 * @returns {SPIBufferSource}
	 */
	static encodeSocketInterrupt(socketInterrupt) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketInterruptMask}
	 */
	static decodeSocketInterruptMask(buffer) {
		const mask = ConverterUtil.toU8(buffer)

		return {

		}
	}

	/**
	 * @param {SocketInterruptMask} socketInterruptMask
	 * @returns {SPIBufferSource}
	 */
	static encodeSocketInterruptMask(socketInterruptMask) {


		return ConverterUtil.fromU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRetryTime(buffer) {
		// todo units 100us
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} retryTime
	 * @returns {SPIBufferSource}
	 */
	static encodeRetryTime(retryTime) {
		// todo units 100us
		return ConverterUtil.fromU16BE(retryTime)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRetryCount(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {number} count
	 * @returns {SPIBufferSource}
	 */
	static encodeRetryCount(count) {
		return ConverterUtil.fromU8(count)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPLCPRequestTimer(buffer) {
		// todo units 25ms
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {number} time
	 * @returns {SPIBufferSource}
	 */
	static encodePPPLCPRequestTimer(time) {
		// todo units 25ms
		return ConverterUtil.fromU8(time)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPLCPMagicNumber(buffer) {
		return ConverterUtil.toU8(buffer)
	}

	/**
	 * @param {number} magic
	 * @returns {SPIBufferSource}
	 */
	static encodePPPLCPMagicNumber(magic) {
		return ConverterUtil.fromU8(magic)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPSessionIdentification(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} id
	 * @returns {SPIBufferSource}
	 */
	static encodePPPSessionIdentification(id) {
		return ConverterUtil.fromU16BE(id)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPMaximumSegmentSize(buffer) {
		return ConverterUtil.toU16BE(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {SPIBufferSource}
	 */
	static encodePPPMaximumSegmentSize(size) {
		return ConverterUtil.fromU16BE(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {PHYConfigWithStatus}
	 */
	static decodePHYConfig(buffer) {
		const config = ConverterUtil.toU8(buffer)

		const reset = BitSmush.extractBits(config, 7, 1) === 0
		const softwareConfiguredMode = BitSmush.extractBits(config, 6, 1) === 1
		const mode = BitSmush.extractBits(config, 5, 3)
		const fullDuplex = BitSmush.extractBits(config, 2, 1) === 1
		const highSpeed = BitSmush.extractBits(config, 1, 1) === 1
		const up = BitSmush.extractBits(config, 0, 1) === 1

		return {
			reset,
			softwareConfiguredMode,
			mode,
			fullDuplex,
			highSpeed,
			up
		}
	}

	/**
	 * @param {PHYConfig} phyConfig
	 * @returns {SPIBufferSource}
	 */
	static encodePHYConfig(phyConfig) {
		const reset = phyConfig.reset ? 0 : 1
		const opmd = phyConfig.softwareConfiguredMode ? 1 : 0
		const opmdc = phyConfig.mode & 0b111

		const config = BitSmush.smushBits([[ 7,1 ], [ 6,1 ], [ 5,3 ]], [ reset, opmd, opmdc ])

		return ConverterUtil.fromU8(config)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeChipVersion(buffer) {
		return ConverterUtil.toU8(buffer)
	}





}

