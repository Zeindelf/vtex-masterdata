
import CONSTANTS from './vtex-masterdata.constants.js';

/**
 * CustomSuccess
 * @example
 *     vtexMasterdata.newsletter('email@email.com').done((res) => {
 *         // Get the response results, whatever it might be [array, object, string, integer]
 *         const results = response.getResults();
 *         if ( res.isUpdate() ) {
 *             window.console.log('User updated!');
 *         } else if ( res.isInsert() ) {
 *             window.console.log('New user!');
 *         }
 *     });
 */
class CustomSuccess {
    constructor(result, operation) {
        this.type = 'Success';
        this.result = result;
        this.operation = operation;
    }

    /**
     * To check if the response was successfull or not. Used in "always" callback,
     * @returns {mixed}
     */
    isOk() {
        return true;
    }

    /**
     * Check if the operation was an insert
     * @returns {boolean} Whether the operation was an insert or not
     */
    isInsert() {
        return this.operation == CONSTANTS.operations.OP_INSERT;
    }

    /**
     * Check if the operation was an update
     * @returns {boolean} Whether the operation was an update or not
     */
    isUpdate() {
        return this.operation == CONSTANTS.operations.OP_UPDATE;
    }

    /**
     * Check if the operation was get
     * @returns {boolean} Whether the operation was an update or not
     */
    isGet() {
        return this.operation == CONSTANTS.operations.OP_GET;
    }

    /**
     * Returns the results of the operation
     * @returns {mixed}
     */
    getResults() {
        return this.result;
    }

    /**
     * Returns the request response
     * @returns {mixed}
     */
    getResponse() {
        return this.result.dataResponse;
    }

    /**
     * Returns the status code
     * @returns {mixed}
     */
    getStatus() {
        return this.result.dataStatus;
    }
}

export default CustomSuccess;
