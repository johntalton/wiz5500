/** biome-ignore-all lint/style/noExcessiveLinesPerFile: main interface */
import { Common } from './common.js'
import { ConverterCommon } from './converter.common.js'
import { ConverterSocket } from './converter.socket.js'
import { ConverterUtil } from './converter.util.js'
import {
	ADDRESS_SIZE,
	COMMON_REGISTERS,
	HARDWARE_ADDRESS_SIZE,
	PORT_SIZE,
	SOCKET_REGISTER
} from './defs.js'

/** @import { SPIBus } from '@johntalton/and-other-delights' */
/** @import {
	Mode,
	Address,
	AddressInput,
	HardwareAddressInput,
	HardwareAddressOutput,
	Interrupt,
	InterruptMask,
	SocketInterrupt,
	SocketInterruptMask,
	PHYConfig,
	PHYConfigWithStatus,
	SocketMode,
	SocketCommand,
	SocketStatus,
	BufferSize,

	SocketSocketInterrupt,
	SocketSocketInterruptMask
} from './types.js' */
/** @import { CommonBufferSource } from './common.js' */

export class Wiz5500 {
	/** @type {SPIBus} */
	#bus

	/** @param {SPIBus} bus  */
	constructor(bus) {
		this.#bus = bus
	}

	/**
	 * @returns {Promise<Mode>}
	 */
	async readMode() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.MODE, 1)
		return ConverterCommon.decodeMode(buffer)
	}

	/**
	 * @param {Mode} mode
	 * @returns {Promise<void>}
	 */
	async writeMode(mode) {
		const buffer = ConverterCommon.encodeMode(mode)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.MODE, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readGatewayAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.GATEWAY_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeGatewayAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.GATEWAY_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readSubnetMaskAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.SUBNET_MASK_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSubnetMaskAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.SUBNET_MASK_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<HardwareAddressOutput>}
	 */
	async readSourceHardwareAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.SOURCE_HARDWARE_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writeSourceHardwareAddress(hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.SOURCE_HARDWARE_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readSourceIPAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.SOURCE_IP_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSourceIPAddress(address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.SOURCE_IP_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async _readInterruptLowLevelTimer() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, 2)
		return ConverterCommon._decodeInterruptLowLevelTimer(buffer)
	}

	/**
	 * @param {number} level
	 * @returns {Promise<void>}
	 */
	async _writeInterruptLowLevelTimer(level) {
		const buffer = ConverterCommon._encodeInterruptLowLevelTimer(level)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, buffer)
	}

	/**
	 * @returns {Promise<Temporal.Duration>}
	 */
	async readInterruptAssertWaitTime() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, 2)
		return ConverterCommon.decodeInterruptAssertWaitTime(buffer)
	}

	/**
	 * @param {Temporal.Duration} duration
	 * @returns {Promise<void>}
	 */
	async writeInterruptAssertWaitTime(duration) {
		const buffer = ConverterCommon.encodeInterruptAssertWaitTime(duration)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_LOW_LEVEL_TIMER, buffer)
	}

	/**
	 * @returns {Promise<Interrupt>}
	 */
	async readInterrupt() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.INTERRUPT, 1)
		return ConverterCommon.decodeInterrupt(buffer)
	}

	/**
	 * @param {Partial<Interrupt>} interrupt
	 * @returns {Promise<void>}
	 */
	async writeInterrupt(interrupt) {
		const buffer = ConverterCommon.encodeInterrupt(interrupt)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.INTERRUPT, buffer)
	}

	/**
	 * @returns {Promise<InterruptMask>}
	 */
	async readInterruptMask() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_MASK, 1)
		return ConverterCommon.decodeInterruptMask(buffer)
	}

	/**
	 * @param {InterruptMask} mask
	 * @returns {Promise<void>}
	 */
	async writeInterruptMask(mask) {
		const buffer = ConverterCommon.encodeInterruptMask(mask)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.INTERRUPT_MASK, buffer)
	}

	/**
	 * @returns {Promise<SocketInterrupt>}
	 */
	async readSocketInterrupt() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.SOCKET_INTERRUPT, 1)
		return ConverterCommon.decodeSocketInterrupt(buffer)
	}

	// /**
	//  * @param {SocketInterrupt} socketInterrupt
	//  * @returns {Promise<void>}
	//  */
	// async writeSocketInterrupt(socketInterrupt) {
	// 	const buffer = ConverterCommon.encodeSocketInterrupt(socketInterrupt)
	// 	return Common.writeCommon(this.#bus, COMMON_REGISTERS.SOCKET_INTERRUPT, buffer)
	// }

	/**
	 * @returns {Promise<SocketInterruptMask>}
	 */
	async readSocketInterruptMask() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.SOCKET_INTERRUPT_MASK, 1)
		return ConverterCommon.decodeSocketInterruptMask(buffer)
	}

	/**
	 * @param {SocketInterruptMask} socketInterruptMask
	 * @returns {Promise<void>}
	 */
	async writeSocketInterruptMask(socketInterruptMask) {
		const buffer = ConverterCommon.encodeSocketInterruptMask(socketInterruptMask)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.SOCKET_INTERRUPT_MASK, buffer)
	}

	/**
	 * @returns {Promise<Temporal.Duration>}
	 */
	async readRetryTime() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.RETRY_TIME, 2)
		return ConverterCommon.decodeRetryTime(buffer)
	}

	/**
	 * @param {Temporal.Duration} retryTime
	 * @returns {Promise<void>}
	 */
	async writeRetryTime(retryTime) {
		const buffer = ConverterCommon.encodeRetryTime(retryTime)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.RETRY_TIME, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readRetryCount() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.RETRY_COUNT, 1)
		return ConverterCommon.decodeRetryCount(buffer)
	}

	/**
	 * @param {number} count
	 * @returns {Promise<void>}
	 */
	async writeRetryCount(count) {
		const buffer = ConverterCommon.encodeRetryCount(count)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.RETRY_COUNT, buffer)
	}

	/**
	 * @returns {Promise<Temporal.Duration>}
	 */
	async readPPPLinkControlProtocolRequestTimer() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PPP_LCP_REQUEST_TIMER, 1)
		return ConverterCommon.decodePPPLinkControlProtocolRequestTimer(buffer)
	}

	/**
	 * @param {Temporal.Duration} duration
	 * @returns {Promise<void>}
	 */
	async writePPPLinkControlProtocolRequestTimer(duration) {
		const buffer = ConverterCommon.encodePPPLinkControlProtocolRequestTimer(duration)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PPP_LCP_REQUEST_TIMER, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPLinkControlProtocolMagicNumber() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PPP_LCP_MAGIC_NUMBER, 1)
		return ConverterCommon.decodePPPLinkControlProtocolMagicNumber(buffer)
	}

	/**
	 * @param {number} magic
	 * @returns {Promise<void>}
	 */
	async writePPPLinkControlProtocolMagicNumber(magic) {
		const buffer = ConverterCommon.encodePPPLinkControlProtocolMagicNumber(magic)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PPP_LCP_MAGIC_NUMBER, buffer)
	}

	/**
	 * @returns {Promise<HardwareAddressOutput>}
	 */
	async readPPPDestinationMACAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PPP_DESTINATION_MAC_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writePPPDestinationMACAddress(hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PPP_DESTINATION_MAC_ADDRESS, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPSessionIdentification() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PPP_SESSION_IDENTIFICATION, 2)
		return ConverterCommon.decodePPPSessionIdentification(buffer)
	}

	/**
	 * @param {number} id
	 * @returns {Promise<void>}
	 */
	async writePPPSessionIdentification(id) {
		const buffer = ConverterCommon.encodePPPSessionIdentification(id)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PPP_SESSION_IDENTIFICATION, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readPPPMaximumSegmentSize() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PPP_MAXIMUM_SEGMENT_SIZE, 2)
		return ConverterCommon.decodePPPMaximumSegmentSize(buffer)
	}

	/**
	 * @param {number} size
	 * @returns {Promise<void>}
	 */
	async writePPPMaximumSegmentSize(size) {
		const buffer = ConverterCommon.encodePPPMaximumSegmentSize(size)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PPP_MAXIMUM_SEGMENT_SIZE, buffer)
	}

	/**
	 * @returns {Promise<Address>}
	 */
	async readUnreachableAddress() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.UNREACHABLE_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readUnreachablePort() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.UNREACHABLE_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @returns {Promise<PHYConfigWithStatus>}
	 */
	async readPHYConfig() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.PHY_CONFIG, 1)
		return ConverterCommon.decodePHYConfig(buffer)
	}

	/**
	 * @param {PHYConfig} config
	 * @returns {Promise<void>}
	 */
	async writePHYConfig(config) {
		const buffer = ConverterCommon.encodePHYConfig(config)
		return Common.writeCommon(this.#bus, COMMON_REGISTERS.PHY_CONFIG, buffer)
	}

	/**
	 * @returns {Promise<number>}
	 */
	async readChipVersion() {
		const buffer = await Common.readCommon(this.#bus, COMMON_REGISTERS.CHIP_VERSION, 1)
		return ConverterCommon.decodeChipVersion(buffer)
	}


	//
	// -----------------------
	//

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketMode>}
	 */
	async readSocketMode(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_MODE, 1)
		return ConverterSocket.decodeMode(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {SocketMode} mode
	 * @returns {Promise<void>}
	 */
	async writeSocketMode(socketNumber, mode) {
		const buffer = ConverterSocket.encodeMode(mode)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_MODE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketCommand>}
	 */
	async readSocketCommand(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_COMMAND, 1)
		return ConverterSocket.decodeCommand(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {SocketCommand} command
	 * @returns {Promise<void>}
	 */
	async writeSocketCommand(socketNumber, command) {
		const buffer = ConverterSocket.encodeCommand(command)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_COMMAND, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketSocketInterrupt>}
	 */
	async readSocketSocketInterrupt(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT, 1)
		return ConverterSocket.decodeSocketInterrupt(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {Partial<SocketSocketInterrupt>} interrupt
	 * @returns {Promise<void>}
	 */
	async writeSocketSocketInterrupt(socketNumber, interrupt) {
		const buffer = ConverterSocket.encodeSocketInterrupt(interrupt)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketStatus>}
	 */
	async readSocketStatus(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_STATUS, 1)
		return ConverterSocket.decodeStatus(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketSourcePort(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_SOURCE_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} port
	 * @returns {Promise<void>}
	 */
	async writeSocketSourcePort(socketNumber, port) {
		const buffer = ConverterUtil.encodePort(port)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_SOURCE_PORT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<HardwareAddressOutput>}
	 */
	async readSocketDestinationHardwareAddress(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_HARDWARE_ADDRESS, HARDWARE_ADDRESS_SIZE)
		return ConverterUtil.decodeHardwareAddress(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {HardwareAddressInput} hardwareAddress
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationHardwareAddress(socketNumber, hardwareAddress) {
		const buffer = ConverterUtil.encodeHardwareAddress(hardwareAddress)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_HARDWARE_ADDRESS, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<Address>}
	 */
	async readSocketDestinationIPAddress(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_IP_ADDRESS, ADDRESS_SIZE)
		return ConverterUtil.decodeAddress(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {AddressInput} address
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationIPAddress(socketNumber, address) {
		const buffer = ConverterUtil.encodeAddress(address)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_IP_ADDRESS, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketDestinationPort(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_PORT, PORT_SIZE)
		return ConverterUtil.decodePort(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} port
	 * @returns {Promise<void>}
	 */
	async writeSocketDestinationPort(socketNumber, port) {
		const buffer = ConverterUtil.encodePort(port)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_DESTINATION_PORT, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketMaximumSegmentSize(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_MAXIMUM_SEGMENT_SIZE, 2)
		return ConverterSocket.decodeMaximumSegmentSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} size
	 * @returns {Promise<void>}
	 */
	async writeSocketMaximumSegmentSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeMaximumSegmentSize(size)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_MAXIMUM_SEGMENT_SIZE, buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketIPTypeOfService(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_IP_TOS, 1)
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
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_IP_TOS, buffer)
	}

	/**
	 * @see {@link https://www.iana.org/assignments/ip-parameters}
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketIPTimeToLive(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_IP_TLL, 1)
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
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_IP_TLL, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<BufferSize>}
	 */
	async readSocketReceiveBufferSize(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RECEIVE_BUFFER_SIZE, 1)
		return ConverterSocket.decodeReceiveBufferSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {BufferSize} size
	 * @returns {Promise<void>}
	 */
	async writeSocketReceiveBufferSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeReceiveBufferSize(size)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RECEIVE_BUFFER_SIZE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<BufferSize>}
	 */
	async readSocketTransmitBufferSize(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TRANSMIT_BUFFER_SIZE, 1)
		return ConverterSocket.decodeTransmitBufferSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {BufferSize} size
	 * @returns {Promise<void>}
	 */
	async writeSocketTransmitBufferSize(socketNumber, size) {
		const buffer = ConverterSocket.encodeTransmitBufferSize(size)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TRANSMIT_BUFFER_SIZE, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXFreeSize(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TX_FREE_SIZE, 2)
		return ConverterSocket.decodeTXFreeSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXReadPointer(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TX_READ_POINTER, 2)
		return ConverterSocket.decodeTXReadPointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketTXWritePointer(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TX_WRITE_POINTER, 2)
		return ConverterSocket.decodeTXWritePointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} pointer
	 * @returns {Promise<void>}
	 */
	async writeSocketTXWritePointer(socketNumber, pointer) {
		const buffer = ConverterSocket.encodeTXWritePointer(pointer)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_TX_WRITE_POINTER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXReceiveSize(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RX_RECEIVED_SIZE, 2)
		return ConverterSocket.decodeRXReceiveSize(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXReadPointer(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RX_READ_POINTER, 2)
		return ConverterSocket.decodeRXReadPointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} pointer
	 * @returns {Promise<void>}
	 */
	async writeSocketRXReadPointer(socketNumber, pointer) {
		const buffer = ConverterSocket.encodeRXReadPointer(pointer)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RX_READ_POINTER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketRXWritePointer(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_RX_WRITE_POINTER, 2)
		return ConverterSocket.decodeRXWritePointer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<SocketSocketInterruptMask>}
	 */
	async readSocketSocketInterruptMask(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT_MASK, 1)
		return ConverterSocket.decodeInterruptMask(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {SocketSocketInterruptMask} mask
	 * @returns {Promise<void>}
	 */
	async writeSocketSocketInterruptMask(socketNumber, mask) {
		const buffer = ConverterSocket.encodeInterruptMask(mask)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_INTERRUPT_MASK, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketFragmentOffsetInIPHeader(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_FRAGMENT_OFFSET_IN_IP_HEADER, 2)
		return ConverterSocket.decodeFragmentOffsetInIPHeader(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} offset
	 * @returns {Promise<void>}
	 */
	async writeSocketFragmentOffsetInIPHeader(socketNumber, offset) {
		const buffer = ConverterSocket.encodeFragmentOffsetInIPHeader(offset)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_FRAGMENT_OFFSET_IN_IP_HEADER, buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @returns {Promise<number>}
	 */
	async readSocketKeepAliveTimer(socketNumber) {
		const buffer = await Common.readSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_KEEP_ALIVE_TIMER, 1)
		return ConverterSocket.decodeKeepAliveTimer(buffer)
	}

	/**
	 * @param {number} socketNumber
	 * @param {number} time
	 * @returns {Promise<void>}
	 */
	async writeSocketKeepAliveTimer(socketNumber, time) {
		const buffer = ConverterSocket.encodeKeepAliveTimer(time)
		return Common.writeSocket(this.#bus, socketNumber, SOCKET_REGISTER.SOCKET_KEEP_ALIVE_TIMER, buffer)
	}

	//
	//
	//

	/**
	 * @param {number} socketNumber
	 * @param {number} address
	 * @param {number} length
	 * @returns {Promise<CommonBufferSource>}
	 */
	async readSocketRX(socketNumber, address, length) {
		return Common.readSocketRX(this.#bus, socketNumber, address, length)
	}
}
