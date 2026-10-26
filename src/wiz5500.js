/** biome-ignore-all lint/style/noExcessiveLinesPerFile: <explanation> */
import { Converter } from './converter.common.js'
import { ConverterSocket } from './converter.socket.js'
import { ConverterUtil } from './converter.util.js'
import {
	ADDRESS_SIZE,
	BLOCKS,
	COMMON_REGISTERS,
	HARDWARE_ADDRESS_SIZE,
	PORT_SIZE,
	SOCKET_BLOCK_SIZE,
	SOCKET_REGISTER
} from './defs.js'

/** @import { SPIBus, SPIBufferSource } from './spi.js' */
/** @import {
	Mode,
	Address,
	AddressInput,
	HardwareAddress,
	HardwareAddressInput,
	Interrupt,
	InterruptMask,
	SocketInterrupt,
	SocketInterruptMask,
	PHYConfig,
	PHYConfigWithStatus,
	SocketMode,
	SocketCommand,
	SocketStatus,
	BufferSize
} from './types.js' */

export class Wiz5500 {
	/** @type {SPIBus} */
	#bus

	/** @param {SPIBus} bus  */
	constructor(bus) {
		this.#bus = bus
	}

	/**
	 * @param {number} block
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	async #writeRegister(block, address, buffer) {



		return this.#bus.transaction()
	}

	/**
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	async #writeCommon(address, buffer) {
		return this.#writeRegister(BLOCKS.COMMON, address, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	async #writeSocket(socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0 + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#writeRegister(block, address, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	async #writeSocketTX(socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0_TX + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#writeRegister(block, address, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {SPIBufferSource} buffer
	 * @returns {Promise<void>}
	 */
	async #writeSocketRX(socketNumber, address, buffer) {
		const block = BLOCKS.SOCKET_0_RX + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#writeRegister(block, address, buffer)
	}

	/**
	 * @param {number} block
	 * @param {number} address
	 * @param {number} length
	 */
	async #readRegister(block, address, length) {

		const receiveBuffer = new Uint8Array(length)
		await this.#bus.transaction()

		return receiveBuffer
	}

	/**
	 * @param {number} address
	 * @param {number} length
	 */
	async #readCommon(address, length) {
		return this.#readRegister(BLOCKS.COMMON, address, length)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {number} length
	 */
	async #readSocket(socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0 + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#readRegister(block, address, length)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {number} length
	 */
	async #readSocketTX(socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0_TX + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#readRegister(block, address, length)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {number} length
	 */
	async #readSocketRX(socketNumber, address, length) {
		const block = BLOCKS.SOCKET_0_RX + (socketNumber * SOCKET_BLOCK_SIZE)
		return this.#readRegister(block, address, length)
	}

	/**
	 * @returns {Promise<Mode>}
	 */
	async readMode() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.MODE, 1)
		return Converter.decodeMode(buffer)
	}

	/**
	 * @param {Mode} mode
	 * @returns {Promise<void>}
	 */
	async writeMode(mode) {
		const buffer = Converter.encodeMode(mode)
		return this.#writeCommon(COMMON_REGISTERS.MODE, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readGatewayAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.GATEWAY_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeGatewayAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return this.#writeCommon(COMMON_REGISTERS.GATEWAY_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readSubnetMaskAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.SUBNET_MASK_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSubnetMaskAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return this.#writeCommon(COMMON_REGISTERS.SUBNET_MASK_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<HardwareAddress>}
	 */
	async readSourceHardwareAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.SOURCE_HARDWARE_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writeSourceHardwareAddress(hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return this.#writeCommon(COMMON_REGISTERS.SOURCE_HARDWARE_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readSourceIPAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.SOURCE_IP_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSourceIPAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return this.#writeCommon(COMMON_REGISTERS.SOURCE_IP_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readInterruptLowLevelTimer() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, 2)
		return Converter.decodeInterruptLowLevelTimer(buffer)
	}

	/**
	 * @param {number} level
	 * @returns {Promise<void>}
	 */
	async writeInterruptLowLevelTimer(level) {
		const buffer = Converter.encodeInterruptLowLevelTimer(level)
		return this.#writeCommon(COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, buffer)
	}

	/**
	 * @returns {Promise<Interrupt>}
	 */
	async readInterrupt() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.INTERRUPT, 1)
		return Converter.decodeInterrupt(buffer)
	}

	/**
	 * @param {Interrupt} interrupt
	 * @returns {Promise<void>}
	 */
	async writeInterrupt(interrupt) {
		const buffer = Converter.encodeInterrupt(interrupt)
		return this.#writeCommon(COMMON_REGISTERS.INTERRUPT, buffer)
	}

	/**
	 * @returns {Promise<InterruptMask>}
	 */
	async readInterruptMask() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.INTERRUPT_MASK, 1)
		return Converter.decodeInterruptMask(buffer)
	}

	/**
	 * @param {Mode} mode
	 * @returns {Promise<void>}
	 */
	async writeInterruptMask(mode) {
		const buffer = Converter.encodeInterruptMask(mode)
		return this.#writeCommon(COMMON_REGISTERS.INTERRUPT_MASK, buffer)
	}

	/**
	 * @returns {Promise<SocketInterrupt>}
	 */
	async readSocketInterrupt() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.SOCKET_INTERRUPT, 1)
		return Converter.decodeSocketInterrupt(buffer)
	}

	/**
	 * @param {SocketInterrupt} socketInterrupt
	 * @returns {Promise<void>}
	 */
	async writeSocketInterrupt(socketInterrupt) {
		const buffer = Converter.encodeSocketInterrupt(socketInterrupt)
		return this.#writeCommon(COMMON_REGISTERS.SOCKET_INTERRUPT, buffer)
	}

	/**
	 * @returns {Promise<SocketInterruptMask>}
	 */
	async readSocketInterruptMask() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.SOCKET_INTERRUPT_MASK, 1)
		return Converter.decodeSocketInterruptMask(buffer)
	}

	/**
	 * @param {SocketInterruptMask} socketInterruptMask
	 * @returns {Promise<void>}
	 */
	async writeSocketInterruptMask(socketInterruptMask) {
		const buffer = Converter.encodeSocketInterruptMask(socketInterruptMask)
		return this.#writeCommon(COMMON_REGISTERS.SOCKET_INTERRUPT_MASK, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readRetryTime() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.RETRY_TIME, 2)
		return Converter.decodeRetryTime(buffer)
	}

	/**
	 * @param {number} retryTime
	 * @returns {Promise<void>}
	 */
	async writeRetryTime(retryTime) {
		const buffer = Converter.encodeRetryTime(retryTime)
		return this.#writeCommon(COMMON_REGISTERS.RETRY_TIME, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readRetryCount() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.RETRY_COUNT, 1)
		return Converter.decodeRetryCount(buffer)
	}

	/**
	 * @param {number} count
	 * @returns {Promise<void>}
	 */
	async writeRetryCount(count) {
		const buffer = Converter.encodeRetryCount(count)
		return this.#writeCommon(COMMON_REGISTERS.RETRY_COUNT, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPLCPRequestTimer() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PPP_LCP_REQUEST_TIMER, 1)
		return Converter.decodePPPLCPRequestTimer(buffer)
	}

	/**
	 * @param {number} time
	 * @returns {Promise<void>}
	 */
	async writePPPLCPRequestTimer(time) {
		const buffer = Converter.encodePPPLCPRequestTimer(time)
		return this.#writeCommon(COMMON_REGISTERS.PPP_LCP_REQUEST_TIMER, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPLCPMagicNumber() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PPP_LCP_MAGIC_NUMBER, 1)
		return Converter.decodePPPLCPMagicNumber(buffer)
	}

	/**
	 * @param {number} magic
	 * @returns {Promise<void>}
	 */
	async writePPPLCPMagicNumber(magic) {
		const buffer = Converter.encodePPPLCPMagicNumber(magic)
		return this.#writeCommon(COMMON_REGISTERS.PPP_LCP_MAGIC_NUMBER, buffer)
	}

	/**
	 * @returns {Promise<HardwareAddress>}
	 */
	async readPPPDestinationMACAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PPP_DESTINATION_MAC_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writePPPDestinationMACAddress(hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return this.#writeCommon(COMMON_REGISTERS.PPP_DESTINATION_MAC_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPSessionIdentification() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PPP_SESSION_IDENTIFICATION, 2)
		return Converter.decodePPPSessionIdentification(buffer)
	}

	/**
	 * @param {number} id
	 * @returns {Promise<void>}
	 */
	async writePPPSessionIdentification(id) {
		const buffer = Converter.encodePPPSessionIdentification(id)
		return this.#writeCommon(COMMON_REGISTERS.PPP_SESSION_IDENTIFICATION, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPMaximumSegmentSize() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PPP_MAXIMUM_SEGMENT_SIZE, 2)
		return Converter.decodePPPMaximumSegmentSize(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {Promise<void>}
	 */
	async writePPPMaximumSegmentSize(size) {
		const buffer = Converter.encodePPPMaximumSegmentSize(size)
		return this.#writeCommon(COMMON_REGISTERS.PPP_MAXIMUM_SEGMENT_SIZE, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readUnreachableAddress() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.UNREACHABLE_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readUnreachablePort() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.UNREACHABLE_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @returns {Promise<PHYConfigWithStatus>}
	 */
	async readPHYConfig() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.PHY_CONFIG, 1)
		return Converter.decodePHYConfig(buffer)
	}

	/**
	 * @param {PHYConfig} config
	 * @returns {Promise<void>}
	 */
	async writePHYConfig(config) {
		const buffer = Converter.encodePHYConfig(config)
		return this.#writeCommon(COMMON_REGISTERS.PHY_CONFIG, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readChipVersion() {
		const buffer = await this.#readCommon(COMMON_REGISTERS.CHIP_VERSION, 1)
		return Converter.decodeChipVersion(buffer)
	}


	//
	// -----------------------
	//

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketMode>}
	 */
	async readSocketMode(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_MODE, 1)
		return ConverterSocket.decodeMode(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {SocketMode} mode
	 * @returns {Promise<void>}
	 */
	async writeSocketMode(socketNumber, mode) {
		const buffer = ConverterSocket.encodeMode(mode)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_MODE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketCommand>}
	 */
	async readSocketCommand(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_COMMAND, 1)
		return ConverterSocket.decodeCommand(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {SocketCommand} command
	 * @returns {Promise<void>}
	 */
	async writeSocketCommand(socketNumber, command) {
		const buffer = ConverterSocket.encodeCommand(command)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_COMMAND, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<>}
	 */
	async readSocketSocketInterrupt(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT, 1)
		return ConverterSocket.decodeSocketInterrupt(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {} interrupt
	 * @returns {Promise<void>}
	 */
	async writeSocketSocketInterrupt(socketNumber, interrupt) {
		const buffer = ConverterSocket.encodeSocketInterrupt(interrupt)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketStatus>}
	 */
	async readSocketStatus(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_STATUS, 1)
		return ConverterSocket.decodeStatus(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketSourcePort(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_SOURCE_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} port
	 * @returns {Promise<void>}
	 */
	async writeSocketSourcePort(socketNumber, port) {
		const buffer = ConverterUtil.encodePort(port)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_SOURCE_PORT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<HardwareAddress>}
	 */
	async readSocketDestinationHardwareAddress(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_HARDWARE_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationHardwareAddress(socketNumber, hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_HARDWARE_ADDRESS, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<Address>}
	 */
	async readSocketDestinationIPAddress(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_IP_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationIPAddress(socketNumber, address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_IP_ADDRESS, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketDestinationPort(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} port
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationPort(socketNumber, port) {
		const buffer = ConverterUtil.encodePort(port)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_PORT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketMaximumSegmentSize(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_MAXIMUM_SEGMENT_SIZE, 2)
		return ConverterSocket.decodeMaximumSegmentSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} size
	 * @returns {Promise<void>}
	 */
	async writeSocketMaximumSegmentSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeMaximumSegmentSize(size)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_MAXIMUM_SEGMENT_SIZE, buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketIPTypeOfService(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_IP_TOS, 1)
		return ConverterSocket.decodeIPTypeOfService(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @param {number} typeOfService
	 * @returns {Promise<void>}
	 */
	async writeSocketIPTypeOfService(socketNumber, typeOfService) {
		const buffer = ConverterSocket.encodeIPTypeOfService(typeOfService)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_IP_TOS, buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketIPTimeToLive(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_IP_TLL, 1)
		return ConverterSocket.decodeIPTimeToLive(buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @param {number} timeToLive
	 * @returns {Promise<void>}
	 */
	async writeSocketIPTimeToLive(socketNumber, timeToLive) {
		const buffer = ConverterSocket.encodeIPTimeToLive(timeToLive)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_IP_TLL, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<BufferSize>}
	 */
	async readSocketReceiveBufferSize(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_RECEIVE_BUFFER_SIZE, 1)
		return ConverterSocket.decodeReceiveBufferSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {BufferSize} size
	 * @returns {Promise<void>}
	 */
	async writeSocketReceiveBufferSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeReceiveBufferSize(size)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_RECEIVE_BUFFER_SIZE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<BufferSize>}
	 */
	async readSocketTransmitBufferSize(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_TRANSMIT_BUFFER_SIZE, 1)
		return ConverterSocket.decodeTransmitBufferSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {BufferSize} size
	 * @returns {Promise<void>}
	 */
	async writeSocketTransmitBufferSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeTransmitBufferSize(size)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_TRANSMIT_BUFFER_SIZE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXFreeSize(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_TX_FREE_SIZE, 2)
		return ConverterSocket.decodeTXFreeSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXReadPointer(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_TX_READ_POINTER, 2)
		return ConverterSocket.decodeTXReadPointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXWritePointer(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_TX_WRITE_POINTER, 2)
		return ConverterSocket.decodeTXWritePointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} pointer
	 * @returns {Promise<void>}
	 */
	async writeSocketTXWritePointer(socketNumber, pointer) {
		const buffer = ConverterSocket.encodeTXWritePointer(pointer)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_TX_WRITE_POINTER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXReceiveSize(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_RX_RECEIVED_SIZE, 2)
		return ConverterSocket.decodeRXReceiveSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXReadPointer(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_RX_READ_POINTER, 2)
		return ConverterSocket.decodeRXReadPointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} pointer
	 * @returns {Promise<void>}
	 */
	async writeSocketRXReadPointer(socketNumber, pointer) {
		const buffer = ConverterSocket.encodeRXReadPointer(pointer)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_RX_READ_POINTER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXWritePointer(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_RX_WRITE_POINTER, 2)
		return ConverterSocket.decodeRXWritePointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<>}
	 */
	async readSocketSocketInterruptMask(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT_MASK, 1)
		return ConverterSocket.decodeInterruptMask(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {} value
	 * @returns {Promise<void>}
	 */
	async writeSocketSocketInterruptMask(socketNumber, value) {
		const buffer = ConverterSocket.encodeInterruptMask(value)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT_MASK, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketFragmentOffsetInIPHeader(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_FRAGMENT_OFFSET_IN_IP_HEADER, 2)
		return ConverterSocket.decodeFragmentOffsetInIPHeader(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} offset
	 * @returns {Promise<void>}
	 */
	async writeSocketFragmentOffsetInIPHeader(socketNumber, offset) {
		const buffer = ConverterSocket.encodeFragmentOffsetInIPHeader(offset)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_FRAGMENT_OFFSET_IN_IP_HEADER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketKeepAliveTimer(socketNumber) {
		const buffer = await this.#readSocket(socketNumber, SOCKET_REGISTER.SOCKET_KEEP_ALIVE_TIMER, 1)
		return ConverterSocket.decodeKeepAliveTimer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} time
	 * @returns {Promise<void>}
	 */
	async writeSocketKeepAliveTimer(socketNumber, time) {
		const buffer = ConverterSocket.encodeKeepAliveTimer(time)
		return this.#writeSocket(socketNumber, SOCKET_REGISTER.SOCKET_KEEP_ALIVE_TIMER, buffer)
	}

}
