import { describe, it } from 'node:test'
import Assert from 'node:assert/strict'

import { BLOCKS } from '@johntalton/wiz5500'
import { Common, isBlock, SPI_FRAME_HEADER_SIZE } from '@johntalton/wiz5500/common'

/** @import { SPIBus, TransferRequest, TransferResult } from '@johntalton/and-other-delights' */

/** @implements {SPIBus} */
class MockBus {
	bytesWritten = 0

	/** @type {ArrayBuffer|ArrayBufferView<ArrayBuffer>|undefined} */
	buffer = undefined

	/**
	 * @readonly
	 * @type {ArrayBuffer|ArrayBufferView<ArrayBuffer>|undefined}
	 * */
	responseBuffer = undefined

	/** @param {ArrayBuffer|ArrayBufferView<ArrayBuffer>} [responseBuffer=undefined]  */
	constructor(responseBuffer = undefined) {
		this.responseBuffer = responseBuffer
	}

	/**
	 * @param {TransferRequest} request
	 * @returns {Promise<TransferResult>}
	 */
	async transfer(request) {
		const { sendBuffer, receiveBufferLength } = request

		this.buffer = undefined
		this.bytesWritten = sendBuffer?.byteLength ?? 0

		if(sendBuffer !== undefined) {
			const sendArrayBuffer = ArrayBuffer.isView(sendBuffer) ?
				sendBuffer.buffer : sendBuffer

			this.buffer = new Uint8Array(sendArrayBuffer.transfer(sendBuffer.byteLength))
		}

		/** @type {ArrayBuffer|ArrayBufferView<ArrayBuffer>} */
		const responseBuffer = this.responseBuffer ?? new ArrayBuffer(receiveBufferLength)
		const len = Math.min(receiveBufferLength, responseBuffer.byteLength)
		const readBuffer = ArrayBuffer.isView(responseBuffer) ?
			new Uint8Array(responseBuffer.buffer, 0, len) :
			new Uint8Array(responseBuffer, 0, len)

		return {
			bytesWritten: this.bytesWritten,
			readBuffer
		}
	}
}


describe('isBlock', () => {
	it('should handle valid (zero)', () => {
		const result = isBlock(0)
		Assert.equal(result, true)
	})

	it('should handle valid', () => {
		const result = isBlock(BLOCKS.SOCKET_2_RX)
		Assert.equal(result, true)
	})

	it('should handle invalid', () => {
		const result = isBlock(0x20)
		Assert.equal(result, false)
	})
})

describe('Common', () => {
	describe('writeRegister', () => {
		it('should handle write', async () => {
			const bus = new MockBus()
			const address = 0xF0_0D
			const buffer = Uint8Array.from([ 77 ])
			await Common.writeRegister(bus, BLOCKS.SOCKET_7_RX, address, buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xF0, 0x0D, 0b1111_11100, 77 ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})

		it('should handle write (ArrayBuffer)', async () => {
			const bus = new MockBus()
			const address = 0xCA_FE
			const buffer = Uint8Array.from([ 77 ])
			await Common.writeRegister(bus, BLOCKS.SOCKET_1_RX, address, buffer.buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xCA, 0xFE, 0b0011_1100, 77 ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})
	})

	describe('writeCommon', () => {
		it('should handle write', async () => {
			const bus = new MockBus()
			const address = 0xCA_FE
			const buffer = Uint8Array.from([ 0xFF ])
			await Common.writeCommon(bus, address, buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xCA, 0xFE, 0b000_0100, 0xFF ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})
	})

	describe('writeSocket', () => {
		it('should handle write', async () => {
			const bus = new MockBus()
			const socketNumber = 4
			const address = 0xBA_5E
			const buffer = Uint8Array.from([ 42 ])
			await Common.writeSocket(bus, socketNumber, address, buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xBA, 0x5E, 0b1000_1100, 42 ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const buffer = new ArrayBuffer()
			await Assert.rejects(() => Common.writeSocket(bus, socketNumber, address, buffer), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})

	describe('writeSocketTX', () => {
		it('should handle write', async () => {
			const bus = new MockBus()
			const socketNumber = 0
			const address = 0xBE_EF
			const buffer = Uint8Array.from([ 77 ])
			await Common.writeSocketTX(bus, socketNumber, address, buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xBE, 0xEF, 0b0001_0100, 77 ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const buffer = new ArrayBuffer()
			await Assert.rejects(() => Common.writeSocketTX(bus, socketNumber, address, buffer), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})

	describe('writeSocketRX', () => {
		it('should handle write', async () => {
			const bus = new MockBus()
			const socketNumber = 2
			const address = 0xBA_5E
			const buffer = Uint8Array.from([ 42 ])
			await Common.writeSocketRX(bus, socketNumber, address, buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xBA, 0x5E, 0b0101_1100, 42 ]))
			Assert.equal(bus.bytesWritten, SPI_FRAME_HEADER_SIZE + 1)
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const buffer = new ArrayBuffer()
			await Assert.rejects(() => Common.writeSocketRX(bus, socketNumber, address, buffer), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})

	describe('readCommon', () => {
		it('should handle read', async () => {
			const bus = new MockBus()
			const address = 0xF0_0D
			const length = 1
			const buffer = await Common.readCommon(bus, address, length)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xF0, 0x0D, 0b0000_0000 ]))
			Assert.deepEqual(u8, Uint8Array.from([ 0x00 ]))
		})

		it('should handle read invalid buffer length', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xAB ]))
			const address = 0xF0_0D
			const length = 2
			await Assert.rejects(async () => await Common.readCommon(bus, address, length), {
				message: 'invalid read length',
				name: 'RangeError'
			})

		})
	})

	describe('readSocket', () => {
		it('should handle read', async () => {
			const bus = new MockBus()
			const socketNumber = 1
			const address = 0xCA_FE
			const length = 1
			const buffer = await Common.readSocket(bus, socketNumber, address, length)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xCA, 0xFE, 0b0010_1000 ]))
			Assert.deepEqual(u8, Uint8Array.from([ 0x00 ]))
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const length = 1
			await Assert.rejects(() => Common.readSocket(bus, socketNumber, address, length), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})

	describe('readSocketTX', () => {
		it('should handle read', async () => {
			const bus = new MockBus()
			const socketNumber = 7
			const address = 0xDE_AD
			const length = 1
			const buffer = await Common.readSocketTX(bus, socketNumber, address, length)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xDE, 0xAD, 0b1111_0000 ]))
			Assert.deepEqual(u8, Uint8Array.from([ 0x00 ]))
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const length = 1
			await Assert.rejects(() => Common.readSocketTX(bus, socketNumber, address, length), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})

	describe('readSocketRX', () => {
		it('should handle read', async () => {
			const bus = new MockBus(Uint8Array.from([ 0xAB ]))
			const socketNumber = 3
			const address = 0xBE_EF
			const length = 1
			const buffer = await Common.readSocketRX(bus, socketNumber, address, length)
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer)

			Assert.deepEqual(bus.buffer, Uint8Array.from([ 0xBE, 0xEF, 0b0111_1000 ]))
			Assert.deepEqual(u8, Uint8Array.from([ 0xAB ]))
		})

		it('should handle invalid socketNumber', async () => {
			const bus = new MockBus()
			const socketNumber = 42
			const address = 0x00_00
			const length = 1
			await Assert.rejects(() => Common.readSocketRX(bus, socketNumber, address, length), {
				message: 'invalid block',
				name: 'RangeError'
			})
		})
	})
})
