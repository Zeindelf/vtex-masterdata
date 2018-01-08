
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
            throw new Error('VtexUtils.js is required and must be an instance. Download it from https://www.npmjs.com/package/vtex-utils and use "new VtexMasterdata(new VtexUtils())"');
        }

        if ( vtexUtils.name !== '@VtexUtils' ) {
            throw new Error('VtexUtils must be an instance. Use "new VtexMasterdata(new VtexUtils())"');
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
