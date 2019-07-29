
/*!!
 * VtexMasterdata.js v0.3.4
 * https://github.com/zeindelf/vtex-masterdata
 *
 * Copyright (c) 2017-2019 Zeindelf
 * Released under the MIT license
 *
 * Date: 2019-07-29T04:10:49.359Z
 */

'use strict';

var vtexUtilsVersion = '0.5.0';

var CONSTANTS = {
    API_URL: '/api/dataentities/{entity}/{type}/',
    API_ATTACHMENT_URL: '/api/dataentities/{entity}/documents/{id}/{field}/attachments',
    DEFAULT_ENTITY: 'CL',
    error: {
        ERR_INVALID_USER: 'User doesn\'t exist',
        ERR_INVALID_PARTNER: 'Partner doesn\'t exist',
        ERR_INVALID_EMAIL: 'Invalid email'
    },
    types: {
        DOCUMENTS: 'documents',
        SEARCH: 'search',
        SCHEMAS: 'schemas',
        FACET: 'search/facet',
        ATTACHMENT: 'documents'
    },
    operations: {
        OP_GET: 'get',
        OP_INSERT: 'insert',
        OP_UPDATE: 'update'
    },
    messages: {
        vtexUtils: 'VtexUtils.js is required and must be an instance. Download it from https://www.npmjs.com/package/vtex-utils and use "new VtexMasterdata(new VtexUtils())"',
        vtexUtilsVersion: vtexUtilsVersion,
        vtexUtilsVersionMessage: 'VtexUtils version must be higher than ' + vtexUtilsVersion + '. Download last version on https://www.npmjs.com/package/vtex-utils',
        storeName: 'Store name must be a string and not empty.'
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var CustomSuccess = function () {
    function CustomSuccess(result, operation) {
        classCallCheck(this, CustomSuccess);

        this.type = 'Success';
        this.result = result;
        this.operation = operation;
    }

    /**
     * To check if the response was successfull or not. Used in "always" callback,
     * @returns {mixed}
     */


    createClass(CustomSuccess, [{
        key: 'isOk',
        value: function isOk() {
            return true;
        }

        /**
         * Check if the operation was an insert
         * @returns {boolean} Whether the operation was an insert or not
         */

    }, {
        key: 'isInsert',
        value: function isInsert() {
            return this.operation == CONSTANTS.operations.OP_INSERT;
        }

        /**
         * Check if the operation was an update
         * @returns {boolean} Whether the operation was an update or not
         */

    }, {
        key: 'isUpdate',
        value: function isUpdate() {
            return this.operation == CONSTANTS.operations.OP_UPDATE;
        }

        /**
         * Check if the operation was get
         * @returns {boolean} Whether the operation was an update or not
         */

    }, {
        key: 'isGet',
        value: function isGet() {
            return this.operation == CONSTANTS.operations.OP_GET;
        }

        /**
         * Returns the results of the operation
         * @returns {mixed}
         */

    }, {
        key: 'getResults',
        value: function getResults() {
            return this.result;
        }

        /**
         * Returns the request response
         * @returns {mixed}
         */

    }, {
        key: 'getResponse',
        value: function getResponse() {
            return this.result.dataResponse;
        }

        /**
         * Returns the status code
         * @returns {mixed}
         */

    }, {
        key: 'getStatus',
        value: function getStatus() {
            return this.result.dataStatus;
        }
    }]);
    return CustomSuccess;
}();

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
var CustomError = function () {
    function CustomError(error) {
        classCallCheck(this, CustomError);

        this.type = 'Error';
        this.response = null;
        this.message = null;

        if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) == 'object') {
            for (var key in error) {
                if (error.hasOwnProperty(key) && typeof error[key] !== 'function') {
                    if (key == 'responseText') {
                        this.response = $.parseJSON(error[key]);
                    }

                    if (typeof key == 'string' && key.toLowerCase() == 'message') {
                        this.message = error[key];
                    } else {
                        this[key] = error[key];
                    }
                }
            }
        } else if (typeof error == 'string') {
            this.message = error;
        }
    }

    /**
     * To check if the response was successfull or not. Used in "always" callback,
     * @returns {mixed}
     */


    createClass(CustomError, [{
        key: 'isOk',
        value: function isOk() {
            return false;
        }

        /**
         * Returns the AJAX error response
         * @returns {mixed}
         */

    }, {
        key: 'getResponse',
        value: function getResponse() {
            return this.response;
        }

        /**
         * Returns the error message
         * @returns {mixed}
         */

    }, {
        key: 'getMessage',
        value: function getMessage() {
            return this.message !== null ? this.message : this.response !== null && this.response.Message !== undefined ? this.response.Message : null;
        }
    }]);
    return CustomError;
}();

