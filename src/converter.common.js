/** biome-ignore-all lint/style/noExcessiveLinesPerFile: full converter */
import { BitSmush } from '@johntalton/bitsmush'
import { ConverterUtil } from './converter.util.js'

/** @import {
	Mode,
	Interrupt,
	InterruptMask,
	SocketInterrupt,
	SocketInterruptMask,
	PHYConfig,
	PHYConfigWithStatus,
	PHYOperationMode
} from './types.js' */
/** @import { SPIBufferSource } from '@johntalton/and-other-delights' */

export const RETRY_TIME_UNITS_US = 100

export const PLL_CLOCK_MHZ = 150

export const PPP_LCP_REQUEST_TIMER_UNITS_MS = 25

/**
 * @param {number} mode
 * @returns {mode is PHYOperationMode}
 */
export function isOperationMode(mode) {
	return mode <= 0b111 && mode >= 0
}

export class ConverterCommon {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Mode}
	 */
	static decodeMode(buffer) {
		const mode = ConverterUtil.decodeU8(buffer)

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

		// console.log('mode parts', value)
		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static _decodeInterruptLowLevelTimer(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} level
	 * @returns {SPIBufferSource}
	 */
	static _encodeInterruptLowLevelTimer(level) {
		return ConverterUtil.encodeU16BE(level)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Temporal.Duration}
	 */
	static decodeInterruptAssertWaitTime(buffer) {
		const level = ConverterUtil.decodeU16BE(buffer)
		if(level === 0) {
			// new duration are blank (aka zero)
			return new Temporal.Duration()
		}

		const nanoseconds = Math.round((4000 * (level + 1)) / PLL_CLOCK_MHZ)
		return Temporal.Duration.from({ nanoseconds })
	}

	/**
	 * @param {Temporal.Duration} duration
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptAssertWaitTime(duration) {
		if(duration.sign === -1) { throw new RangeError('duration must be positive') }

		// blank checks for zero
		if(duration.blank) { return ConverterUtil.encodeU16BE(0) }

		const nanoseconds = duration.total('nanoseconds')
		const level = Math.round((nanoseconds * PLL_CLOCK_MHZ) / 4000 - 1)

		if(level <= 0) { throw new RangeError('duration too small') }
		if(level > 0xFF_FF) { throw new RangeError('duration too large') }

		return ConverterUtil.encodeU16BE(level)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Interrupt}
	 */
	static decodeInterrupt(buffer) {
		const interrupt = ConverterUtil.decodeU8(buffer)

		const conflict = BitSmush.extractBits(interrupt, 7, 1) === 1
		const unreachable = BitSmush.extractBits(interrupt, 6, 1) === 1
		const closedPPPoE = BitSmush.extractBits(interrupt, 5, 1) === 1
		const magicWOL = BitSmush.extractBits(interrupt, 4, 1) === 1

		return {
			conflict,
			unreachable,
			closedPPPoE,
			magicWOL
		}
	}

	/**
	 * @param {Partial<Interrupt>} interrupt
	 * @returns {SPIBufferSource}
	 */
	static encodeInterrupt(interrupt) {
		const CLEAR = 1
		const PRESERVE = 0

		const conflict = interrupt.conflict === true ? CLEAR : PRESERVE
		const unreachable = interrupt.unreachable === true ? CLEAR : PRESERVE
		const closedPPPoE = interrupt.closedPPPoE === true ? CLEAR : PRESERVE
		const magicWOL = interrupt.magicWOL === true ? CLEAR : PRESERVE

		const value = BitSmush.smushBits(
			[ [ 7,1 ], [ 6,1 ], [ 5,1 ], [ 4,1 ] ],
			[ conflict, unreachable, closedPPPoE, magicWOL ])

		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {InterruptMask}
	 */
	static decodeInterruptMask(buffer) {
		const mask = ConverterUtil.decodeU8(buffer)

		const enableConflict = BitSmush.extractBits(mask, 7, 1) === 1
		const enableUnreachable = BitSmush.extractBits(mask, 6, 1) === 1
		const enableClosedPPPoE = BitSmush.extractBits(mask, 5, 1) === 1
		const enableMagicWOL = BitSmush.extractBits(mask, 4, 1) === 1

		return {
			enableConflict,
			enableUnreachable,
			enableClosedPPPoE,
			enableMagicWOL
		}
	}

	/**
	 * @param {InterruptMask} interruptMask
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptMask(interruptMask) {
		const enableConflict = interruptMask.enableConflict ? 1 : 0
		const enableUnreachable = interruptMask.enableUnreachable ? 1 : 0
		const enableClosedPPPoE = interruptMask.enableClosedPPPoE ? 1 : 0
		const enableMagicWOL = interruptMask.enableMagicWOL ? 1 : 0

		const value = BitSmush.smushBits(
			[ [ 7,1 ], [ 6,1 ], [ 5,1 ], [ 4,1 ] ],
			[ enableConflict, enableUnreachable, enableClosedPPPoE, enableMagicWOL ])

		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketInterrupt}
	 */
	static decodeSocketInterrupt(buffer) {
		const interrupt = ConverterUtil.decodeU8(buffer)

		return BitSmush.unSmushBits(
			[ [ 0,1 ], [ 1,1 ], [ 2,1 ], [ 3,1 ], [ 4,1 ], [ 5,1 ], [ 6,1 ], [ 7,1 ] ],
			interrupt)
				.map(value => value === 1)
	}

	// /**
	//  * @param {SocketInterrupt} socketInterrupt
	//  * @returns {SPIBufferSource}
	//  */
	// static encodeSocketInterrupt(socketInterrupt) {


	// 	return ConverterUtil.encodeU8(value)
	// }

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketInterruptMask}
	 */
	static decodeSocketInterruptMask(buffer) {
		const mask = ConverterUtil.decodeU8(buffer)

		return BitSmush.unSmushBits(
			[ [ 0,1 ], [ 1,1 ], [ 2,1 ], [ 3,1 ], [ 4,1 ], [ 5,1 ], [ 6,1 ], [ 7,1 ] ],
			mask)
				.map(value => value === 1)
	}

	/**
	 * @param {SocketInterruptMask} socketInterruptMask
	 * @returns {SPIBufferSource}
	 */
	static encodeSocketInterruptMask(socketInterruptMask) {
		const value = BitSmush.smushBits(
			[ [ 0,1 ], [ 1,1 ], [ 2,1 ], [ 3,1 ], [ 4,1 ], [ 5,1 ], [ 6,1 ], [ 7,1 ] ],
			socketInterruptMask.map(val => (val ? 1 : 0))
		)

		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static _decodeRetryTime(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} retryTime
	 * @returns {SPIBufferSource}
	 */
	static _encodeRetryTime(retryTime) {
		return ConverterUtil.encodeU16BE(retryTime)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Temporal.Duration}
	 */
	static decodeRetryTime(buffer) {
		const retryTime = ConverterUtil.decodeU16BE(buffer)
		return Temporal.Duration.from({
			microseconds: retryTime * RETRY_TIME_UNITS_US
		})
	}

	/**
	 * @param {Temporal.Duration} retryTimeDuration
	 * @returns {SPIBufferSource}
	 */
	static encodeRetryTime(retryTimeDuration) {
		if(retryTimeDuration.sign === -1) { throw new RangeError('duration must be positive') }
		const retryTime = retryTimeDuration.total('microseconds') / RETRY_TIME_UNITS_US
		// todo round to integer
		// check bounds for min/max
		return ConverterUtil.encodeU16BE(retryTime)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRetryCount(buffer) {
		return ConverterUtil.decodeU8(buffer)
	}

	/**
	 * @param {number} count
	 * @returns {SPIBufferSource}
	 */
	static encodeRetryCount(count) {
		return ConverterUtil.encodeU8(count)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {Temporal.Duration}
	 */
	static decodePPPLinkControlProtocolRequestTimer(buffer) {
		const timer = ConverterUtil.decodeU8(buffer)
		const milliseconds = timer * PPP_LCP_REQUEST_TIMER_UNITS_MS
		return Temporal.Duration.from({ milliseconds })
	}

	/**
	 * @param {Temporal.Duration} duration
	 * @returns {SPIBufferSource}
	 */
	static encodePPPLinkControlProtocolRequestTimer(duration) {
		if(duration.sign === -1) { throw new RangeError('duration must be positive') }
		const timer = Math.round(duration.total('milliseconds') / PPP_LCP_REQUEST_TIMER_UNITS_MS)
		if(timer > 0xFF) { throw new RangeError('duration exceeds max') }
		return ConverterUtil.encodeU8(timer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPLinkControlProtocolMagicNumber(buffer) {
		return ConverterUtil.decodeU8(buffer)
	}

	/**
	 * @param {number} magic
	 * @returns {SPIBufferSource}
	 */
	static encodePPPLinkControlProtocolMagicNumber(magic) {
		return ConverterUtil.encodeU8(magic)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPSessionIdentification(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} id
	 * @returns {SPIBufferSource}
	 */
	static encodePPPSessionIdentification(id) {
		return ConverterUtil.encodeU16BE(id)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodePPPMaximumSegmentSize(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {SPIBufferSource}
	 */
	static encodePPPMaximumSegmentSize(size) {
		return ConverterUtil.encodeU16BE(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {PHYConfigWithStatus}
	 */
	static decodePHYConfig(buffer) {
		const config = ConverterUtil.decodeU8(buffer)

		const reset = BitSmush.extractBits(config, 7, 1) === 0
		const softwareConfiguredMode = BitSmush.extractBits(config, 6, 1) === 1
		const mode = BitSmush.extractBits(config, 5, 3)
		const fullDuplex = BitSmush.extractBits(config, 2, 1) === 1
		const highSpeed = BitSmush.extractBits(config, 1, 1) === 1
		const up = BitSmush.extractBits(config, 0, 1) === 1

		if(!isOperationMode(mode)) { throw new Error('unknown operational mode') }

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

		return ConverterUtil.encodeU8(config)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeChipVersion(buffer) {
		return ConverterUtil.decodeU8(buffer)
	}
}

