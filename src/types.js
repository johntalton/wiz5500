
/**
 * @typedef {Object} Mode
 * @property {boolean} reset
 * @property {boolean} wakeOnLAN
 * @property {boolean} blockPing
 * @property {boolean} enablePPPoE
 * @property {boolean} forceARP
 */

/**
 * @typedef {Object} Interrupt
 */

/**
 * @typedef {Object} InterruptMask
 */

/**
 * @typedef {Object} SocketInterrupt
 */

/**
 * @typedef {Array<boolean>} SocketInterruptMask
 */

/**
 * @typedef {number} PHYOperationMode
 */

/**
 * @typedef {Object} PHYConfig
 * @property {boolean} reset
 * @property {boolean} softwareConfiguredMode
 * @property {PHYOperationMode} mode
 */

/**
 * @typedef {Object} PHYConfigStatus
 * @property {boolean} fullDuplex
 * @property {boolean} highSpeed
 * @property {boolean} up
 */

/** @typedef {PHYConfig & PHYConfigStatus} PHYConfigWithStatus */

/**
 * @typedef {Object} AddressParts
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * @typedef {Object} AddressDotQuad
 * @property {string} dotQuad
 */

/**
 * @typedef {AddressParts & AddressDotQuad} Address
 */

/**
 * @typedef {AddressParts | AddressDotQuad | [ number, number, number, number ] | string} AddressInput
 *
 */

/**
 * @typedef {Object} HardwareAddress
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 * @property {number} e
 * @property {number} f
*/

/** @typedef {HardwareAddress | Array<number> | string} HardwareAddressInput */


//
//
//

/**
 * @typedef {Object} SocketMode
 */

/**
 * @typedef {number} SocketCommand
 */

/**
 * @typedef {number} SocketStatus
 */

/** @typedef {0|1|2|4|8|16} BufferSize */

export {}
