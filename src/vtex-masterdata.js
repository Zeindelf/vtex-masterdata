
import CONSTANTS from './vtex-masterdata.constants.js';
import Methods from './vtex-masterdata.methods.js';

/**
 * Create a VtexMasterdata class
 * Main class
 */
class VtexMasterdata {
    constructor(vtexUtils) {
        /**
         * Version
         * @type {String}
         */
        this.version = '0.2.2';

        /**
         * Package name
         * @type {String}
         */
        this.name = '@VtexMasterdata';

        // Validate Vtex Utils
        if ( vtexUtils === undefined ) {
            throw new TypeError(CONSTANTS.messages.vtexUtils);
        }

        if ( vtexUtils.name !== '@VtexUtils' ) {
            throw new TypeError(CONSTANTS.messages.vtexUtils);
        }

        if ( vtexUtils.version < CONSTANTS.messages.vtexUtilsVersion ) {
            throw new Error(CONSTANTS.messages.vtexUtilsVersionMessage);
        }

        /**
         * Global Helpers instance
         * @type {GlobalHelpers}
         */
        this.globalHelpers = vtexUtils.globalHelpers;

        /**
         * Vtex Helpers instance
         * @type {VtexHelpers}
         */
        this.vtexHelpers = vtexUtils.vtexHelpers;

        /**
         * Extend public methods
         */
        this.globalHelpers.extend(VtexMasterdata.prototype, Methods);
    }
}

export default VtexMasterdata;
