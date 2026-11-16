

/** @import { SPIBus, TransferRequest, TransferResult } from '@johntalton/and-other-delights' */

/** @implements {SPIBus} */
export class MockBus {
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
