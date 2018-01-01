
export default {
    /**
     * Return an array with unique values
     * @param {Array} arr - The array
     * @returns {Array}
     */
    arrayUnique(arr) {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    },

    /**
     * Check if a string is a valid mail
     * @param {string} email - The string to check
     * @returns {boolean}
     */
    isEmail(email) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    },

    /**
     * Multiple string replace, PHP str_replace clone
     * @param {string|Array} search - The value being searched for, otherwise known as the needle. An array may be used to designate multiple needles.
     * @param {string|Array} replace - The replacement value that replaces found search values. An array may be used to designate multiple replacements.
     * @param {string} subject - The subject of the replacement
     * @returns {string} The modified string
     * @example strReplace(["olá", "mundo"], ["hello", "world"], "olá mundo"); //Output "hello world"
     *      strReplace(["um", "dois"], "olá", "um dois três"); // Output "olá olá três"
     */
    strReplace(search, replace, subject) {
        let regex;
        if ( search instanceof Array ) {
            for ( let i = 0; i < search.length; i++ ) {
                search[i] = search[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                regex = new RegExp(search[i], 'g');
                subject = subject.replace(regex, (replace instanceof Array ? replace[i] : replace));
            }
        } else {
            search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            regex = new RegExp(search, 'g');
            subject = subject.replace(regex, (replace instanceof Array ? replace[0] : replace));
        }

        return subject;
    },
};
