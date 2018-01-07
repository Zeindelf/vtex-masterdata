
/**
 * CustomError
 * @example
 *     vtexMasterdata.getUser('email@email.com', ['isNewsletterOptIn']).done((res) => {
 *         // success
 *     }).fail((err) => {
 *         // error
 *         console.log(err.getResponse());
 *         console.log(err.getMessage());
 *     });
 */
class CustomError {
    constructor(error) {
        this.type = 'Error';
        this.response = null;
        this.message = null;

        if ( typeof error == 'object' ) {
            for ( let key in error ) {
                if ( error.hasOwnProperty(key) && typeof error[key] !== 'function' ) {
                    if ( key == 'responseText' ) {
                        this.response = $.parseJSON(error[key]);
                    }

                    if ( typeof key == 'string' && key.toLowerCase() == 'message' ) {
                        this.message = error[key];
                    } else {
                        this[key] = error[key];
                    }
                }
            }
        } else if ( typeof error == 'string' ) {
            this.message = error;
        }
    }

    /**
     * To check if the response was successfull or not. Used in "always" callback,
     * @returns {mixed}
     */
    isOk() {
        return false;
    }

    /**
     * Returns the AJAX error response
     * @returns {mixed}
     */
    getResponse() {
        return this.response;
    }

    /**
     * Returns the error message
     * @returns {mixed}
     */
    getMessage() {
        return this.message !== null ? this.message : (this.response !== null && this.response.Message !== undefined ? this.response.Message : null);
    }
}

export default CustomError;
