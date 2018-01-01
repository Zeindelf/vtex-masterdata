
import Constants from './../data/constants.js';
import Helpers from './../utils/helpers.js';

import VtexSuccess from './VtexSuccess.js';
import VtexError from './VtexError.js';

class VtexMasterdata {
    /**
     * Create a new VtexMasterdata
     */
    constructor(storeName) {
        this.storeName = storeName;
        this.validate();
        this.init();
    }

    validate() {
        // Validate VtexHelpers
        if ( typeof (window.VtexHelpers) === 'undefined' ) {
            throw new Error('VtexHelpers is required. Download it from https://www.npmjs.com/package/vtex-helpers');
        }

        if ( this.storeName === null ) {
            throw new Error('storeName is not set. Instantiate class with store name');
        }
    }

    init() {
        this.vtexHelpers = new VtexHelpers();
    }

    //------------------------------------------------------------
    //  PUBLIC METHODS
    //------------------------------------------------------------

    /**
     * Newsletter opt-in / opt-out
     * @param {string} email - The email of the user to opt-in/out
     * @param {boolean} [newsletter=true] - Whether to opt-in/out
     * @param {string} [entity='CL'] - The Entity
     * @return {promise}
     * @example
     *     vtexMasterData.newsletter('email@email.com').done((res) => {
     *         if ( res.result.isNewsletterOptIn ) {
     *             window.console.log('Subscribed');
     *         } else {
     *             window.console.log('Not subscribed');
     *         }
     *      }).fail((err) => window.console.log(err));
     */
    newsletter(email, newsletter, entity) {
        const data = {
            isNewsletterOptIn: newsletter === undefined ? true : newsletter
        };

        return $.Deferred((def) => {
            if ( ! Helpers.isEmail(email) ) {
                return def.reject(this._parseError(Constants.error.ERR_INVALID_EMAIL));
            }

            this._getByEmail(email, entity).done((result) => {
                if (this._resultOk(result)) {
                    return this._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(this._parseResult(error));
                    });
                } else {
                    return this._insert($.extend({
                        email: email
                    }, data), entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_INSERT));
                    }).fail((error) => {
                        def.reject(this._parseResult(error));
                    });
                }
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Get User by mail
     * @param {string} email - The email of the user
     * @param {Array} [fields] - A list of fields to retrieve
     * @param {string} [entity='CL'] - The Entity of the user
     * @return {promise}
     * @example
     *     vtexMasterData.getUser('email@email.com', ['email', 'firstName', 'lastName']).done((res) => {
     *         window.console.log(res.result);
     *     }).fail((err) => window.console.log(err));
     */
    getUser(email, fields, entity) {
        return $.Deferred((def) => {
            if ( ! Helpers.isEmail(email) ) {
                return def.this(this._parseError(Constants.error.ERR_INVALID_EMAIL));
            }

            this._getByEmail(email, entity).done((result) => {
                if ( this._resultOk(result) ) {
                    return this._get(result[0].id, fields, entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_GET));
                    }).fail((error) => {
                        def.reject(this._parseResult(error));
                    });
                } else {
                    def.reject(this._parseError(Constants.error.ERR_INVALID_USER));
                }
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Update User by email
     * @param {string} email - The email of the user
     * @param {Object} data - The data that will be updated.
     * @param {string} [entity='CL'] - The Entity
     * @return {promise}
     * @example
     *     vtexMasterData.updateUser('email@email.com', { isNewsletterOptIn: true, firstName: 'New firstname', lastName: 'new lastname'}).done((res) => {
     *         if ( res.isUpdate() ) {
     *             window.console.log(res.result);
     *         }
     *     }).fail((err) => window.console.log(err));
     */
    updateUser(email, data, entity) {
        return $.Deferred((def) => {
            if ( ! Helpers.isEmail(email) ) {
                return def.this(this._parseError(Constants.error.ERR_INVALID_EMAIL));
            }

            return this._getByEmail(email, entity).done((result) => {
                if (this._resultOk(result) ) {
                    return this._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(error);
                    });
                } else {
                    def.reject(this._parseError(Constants.error.ERR_INVALID_USER));
                }
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Update a user if the email exists, or insert a new one if it doesn't
     * @param {string} email - The email of the user
     * @param {Object} data - The data that will be updated.
     * @param {string} [entity='CL'] - The Entity
     * @return {promise}
     * @example
     *     VtexMasterData.insertUpdateUser('email@email.com', { document: 'xxxxxxxxxx', firstName: 'Firstname', lastName: 'Lastname'}).done((res) => {
     *         if ( res.isInsert() ) {
     *             window.console.log('New user!');
     *         } else if ( res.isUpdate() ) {
     *             window.console.log('User updated!');
     *         }
     *     }).fail((err) => window.console.log(err));
     */
    insertUpdateUser(email, data, entity) {
        return $.Deferred((def) => {
            if ( ! Helpers.isEmail(email) ) {
                return def.this(this._parseError(Constants.error.ERR_INVALID_EMAIL));
            }

            return this._getByEmail(email, entity).done((result) => {
                if (this._resultOk(result)) {
                    return this._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(this._parseError(error));
                    });
                } else {
                    return this._insert($.extend({
                        email: email
                    }, data), entity).done((result) => {
                        def.resolve(this._parseResult(result, Constants.operations.OP_INSERT));
                    }).fail((error) => {
                        def.reject(this._parseError(error));
                    });
                }
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Insert a document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    insert(data, entity) {
        return $.Deferred((def) => {
            return this._insert(data, entity).done((result) => {
                def.resolve(this._parseResult(result, Constants.operations.OP_INSERT));
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Insert/update a document
     * @param {string} id - The ID of the item that will be inserted/updated
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    insertUpdate(id, data, entity) {
        return $.Deferred((def) => {
            return this._partialUpdate(id, data, entity).done((result) => {
                def.resolve(this._parseResult(result));
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Performs a search
     * @param {Object} params - The search parameters
     * @param {Array} fields - The Fields that will be retrieved
     * @param {string} entity - The entity where the search will be performed
     * @param {int} [limit=49] - The search limit
     * @param {int} [offset=0] - The search offset
     * @return {promise}
     */
    search(params, fields, entity, limit, offset) {
        return $.Deferred((def) => {
            return this._search(params, fields, entity, limit, offset).done((result) => {
                def.resolve(this._parseResult(result, Constants.operations.OP_GET));
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Get a master data document
     * @param {string} id - The ID of the document to get
     * @param {Array} [fields=["id"]] - A list of fields to retrieve, default values will always be retrieved
     * @param {string} entity - The entity of the document to get
     * @return {promise}
     */
    get(id, fields, entity) {
        return $.Deferred((def) => {
            return this._get(id, fields, entity).done((result) => {
                def.resolve(this._parseResult(result, Constants.operations.OP_GET));
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Check if a master data document exists
     * @param {string} id - The ID of the document to check
     * @param {string} entity - The entity of the document to check
     * @return {promise} A rejected promise if it doesn't exist and a resolved one if it does
     */
    exists(id, entity) {
        return $.Deferred((def) => {
            return this._call('get', id, {
                _fields: 'id'
            }, entity, Constants.types.DOCUMENTS).done((result) => {
                if ( result !== undefined && result.id !== undefined ) {
                    def.resolve(this._parseResult(result, Constants.operations.OP_GET));
                } else def.reject(false);
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    /**
     * Insert file to a document
     * @param {string} id - The ID of the document to onsert
     * @param {string} entity - The entity of the document to insert
     * @param {string} field - Document file field
     * @param {object} file - Parsed file
     * @return {promise}
     * @example
     *     const file = $('#contactFile')[0].files[0];
     *     vtexMasterData.uploadFile('2ce16c13-dfb4-11e7-9560-0a306de80c9c', 'CL', 'file_field', file).done((res) => {
     *         if ( res.isUpdate() ) {
     *             window.console.log(res.result);
     *         }
     *     }).fail((err) => window.console.log(err));
     */
    uploadFile(id, entity, field, file) {
        return $.Deferred((def) => {
            return this._uploadAttachment(id, entity, field, file).done((result) => {
                def.resolve(this._parseResult(result, Constants.operations.OP_INSERT));
            }).fail((error) => {
                def.reject(this._parseError(error));
            });
        }).promise();
    }

    //------------------------------------------------------------
    //  PRIVATE METHODS
    //------------------------------------------------------------

    /**
     * Get a master data document
     * @param {string} id - The ID of the document to get
     * @param {Array} [fields=['email', 'id']] - A list of fields to retrieve
     * @param {string} entity - The entity of the document to get
     * @return {promise}
     */
    _get(id, fields, entity) {
        const defaults = ['email', 'id'];
        fields = fields instanceof Array ? Helpers.arrayUnique(fields.concat(['id'])) : defaults;
        const data = {
            '_fields': fields.join(',')
        };

        return this._call('get', id, data, entity, Constants.types.DOCUMENTS);
    }

    /**
     * Insert a document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _insert(data, entity) {
        return $.Deferred((def) => {
            return this._call('post', null, data, entity, Constants.types.DOCUMENTS).done((result) => {
                def.resolve($.extend(data, result));
            }).fail((error) => {
                def.reject(error);
            });
        }).promise();
    }

    /**
     * Insert a document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _upload(data, entity) {
        return $.Deferred((def) => {
            return this._call('post', null, data, entity, Constants.types.DOCUMENTS).done((result) => {
                def.resolve($.extend(data, result));
            }).fail((error) => {
                def.reject(error);
            });
        }).promise();
    }

    /**
     * Insert a file into document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @param {string} field - Document file field
     * @param {object} file - File to insert
     * @return {promise}
     */
    _uploadAttachment(id, entity, field, file) {
        const form = new FormData();
        form.append('Filename', file.name);
        form.append('Filedata', file);

        return this._callAttachment(id, form, entity, field);
    }

    /**
     * Full update of a document, all fields must be specified in the request
     * @param {string} id - The ID of the document to get
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _fullUpdate(id, data, entity) {
        return this._call('put', id, data, entity, Constants.types.DOCUMENTS);
    };

    /**
     * Partial update of a document
     * @param {string} id - The ID of the document to update
     * @param {Object} data - The data that will be updated
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _partialUpdate(id, data, entity) {
        return $.Deferred((def) => {
            return this._call('patch', id, data, entity, Constants.types.DOCUMENTS).done((result) => {
                def.resolve(data);
            }).fail((error) => {
                def.reject(error);
            });
        }).promise();
    }

    /**
     * Performs a search
     * @param {Object} params - The search parameters
     * @param {Array} fields - The fields that will be retrieved
     * @param {string} entity - The entity where the search will be performed
     * @param {int} [limit=49] - The search limit
     * @param {int} [offset=0] - The search offset
     * @return {promise}
     */
    _search(params, fields, entity, limit, offset) {
        limit = limit || 49;
        offset = offset || 0;

        var headers = {
            'REST-Range': 'resources=' + offset + '-' + (limit + offset)
        };

        params._fields = fields.join(',');

        return this._call('get', null, params, entity, Constants.types.SEARCH, headers);
    }

    /**
     * Performs a search by email
     * @param {string} email - The email that will be searched
     * @param {string} entity - The entity where the search will be performed
     * @return {promise}
     */
    _getByEmail(email, entity) {
        return this._search({
            email: email
        }, ['email', 'id'], entity, 1, 0);
    }

    _getURL(entity, type, id) {
        entity = entity !== undefined ? entity : Constants.DEFAULT_ENTITY;

        return Helpers.strReplace(['{storeName}', '{entity}', '{type}'], [this.storeName, entity, type], Constants.API_URL) + (id !== undefined && id !== null ? id : '');
    }

    _getAttachmentURL(entity, id, field) {
        entity = entity !== undefined ? entity : Constants.DEFAULT_ENTITY;

        return Helpers.strReplace(['{storeName}', '{entity}', '{field}'], [this.storeName, entity, field], Constants.API_ATTACHMENT_URL) + (id !== undefined && id !== null ? id : '');
    }

    _call(method, id, data, entity, type, headers) {
        return $.ajax({
            url: this._getURL(entity, type, id),
            type: method,
            accept: 'application/vnd.vtex.ds.v10+json',
            contentType: 'application/json; charset=utf-8',
            beforeSend(request) {
                for (let header in headers) {
                    request.setRequestHeader(header, headers[header]);
                }
            },
            crossDomain: true,
            data: method !== 'get' && data !== null ? JSON.stringify(data) : data
        });
    }

    _callAttachment(id, data, entity, field) {
        return $.ajax({
            url: this._getAttachmentURL(entity, id, field),
            type: 'post',
            data: data,
            processData: false,
            contentType: false,
            crossDomain: true,
            accept: 'application/vnd.vtex.ds.v10+json',
            mimeType: 'multipart/form-data'
        });
    }

    /**
     * Check if a result is valid
     * @param {object} result - The result that will be parsed
     * @return {boolean}
     */
    _resultOk(result) {
        return result !== undefined && result.length && result[0].id !== undefined;
    }

    /**
     * Parse a result
     * @param {object} result - The result that will be parsed
     * @return {VtexSuccess} VtexSuccess object
     */
    _parseResult(result, operation) {
        return new VtexSuccess(result, operation);
    }

    /**
     * Parse an error
     * @param {object} error - The error that will be parsed
     * @return {VtexError} VtexError object
     */
    _parseError(error) {
        return new VtexError(error);
    }
}

export default VtexMasterdata;
