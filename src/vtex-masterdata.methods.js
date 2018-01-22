
import CONSTANTS from './vtex-masterdata.constants.js';
import Private from './vtex-masterdata.private.js';

const _private = new Private();

export default {
    /**
     * Set the current Store
     * @param {string} store - The current store
     */
    setStore(store) {
        _private._setStore(store);
        _private._setHelpers(this.globalHelpers, this.vtexHelpers);
    },

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
            isNewsletterOptIn: this.globalHelpers.isUndefined(newsletter) ? true : newsletter,
        };

        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            if ( ! this.globalHelpers.isEmail(email) ) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            _private._getByEmail(email, entity).done((result) => {
                if (_private._resultOk(result)) {
                    return _private._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(_private._parseResult(error));
                    });
                } else {
                    return _private._insert($.extend({
                        email: email,
                    }, data), entity).done((result) => {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
                    }).fail((error) => {
                        def.reject(_private._parseResult(error));
                    });
                }
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

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
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            if ( ! this.globalHelpers.isEmail(email) ) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            _private._getByEmail(email, entity).done((result) => {
                if ( _private._resultOk(result) ) {
                    return _private._get(result[0].id, fields, entity).done((result, textStatus, xhr) => {
                        def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
                    }).fail((error) => {
                        def.reject(_private._parseResult(error));
                    });
                } else {
                    def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_USER));
                }
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Update User by email
     * @param {string} email - The email of the user
     * @param {Object} data - The data that will be updated.
     * @param {string} [entity='CL'] - The Entity
     * @return {promise}
     * @example
     *     vtexMasterData.updateUser('email@email.com', {isNewsletterOptIn: true, firstName: 'New firstname', lastName: 'new lastname'}).done((res) => {
     *         if ( res.isUpdate() ) {
     *             window.console.log(res.result);
     *         }
     *     }).fail((err) => window.console.log(err));
     */
    updateUser(email, data, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            if ( ! this.globalHelpers.isEmail(email) ) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            return _private._getByEmail(email, entity).done((result) => {
                if (_private._resultOk(result) ) {
                    return _private._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(error);
                    });
                } else {
                    def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_USER));
                }
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

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
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            if ( ! this.globalHelpers.isEmail(email) ) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            return _private._getByEmail(email, entity).done((result) => {
                if (_private._resultOk(result)) {
                    return _private._partialUpdate(result[0].id, data, entity).done((result) => {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail((error) => {
                        def.reject(_private._parseError(error));
                    });
                } else {
                    return _private._insert($.extend({
                        email: email,
                    }, data), entity).done((result) => {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
                    }).fail((error) => {
                        def.reject(_private._parseError(error));
                    });
                }
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Insert a document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    insert(data, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._insert(data, entity).done((result) => {
                def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Insert/update a document
     * @param {string} id - The ID of the item that will be inserted/updated
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    insertUpdate(id, data, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._partialUpdate(id, data, entity).done((result) => {
                def.resolve(_private._parseResult(result, (result.dataStatus === 201) ? CONSTANTS.operations.OP_INSERT : CONSTANTS.operations.OP_UPDATE ));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Performs a single search
     * @param {Object} params - The search parameters
     * @param {Array} fields - The Fields that will be retrieved
     * @param {string} [entity='CL'] - The entity where the search will be performed
     * @param {int} [limit=49] - The search limit
     * @param {int} [offset=0] - The search offset
     * @return {promise}
     */
    search(params, fields, entity, limit, offset) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._search(params, fields, entity, limit, offset).done((result, textStatus, xhr) => {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Performs a full search with filters
     * @param {Object} params - The search parameters
     * @param {Array} fields - The Fields that will be retrieved
     * @param {Object} filters - The filters params. Accept: _where, _keyword and _sort
     * @param {string} [entity='CL'] - The entity where the search will be performed
     * @param {int} [limit=49] - The search limit
     * @param {int} [offset=0] - The search offset
     * @return {promise}
     */
    fullSearch(params, fields, filters, entity, limit, offset) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._fullSearch(params, fields, filters, entity, limit, offset).done((result, textStatus, xhr) => {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Get a master data document
     * @param {string} id - The ID of the document to get
     * @param {Array} [fields=["id"]] - A list of fields to retrieve, default values will always be retrieved
     * @param {string} entity - The entity of the document to get
     * @return {promise}
     */
    get(id, fields, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._get(id, fields, entity).done((result, textStatus, xhr) => {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

    /**
     * Check if a master data document exists
     * @param {string} id - The ID of the document to check
     * @param {string} entity - The entity of the document to check
     * @return {promise} A rejected promise if it doesn't exist and a resolved one if it does
     */
    exists(id, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._call('get', id, {
                _fields: 'id',
            }, entity, CONSTANTS.types.DOCUMENTS).done((result, textStatus, xhr) => {
                if ( result !== undefined && result.id !== undefined ) {
                    def.resolve(_private._parseResult(_private._parseResponse(null, {id: result.id, exists: true}, xhr.status), CONSTANTS.operations.OP_GET));
                } else {
                    def.reject(false);
                }
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },

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
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return _private._uploadAttachment(id, entity, field, file).done((result, textStatus, xhr) => {
                def.resolve(_private._parseResult(_private._parseResponse({DocummentId: id, filename: file.name}, result, xhr.status), CONSTANTS.operations.OP_INSERT));
            }).fail((error) => {
                def.reject(_private._parseError(error));
            });
        }).promise();
    },
};
