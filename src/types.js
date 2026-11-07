/** @import { BLOCKS, SOCKET_COMMANDS, SOCKET_STATUS, PHY_OPERATIONAL_MODE } from './defs.js' */

/** @typedef {typeof BLOCKS[keyof typeof BLOCKS]} Block */

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
 * @property {boolean} conflict
 * @property {boolean} unreachable
 * @property {boolean} closedPPPoE
 * @property {boolean} magicWOL
 */

/**
 * @typedef {Object} InterruptMask
 * @property {boolean} enableConflict
 * @property {boolean} enableUnreachable
 * @property {boolean} enableClosedPPPoE
 * @property {boolean} enableMagicWOL
 */

/**
 * @typedef {Array<boolean>} SocketInterrupt
 */

/**
 * @typedef {[ boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean ]} SocketInterruptMask
 */

/** @typedef {typeof PHY_OPERATIONAL_MODE[keyof typeof PHY_OPERATIONAL_MODE]} PHYOperationMode */

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

/** @typedef {AddressParts & AddressDotQuad} Address */

/** @typedef {AddressParts | AddressDotQuad | [ number, number, number, number ] | string} AddressInput */

/**
 * @typedef {Object} HardwareAddress
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 * @property {number} e
 * @property {number} f
*/

/** @typedef {HardwareAddress & { canonical: string }} HardwareAddressOutput */

/** @typedef {HardwareAddress | Array<number> | string} HardwareAddressInput */


//
//
//

/** @typedef {0|1|2|3|4|5|6|7} SocketNumber */

/**
 * @typedef {Object} SocketModeClosed
 * @property {0b0000} protocol
 */

/**
 * @typedef {Object} SocketModeTCP
 * @property {boolean} enableNoDelayedACK
 * @property {0b0001} protocol
 */


/**
 * @typedef {Object} SocketModeUDP
 * @property {boolean} enabledUDPMulticasting
 * @property {boolean} enableBroadcastBlocking
 * @property {boolean} enableIGMPv1
 * @property {boolean} enableUnicastBlocking
 * @property {0b0010} protocol
 */

/**
 * @typedef {Object} SocketModeMACRaw
 * @property {boolean} enableMACFiltering
 * @property {boolean} enableBroadcastBlocking
 * @property {boolean} enableMulticastBlocking
 * @property {boolean} enableIPv6Blocking
 * @property {0b0100} protocol
 */

/** @typedef {SocketModeClosed|SocketModeTCP|SocketModeUDP|SocketModeMACRaw } SocketMode */

/** @typedef {typeof SOCKET_COMMANDS[keyof typeof SOCKET_COMMANDS]} SocketCommand */

/**
 * @typedef {Object} SocketSocketInterrupt
 * @property {boolean} sendOk
 * @property {boolean} timeout
 * @property {boolean} receive
 * @property {boolean} disconnect
 * @property {boolean} connect
 */

/**
 * @typedef {Object} SocketSocketInterruptMask
 * @property {boolean} enableSendOk
 * @property {boolean} enableTimeout
 * @property {boolean} enableReceive
 * @property {boolean} enableDisconnect
 * @property {boolean} enableConnect
 */

/** @typedef {typeof SOCKET_STATUS[keyof typeof SOCKET_STATUS]} SocketStatus */

/** @typedef {0|1|2|4|8|16} BufferSize */

export {}
