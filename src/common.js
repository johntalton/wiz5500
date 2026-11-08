import { BitSmush } from "@johntalton/bitsmush"
import { BLOCKS, SOCKET_BLOCK_SIZE } from "./defs.js"

/** @import { SPIBus, SPIBufferSource } from '@johntalton/and-other-delights'  */
/** @import { SocketNumber, Block } from './types.js' */

/** @typedef {ArrayBuffer | ArrayBufferView<ArrayBuffer>} CommonBufferSource */

export const SPI_FRAME_HEADER_SIZE = 3 // 16bit address, 8bit control

export const FRAME_BYTE_MODE_VARIABLE = 0b00
export const FRAME_BYTE_MODE_1_BYTE = 0b01
export const FRAME_BYTE_MODE_2_BYTES = 0b10
export const FRAME_BYTE_MODE_4_BYTES = 0b11

/** @typedef {FRAME_BYTE_MODE_VARIABLE | FRAME_BYTE_MODE_1_BYTE | FRAME_BYTE_MODE_2_BYTES | FRAME_BYTE_MODE_4_BYTES} FrameByteMode */

/**
 * @param {number} block
 * @returns {block is Block}
 */
export function isBlock(block) {
	return (block >= 0) && (block <= 0x1F)
}

export class Common {
	/**
	 * @param {Block} block
	 * @param {number} address
	 * @param {boolean} write
	 * @param {FrameByteMode} byteMode
	 * @param {CommonBufferSource|undefined} [data]
	 */
	static #frame(block, address, write, byteMode, data) {
		// address / control / date phase
		const rw = write ? 0b1 : 0b0
		const mode = byteMode

		const control = BitSmush.smushBits([ [ 7,5 ], [ 2,1 ], [ 1,2 ] ], [ block, rw, mode ])

		const dataByteSize = data?.byteLength ?? 0

		const buffer = new Uint8Array(SPI_FRAME_HEADER_SIZE + dataByteSize)
		const dv = new DataView(buffer.buffer)

		dv.setUint16(0, address, false)
		dv.setUint8(2, control)

		if(data !== undefined && dataByteSize > 0) {
			const data8 = ArrayBuffer.isView(data) ?
				new Uint8Array(data.buffer, data.byteOffset, data.byteLength) :
				new Uint8Array(data)

			buffer.set(data8, SPI_FRAME_HEADER_SIZE)
		}

		return buffer
	}

	/**
	 * @param {SPIBus} bus
	 * @param {Block} block
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	static async #readRegister(bus, block, address, length) {
		// console.log('readRegister', block, address.toString(16), length)
		const frame = Common.#frame(block, address, false, FRAME_BYTE_MODE_VARIABLE)

		const result = await bus.transfer({
			sendBuffer: frame,
			receiveBufferLength: length
		})

		// console.log('readRegister result', result)
		if(result.bytesWritten  !== SPI_FRAME_HEADER_SIZE) { throw new Error('write failure') }
		if(result.readBuffer === undefined) { throw new Error('read failure') }
		if(result.readBuffer.byteLength < length) { throw new RangeError('invalid read length') }
		return result.readBuffer
	}

	/**
	 * @param {SPIBus} bus
	 * @param {Block} block
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	static async writeRegister(bus, block, address, buffer) {
		const frame = Common.#frame(block, address, true, FRAME_BYTE_MODE_VARIABLE, buffer)
		// console.log('writeRegister frame', frame)
		const _result = await bus.transfer({
			sendBuffer: frame,
			receiveBufferLength: 0
		})

		// console.log('writeRegister result', result)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	static async writeCommon(bus, address, buffer) {
		return Common.writeRegister(bus, BLOCKS.COMMON, address, buffer)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	static async writeSocket(bus, socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0 + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }
		return Common.writeRegister(bus, block, address, buffer)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	static async writeSocketTX(bus, socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0_TX + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }
		return Common.writeRegister(bus, block, address, buffer)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	static async writeSocketRX(bus, socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0_RX + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }
		return Common.writeRegister(bus, block, address, buffer)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	static async readCommon(bus, address, length) {
		return Common.#readRegister(bus, BLOCKS.COMMON, address, length)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	static async readSocket(bus, socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0 + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }
		return Common.#readRegister(bus, block, address, length)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	static async readSocketTX(bus, socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0_TX + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }
		return Common.#readRegister(bus, block, address, length)
	}

	/**
	 * @param {SPIBus} bus
	 * @param {SocketNumber} socketNumber
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	static async readSocketRX(bus, socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0_RX + (socketNumber * SOCKET_BLOCK_SIZE)
		if(!isBlock(block)) { throw new RangeError('invalid block') }

		return Common.#readRegister(bus, block, address, length)
	}
}