var Private = function () {
    function Private() {
        classCallCheck(this, Private);

        this._globalHelpers = null;
        this._vtexHelpers = null;
    }

    createClass(Private, [{
        key: '_getInstance',
        value: function _getInstance(vtexUtils) {
            this._globalHelpers = vtexUtils.globalHelpers;
            this._vtexHelpers = vtexUtils.vtexHelpers;
        }

        /**
         * Get a master data document
         * @param {string} id - The ID of the document to get
         * @param {Array} [fields=['email', 'id']] - A list of fields to retrieve
         * @param {string} entity - The entity of the document to get
         * @return {promise}
         */

    }, {
        key: '_get',
        value: function _get(id, fields, entity) {
            var defaults$$1 = ['id'];
            fields = this._globalHelpers.isArray(fields) ? this._globalHelpers.arrayUnique(fields.concat(['id'])) : defaults$$1;
            var data = {
                '_fields': fields.join(',')
            };

            return this._call('get', id, data, entity, CONSTANTS.types.DOCUMENTS);
        }

        /**
         * Insert a document
         * @param {Object} data - The data that will be inserted
         * @param {string} entity - The entity of the document to insert
         * @return {promise}
         */

    }, {
        key: '_insert',
        value: function _insert(data, entity) {
            var _this = this;

            /* eslint-disable */
            return $.Deferred(function (def) {
                /* eslint-enable */
                return _this._call('post', null, data, entity, CONSTANTS.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this._parseResponse(data, result, xhr.status));
                }).fail(function (error) {
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

    }, {
        key: '_upload',
        value: function _upload(data, entity) {
            var _this2 = this;

            /* eslint-disable */
            return $.Deferred(function (def) {
                /* eslint-enable */
                return _this2._call('post', null, data, entity, CONSTANTS.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this2._parseResponse(null, result, xhr.status));
                }).fail(function (error) {
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

    }, {
        key: '_uploadAttachment',
        value: function _uploadAttachment(id, entity, field, file) {
            var form = new FormData();
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

    }, {
        key: '_fullUpdate',
        value: function _fullUpdate(id, data, entity) {
            return this._call('put', id, data, entity, CONSTANTS.types.DOCUMENTS);
        }
    }, {
        key: '_partialUpdate',


        /**
         * Partial update of a document
         * @param {string} id - The ID of the document to update
         * @param {Object} data - The data that will be updated
         * @param {string} entity - The entity of the document to insert
         * @return {promise}
         */
        value: function _partialUpdate(id, data, entity) {
            var _this3 = this;

            /* eslint-disable */
            return $.Deferred(function (def) {
                /* eslint-enable */
                return _this3._call('patch', id, data, entity, CONSTANTS.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this3._parseResponse(data, result, xhr.status));
                }).fail(function (error) {
                    def.reject(error);
                });
            }).promise();
        }

        /**
         * Performs a single search
         * @param {Object} params - The search parameters
         * @param {Array} fields - The fields that will be retrieved
         * @param {string} entity - The entity where the search will be performed
         * @param {int} [limit=49] - The search limit
         * @param {int} [offset=0] - The search offset
         * @return {promise}
         */

    }, {
        key: '_search',
        value: function _search(params, fields, entity, limit, offset) {
            return this._performSearch(params, fields, entity, limit, offset, null);
        }

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

    }, {
        key: '_fullSearch',
        value: function _fullSearch(params, fields, filters, entity, limit, offset) {
            return this._performSearch(params, fields, entity, limit, offset, filters);
        }

        /**
         * Performs a search by email
         * @param {string} email - The email that will be searched
         * @param {string} entity - The entity where the search will be performed
         * @return {promise}
         */

    }, {
        key: '_getByEmail',
        value: function _getByEmail(email, entity) {
            return this._search({
                email: email
            }, ['email', 'id'], entity, 1, 0);
        }
    }, {
        key: '_getURL',
        value: function _getURL(entity, type, id) {
            entity = !this._globalHelpers.isUndefined(entity) ? entity : CONSTANTS.DEFAULT_ENTITY;

            return this._globalHelpers.strReplace(['{entity}', '{type}'], [entity, type], CONSTANTS.API_URL) + (id !== undefined && id !== null ? id : '');
        }
    }, {
        key: '_getAttachmentURL',
        value: function _getAttachmentURL(entity, id, field) {
            entity = !this._globalHelpers.isUndefined(entity) ? entity : CONSTANTS.DEFAULT_ENTITY;

            return this._globalHelpers.strReplace(['{entity}', '{id}', '{field}'], [entity, id !== undefined && id !== null ? id : '', field], CONSTANTS.API_ATTACHMENT_URL);
        }
    }, {
        key: '_call',
        value: function _call(method, id, data, entity, type, headers) {
            return $.ajax({
                url: this._getURL(entity, type, id),
                type: method,
                accept: 'application/vnd.vtex.ds.v10+json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function beforeSend(request) {
                    for (var header in headers) {
                        if ({}.hasOwnProperty.call(headers, header)) {
                            request.setRequestHeader(header, headers[header]);
                        }
                    }
                },

                crossDomain: true,
                data: method !== 'get' && data !== null ? JSON.stringify(data) : data
            });
        }
    }, {
        key: '_callAttachment',
        value: function _callAttachment(id, data, entity, field) {
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
    }, {
        key: '_performSearch',
        value: function _performSearch(params, fields, entity, limit, offset, filters) {
            limit = limit || 49;
            offset = offset || 0;

            var headers = { 'REST-Range': 'resources=' + offset + '-' + (limit + offset) };
            var defaults$$1 = ['id'];
            fields = this._globalHelpers.isArray(fields) ? this._globalHelpers.arrayUnique(fields.concat(['id'])) : defaults$$1;
            params._fields = fields.join(',');

            if (this._globalHelpers.isObject(filters)) {
                if (filters.hasOwnProperty('_where')) {
                    params._where = filters._where;
                }

                if (filters.hasOwnProperty('_keyword')) {
                    params._keyword = filters._keyword;
                }

                if (filters.hasOwnProperty('_sort')) {
                    params._sort = filters._sort;
                }
            }

            return this._call('get', null, params, entity, CONSTANTS.types.SEARCH, headers);
        }

        // _validateStoreName() {
        //     if ( this._globalHelpers.isUndefined(this._storeName) ) {
        //         throw new Error(CONSTANTS.messages.storeName);
        //     }
        // }

        /**
         * Parse response into object
         * @param  {array} data   Contains element inserted
         * @param  {array|object} result Contains AJAX Response
         * @param  {integer} status Status code response
         * @return {object}        Object with all values
         */

    }, {
        key: '_parseResponse',
        value: function _parseResponse(data, result, status) {
            var obj = {
                dataInsert: data,
                dataResponse: result,
                dataStatus: status
            };

            return obj;
        }

        /**
         * Check if a result is valid
         * @param {object} result - The result that will be parsed
         * @return {boolean}
         */

    }, {
        key: '_resultOk',
        value: function _resultOk(result) {
            return result !== undefined && result.length && result[0].id !== undefined;
        }

        /**
         * Parse a result
         * @param {object} result - The result that will be parsed
         * @return {VtexSuccess} VtexSuccess object
         */

    }, {
        key: '_parseResult',
        value: function _parseResult(result, operation) {
            return new CustomSuccess(result, operation);
        }

        /**
         * Parse an error
         * @param {object} error - The error that will be parsed
         * @return {VtexError} VtexError object
         */

    }, {
        key: '_parseError',
        value: function _parseError(error) {
            return new CustomError(error);
        }
    }]);
    return Private;
}();

var _private = new Private();

var Methods = {
    /**
     * Sets Catalog instance
     * @return {Void}
     */
    _setInstance: function _setInstance(vtexUtils) {
        _private._getInstance(vtexUtils);
    },


    /**
     * Set the current Store
     * @param {string} store - The current store
     */
    setStore: function setStore() {
        console.warn('VtexMasterdata: setStore() is a deprecated method. Please, remove its call');
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
    newsletter: function newsletter(email, _newsletter, entity) {
        var _this = this;

        var data = {
            isNewsletterOptIn: this.globalHelpers.isUndefined(_newsletter) ? true : _newsletter
        };

        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            if (!_this.globalHelpers.isEmail(email)) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            _private._getByEmail(email, entity).done(function (result) {
                if (_private._resultOk(result)) {
                    return _private._partialUpdate(result[0].id, data, entity).done(function (result) {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail(function (error) {
                        def.reject(_private._parseResult(error));
                    });
                } else {
                    return _private._insert($.extend({
                        email: email
                    }, data), entity).done(function (result) {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
                    }).fail(function (error) {
                        def.reject(_private._parseResult(error));
                    });
                }
            }).fail(function (error) {
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
    getUser: function getUser(email, fields, entity) {
        var _this2 = this;

        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            if (!_this2.globalHelpers.isEmail(email)) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            _private._getByEmail(email, entity).done(function (result) {
                if (_private._resultOk(result)) {
                    return _private._get(result[0].id, fields, entity).done(function (result, textStatus, xhr) {
                        def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
                    }).fail(function (error) {
                        def.reject(_private._parseResult(error));
                    });
                } else {
                    def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_USER));
                }
            }).fail(function (error) {
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
    updateUser: function updateUser(email, data, entity) {
        var _this3 = this;

        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            if (!_this3.globalHelpers.isEmail(email)) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            return _private._getByEmail(email, entity).done(function (result) {
                if (_private._resultOk(result)) {
                    return _private._partialUpdate(result[0].id, data, entity).done(function (result) {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail(function (error) {
                        def.reject(error);
                    });
                } else {
                    def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_USER));
                }
            }).fail(function (error) {
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
    insertUpdateUser: function insertUpdateUser(email, data, entity) {
        var _this4 = this;

        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            if (!_this4.globalHelpers.isEmail(email)) {
                return def.reject(_private._parseError(CONSTANTS.error.ERR_INVALID_EMAIL));
            }

            return _private._getByEmail(email, entity).done(function (result) {
                if (_private._resultOk(result)) {
                    return _private._partialUpdate(result[0].id, data, entity).done(function (result) {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_UPDATE));
                    }).fail(function (error) {
                        def.reject(_private._parseError(error));
                    });
                } else {
                    return _private._insert($.extend({
                        email: email
                    }, data), entity).done(function (result) {
                        def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
                    }).fail(function (error) {
                        def.reject(_private._parseError(error));
                    });
                }
            }).fail(function (error) {
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
    insert: function insert(data, entity) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._insert(data, entity).done(function (result) {
                def.resolve(_private._parseResult(result, CONSTANTS.operations.OP_INSERT));
            }).fail(function (error) {
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
    insertUpdate: function insertUpdate(id, data, entity) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._partialUpdate(id, data, entity).done(function (result) {
                def.resolve(_private._parseResult(result, result.dataStatus === 201 ? CONSTANTS.operations.OP_INSERT : CONSTANTS.operations.OP_UPDATE));
            }).fail(function (error) {
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
    search: function search(params, fields, entity, limit, offset) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._search(params, fields, entity, limit, offset).done(function (result, textStatus, xhr) {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail(function (error) {
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
    fullSearch: function fullSearch(params, fields, filters, entity, limit, offset) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._fullSearch(params, fields, filters, entity, limit, offset).done(function (result, textStatus, xhr) {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail(function (error) {
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
    get: function get(id, fields, entity) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._get(id, fields, entity).done(function (result, textStatus, xhr) {
                def.resolve(_private._parseResult(_private._parseResponse(null, result, xhr.status), CONSTANTS.operations.OP_GET));
            }).fail(function (error) {
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
    exists: function exists(id, entity) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._call('get', id, {
                _fields: 'id'
            }, entity, CONSTANTS.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                if (result !== undefined && result.id !== undefined) {
                    def.resolve(_private._parseResult(_private._parseResponse(null, { id: result.id, exists: true }, xhr.status), CONSTANTS.operations.OP_GET));
                } else {
                    def.reject(false);
                }
            }).fail(function (error) {
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
    uploadFile: function uploadFile(id, entity, field, file) {
        /* eslint-disable */
        return $.Deferred(function (def) {
            /* eslint-enable */
            return _private._uploadAttachment(id, entity, field, file).done(function (result, textStatus, xhr) {
                def.resolve(_private._parseResult(_private._parseResponse({ DocummentId: id, filename: file.name }, result, xhr.status), CONSTANTS.operations.OP_INSERT));
            }).fail(function (error) {
                def.reject(_private._parseError(error));
            });
        }).promise();
    }
};

var VtexMasterdata = function VtexMasterdata(vtexUtils) {
  classCallCheck(this, VtexMasterdata);

  /**
   * Version
   * @type {String}
   */
  this.version = '0.3.4';

  /**
   * Package name
   * @type {String}
   */
  this.name = '@VtexMasterdata';

  // Validate Vtex Utils
  if (vtexUtils === undefined) {
    throw new TypeError(CONSTANTS.messages.vtexUtils);
  }

  if (vtexUtils.name !== '@VtexUtils') {
    throw new TypeError(CONSTANTS.messages.vtexUtils);
  }

  if (vtexUtils.version < CONSTANTS.messages.vtexUtilsVersion) {
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

  /**
   * Sets instance for private Methods
   * @type {Method}
   */
  this._setInstance(vtexUtils);
};

module.exports = VtexMasterdata;
