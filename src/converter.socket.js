/** biome-ignore-all lint/style/noExcessiveLinesPerFile: does it all */
import { BitSmush } from '@johntalton/bitsmush'
import { ConverterUtil } from './converter.util.js'
import { BUFFER_SIZES, SOCKET_PROTOCOL } from './defs.js'

/** @import { SPIBufferSource } from '@johntalton/and-other-delights' */
/** @import { SocketCommand, SocketSocketInterrupt, SocketSocketInterruptMask, SocketStatus, BufferSize, SocketMode, SocketModeClosed, SocketModeTCP, SocketModeUDP, SocketModeMACRaw } from './types.js' */

/**
 * @param {number} size
 * @returns {size is BufferSize}
 */
export function isBufferSize(size) {
	return BUFFER_SIZES.includes(size)
}

/**
 * @param {number} status
 * @returns {status is SocketStatus}
 */
export function isSocketStatus(status) {
	// todo better check
	return status >= 0 && status <= 0xFF
}

/**
 * @param {number} command
 * @returns {command is SocketCommand}
 */
export function isSocketCommand(command) {
	// todo better check
	return command >= 0 && command <= 0xFF
}

export class ConverterSocket {
	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketMode}
	 */
	static decodeMode(buffer) {
		const mode = ConverterUtil.decodeU8(buffer)

		const protocol = BitSmush.extractBits(mode, 3, 4)

		if(protocol === SOCKET_PROTOCOL.CLOSED) {
			return {
				protocol
			}
		}

		if(protocol === SOCKET_PROTOCOL.TCP) {
			const enableNoDelayedACK = BitSmush.extractBits(mode, 5, 1) === 1

			return {
				protocol,
				enableNoDelayedACK
			}
		}

		if(protocol === SOCKET_PROTOCOL.UDP) {
			const enabledUDPMulticasting = BitSmush.extractBits(mode, 7, 1) === 1
			const enableBroadcastBlocking = BitSmush.extractBits(mode, 6, 1) === 1
			const enableIGMPv1 = BitSmush.extractBits(mode, 5, 1) === 1
			const enableUnicastBlocking = BitSmush.extractBits(mode, 4, 1) === 1

			return {
				protocol,
				enabledUDPMulticasting,
				enableBroadcastBlocking,
				enableIGMPv1,
				enableUnicastBlocking
			}
		}

		if(protocol === SOCKET_PROTOCOL.MAC_RAW) {
			const enableMACFiltering = BitSmush.extractBits(mode, 7, 1) === 1
			const enableBroadcastBlocking = BitSmush.extractBits(mode, 6, 1) === 1
			const enableMulticastBlocking = BitSmush.extractBits(mode, 5, 1) === 1
			const enableIPv6Blocking = BitSmush.extractBits(mode, 4, 1) === 1

			return {
				protocol,
				enableMACFiltering,
				enableBroadcastBlocking,
				enableMulticastBlocking,
				enableIPv6Blocking
			}
		}

		throw new Error('unknown socket protocol')
	}

	/**
	 * @param {SocketModeClosed} mode
	 * @returns {SPIBufferSource}
	 */
	static #encodeModeClose(mode) {
		const value = BitSmush.smushBits([ [ 3,4 ] ], [ mode.protocol ])
		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SocketModeTCP} mode
	 * @returns {SPIBufferSource}
	 */
	static #encodeModeTCP(mode) {
		const nd = mode.enableNoDelayedACK ? 1 : 0

		const value = BitSmush.smushBits([ [ 5,1 ], [ 3,4 ] ], [ nd, mode.protocol ])
		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SocketModeUDP} mode
	 * @returns {SPIBufferSource}
	 */
	static #encodeModeUDP(mode) {
		const multi = mode.enabledUDPMulticasting ? 1 : 0
		const bcastb = mode.enableBroadcastBlocking ? 1 : 0
		const mc = mode.enableIGMPv1 ? 1 : 0
		const ucastb = mode.enableUnicastBlocking ? 1 : 0

		const value = BitSmush.smushBits([ [ 7,1 ], [ 6,1 ], [ 5,1 ], [ 4,1 ], [ 3,4 ] ], [ multi, bcastb, mc, ucastb, mode.protocol ])
		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SocketModeMACRaw} mode
	 * @returns {SPIBufferSource}
	 */
	static #encodeModeMACRaw(mode) {
		const mfen = mode.enableMACFiltering ? 1 : 0
		const mmb = mode.enableMulticastBlocking ? 1 : 0
		const mip6b = mode.enableIPv6Blocking ? 1 : 0

		const value = BitSmush.smushBits([ [ 7,1 ], [ 5,1 ], [ 4,1 ], [ 3,4 ] ], [ mfen, mmb, mip6b, mode.protocol ])
		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SocketMode} mode
	 * @returns {SPIBufferSource}
	 */
	static encodeMode(mode) {
		if(mode.protocol === SOCKET_PROTOCOL.CLOSED) {
			return ConverterSocket.#encodeModeClose(mode)
		}

		if(mode.protocol === SOCKET_PROTOCOL.TCP) {
			return ConverterSocket.#encodeModeTCP(mode)
		}

		if(mode.protocol === SOCKET_PROTOCOL.UDP) {
			return ConverterSocket.#encodeModeUDP(mode)
		}

		if(mode.protocol === SOCKET_PROTOCOL.MAC_RAW) {
			return ConverterSocket.#encodeModeMACRaw(mode)
		}

		throw new Error('unknown protocol')
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketCommand}
	 */
	static decodeCommand(buffer) {
		const command = ConverterUtil.decodeU8(buffer)
		if(!isSocketCommand(command)) { throw new Error('unknown socket command') }
		return command
	}

	/**
	 * @param {SocketCommand} command
	 * @returns {SPIBufferSource}
	 */
	static encodeCommand(command) {
		return ConverterUtil.encodeU8(command)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketSocketInterrupt}
	 */
	static decodeSocketInterrupt(buffer) {
		const interrupt = ConverterUtil.decodeU8(buffer)

		const sendOk = BitSmush.extractBits(interrupt, 4, 1) === 1
		const timeout = BitSmush.extractBits(interrupt, 3, 1) === 1
		const receive = BitSmush.extractBits(interrupt, 2, 1) === 1
		const disconnect = BitSmush.extractBits(interrupt, 1, 1) === 1
		const connect = BitSmush.extractBits(interrupt, 0, 1) === 1

		return {
			sendOk,
			timeout,
			receive,
			disconnect,
			connect
		}
	}

	/**
	 * @param {Partial<SocketSocketInterrupt>} interrupt
	 * @returns {SPIBufferSource}
	 */
	static encodeSocketInterrupt(interrupt) {
		const CLEAR = 1
		const PRESERVE = 0

		const sendOk = interrupt.sendOk === true ? CLEAR : PRESERVE
		const timeout = interrupt.timeout === true ? CLEAR : PRESERVE
		const receive = interrupt.receive === true ? CLEAR : PRESERVE
		const disconnect = interrupt.disconnect === true ? CLEAR : PRESERVE
		const connect = interrupt.connect === true ? CLEAR : PRESERVE

		const value = BitSmush.smushBits([
			[ 4,1 ], [ 3,1 ], [ 2,1 ], [ 1,1 ], [ 0,1 ]
		], [ sendOk, timeout, receive, disconnect, connect ])

		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketStatus}
	 */
	static decodeStatus(buffer) {
		const status = ConverterUtil.decodeU8(buffer)
		if(!isSocketStatus(status)) { throw new Error('unknown socket status') }
		return status
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeMaximumSegmentSize(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {SPIBufferSource}
	 */
	static encodeMaximumSegmentSize(size) {
		return ConverterUtil.encodeU16BE(size)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeIPTypeOfService(buffer) {
		return ConverterUtil.decodeU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} typeOfService
	 * @returns {SPIBufferSource}
	 */
	static encodeIPTypeOfService(typeOfService) {
		return ConverterUtil.encodeU8(typeOfService)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeIPTimeToLive(buffer) {
		return ConverterUtil.decodeU8(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} timeToLive
	 * @returns {SPIBufferSource}
	 */
	static encodeIPTimeToLive(timeToLive) {
		return ConverterUtil.encodeU8(timeToLive)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static decodeReceiveBufferSize(buffer) {
		const size = ConverterUtil.decodeU8(buffer)
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return size
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static encodeReceiveBufferSize(size) {
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return ConverterUtil.encodeU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {BufferSize}
	 */
	static decodeTransmitBufferSize(buffer) {
		const size =  ConverterUtil.decodeU8(buffer)
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return size
	}

	/**
	 * @param {BufferSize} size
	 * @returns {SPIBufferSource}
	 */
	static encodeTransmitBufferSize(size) {
		if(!isBufferSize(size)) { throw new Error('invalid buffer size') }
		return ConverterUtil.encodeU8(size)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXFreeSize(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXReadPointer(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeTXWritePointer(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static encodeTXWritePointer(pointer) {
		return ConverterUtil.encodeU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXReceiveSize(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXReadPointer(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} pointer
	 * @returns {SPIBufferSource}
	 */
	static encodeRXReadPointer(pointer) {
		return ConverterUtil.encodeU16BE(pointer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeRXWritePointer(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {SocketSocketInterruptMask}
	 */
	static decodeInterruptMask(buffer) {
		const mask = ConverterUtil.decodeU8(buffer)

		const enableSendOk = BitSmush.extractBits(mask, 4, 1) === 1
		const enableTimeout = BitSmush.extractBits(mask, 3, 1) === 1
		const enableReceive = BitSmush.extractBits(mask, 2, 1) === 1
		const enableDisconnect = BitSmush.extractBits(mask, 1, 1) === 1
		const enableConnect = BitSmush.extractBits(mask, 0, 1) === 1

		return {
			enableSendOk,
			enableTimeout,
			enableReceive,
			enableDisconnect,
			enableConnect
		}
	}

	/**
	 * @param {SocketSocketInterruptMask} mask
	 * @returns {SPIBufferSource}
	 */
	static encodeInterruptMask(mask) {
		const sendOk = mask.enableSendOk ? 1 : 0
		const timeout = mask.enableTimeout ? 1 : 0
		const recv = mask.enableReceive ? 1 : 0
		const disconnect = mask.enableDisconnect ? 1 : 0
		const con = mask.enableConnect ? 1 : 0

		const value = BitSmush.smushBits(
			[ [ 4,1 ], [ 3,1 ], [ 2,1 ], [ 1,1 ], [ 0,1 ] ],
			[ sendOk, timeout, recv, disconnect, con ])

		return ConverterUtil.encodeU8(value)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeFragmentOffsetInIPHeader(buffer) {
		return ConverterUtil.decodeU16BE(buffer)
	}

	/**
	 * @param {number} offset
	 * @returns {SPIBufferSource}
	 */
	static encodeFragmentOffsetInIPHeader(offset) {
		return ConverterUtil.encodeU16BE(offset)
	}

	/**
	 * @param {SPIBufferSource} buffer
	 * @returns {number}
	 */
	static decodeKeepAliveTimer(buffer) {
		// todo units 5s
		return ConverterUtil.decodeU8(buffer)
	}

	/**
	 * @param {number} time
	 * @returns {SPIBufferSource}
	 */
	static encodeKeepAliveTimer(time) {
		// todo units 5s
		return ConverterUtil.encodeU8(time)
	}
}