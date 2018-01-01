// VtexMasterdata.js
// version: 0.1.0
// author: Wellington Barreto
// license: MIT
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Vtex Error
 * @example
 *     vtexMasterdata.getUser('email@email.com', ['isNewsletterOptIn']).done((res) => {
 *         // success
 *     }).fail((err) => {
 *         // error
 *         console.log(err.getResponse());
 *         console.log(err.getMessage());
 *     });
 */
var VtexError = function () {
    function VtexError(error) {
        _classCallCheck(this, VtexError);

        this.name = 'VtexMasterdata Error';
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


    _createClass(VtexError, [{
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

    return VtexError;
}();

exports.default = VtexError;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./../data/constants.js');

var _constants2 = _interopRequireDefault(_constants);

var _helpers = require('./../utils/helpers.js');

var _helpers2 = _interopRequireDefault(_helpers);

var _VtexSuccess = require('./VtexSuccess.js');

var _VtexSuccess2 = _interopRequireDefault(_VtexSuccess);

var _VtexError = require('./VtexError.js');

var _VtexError2 = _interopRequireDefault(_VtexError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VtexMasterdata = function () {
    /**
     * Create a new VtexMasterdata
     */
    function VtexMasterdata() {
        _classCallCheck(this, VtexMasterdata);

        this.storeName = null;
        this._validate();

        this.vtexHelpers = new VtexHelpers();
    }

    _createClass(VtexMasterdata, [{
        key: '_validate',
        value: function _validate() {
            // Validate VtexHelpers
            if (typeof window.VtexHelpers === 'undefined') {
                throw new Error('VtexHelpers is required. Download it from https://www.npmjs.com/package/vtex-helpers');
            }
        }

        //------------------------------------------------------------
        //  PUBLIC METHODS
        //------------------------------------------------------------

        /**
         * Set the current Store
         * @param {string} store - The current store
         */

    }, {
        key: 'setStore',
        value: function setStore(store) {
            if (typeof store !== 'string' || store.length === 0) {
                throw new Error('Store name must be a string and not empty.');
            }

            this.storeName = store;
        }

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

    }, {
        key: 'newsletter',
        value: function newsletter(email, _newsletter, entity) {
            var _this = this;

            var data = {
                isNewsletterOptIn: _newsletter === undefined ? true : _newsletter
            };

            return $.Deferred(function (def) {
                if (!_helpers2.default.isEmail(email)) {
                    return def.reject(_this._parseError(_constants2.default.error.ERR_INVALID_EMAIL));
                }

                _this._getByEmail(email, entity).done(function (result) {
                    if (_this._resultOk(result)) {
                        return _this._partialUpdate(result[0].id, data, entity).done(function (result) {
                            def.resolve(_this._parseResult(result, _constants2.default.operations.OP_UPDATE));
                        }).fail(function (error) {
                            def.reject(_this._parseResult(error));
                        });
                    } else {
                        return _this._insert($.extend({
                            email: email
                        }, data), entity).done(function (result) {
                            def.resolve(_this._parseResult(result, _constants2.default.operations.OP_INSERT));
                        }).fail(function (error) {
                            def.reject(_this._parseResult(error));
                        });
                    }
                }).fail(function (error) {
                    def.reject(_this._parseError(error));
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

    }, {
        key: 'getUser',
        value: function getUser(email, fields, entity) {
            var _this2 = this;

            return $.Deferred(function (def) {
                if (!_helpers2.default.isEmail(email)) {
                    return def.reject(_this2._parseError(_constants2.default.error.ERR_INVALID_EMAIL));
                }

                _this2._getByEmail(email, entity).done(function (result) {
                    if (_this2._resultOk(result)) {
                        return _this2._get(result[0].id, fields, entity).done(function (result, textStatus, xhr) {
                            def.resolve(_this2._parseResult(_this2._parseResponse(null, result, xhr.status), _constants2.default.operations.OP_GET));
                        }).fail(function (error) {
                            def.reject(_this2._parseResult(error));
                        });
                    } else {
                        def.reject(_this2._parseError(_constants2.default.error.ERR_INVALID_USER));
                    }
                }).fail(function (error) {
                    def.reject(_this2._parseError(error));
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

    }, {
        key: 'updateUser',
        value: function updateUser(email, data, entity) {
            var _this3 = this;

            return $.Deferred(function (def) {
                if (!_helpers2.default.isEmail(email)) {
                    return def.reject(_this3._parseError(_constants2.default.error.ERR_INVALID_EMAIL));
                }

                return _this3._getByEmail(email, entity).done(function (result) {
                    if (_this3._resultOk(result)) {
                        return _this3._partialUpdate(result[0].id, data, entity).done(function (result) {
                            def.resolve(_this3._parseResult(result, _constants2.default.operations.OP_UPDATE));
                        }).fail(function (error) {
                            def.reject(error);
                        });
                    } else {
                        def.reject(_this3._parseError(_constants2.default.error.ERR_INVALID_USER));
                    }
                }).fail(function (error) {
                    def.reject(_this3._parseError(error));
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

    }, {
        key: 'insertUpdateUser',
        value: function insertUpdateUser(email, data, entity) {
            var _this4 = this;

            return $.Deferred(function (def) {
                if (!_helpers2.default.isEmail(email)) {
                    return def.reject(_this4._parseError(_constants2.default.error.ERR_INVALID_EMAIL));
                }

                return _this4._getByEmail(email, entity).done(function (result) {
                    if (_this4._resultOk(result)) {
                        return _this4._partialUpdate(result[0].id, data, entity).done(function (result) {
                            def.resolve(_this4._parseResult(result, _constants2.default.operations.OP_UPDATE));
                        }).fail(function (error) {
                            def.reject(_this4._parseError(error));
                        });
                    } else {
                        return _this4._insert($.extend({
                            email: email
                        }, data), entity).done(function (result) {
                            def.resolve(_this4._parseResult(result, _constants2.default.operations.OP_INSERT));
                        }).fail(function (error) {
                            def.reject(_this4._parseError(error));
                        });
                    }
                }).fail(function (error) {
                    def.reject(_this4._parseError(error));
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
        key: 'insert',
        value: function insert(data, entity) {
            var _this5 = this;

            return $.Deferred(function (def) {
                return _this5._insert(data, entity).done(function (result) {
                    def.resolve(_this5._parseResult(result, _constants2.default.operations.OP_INSERT));
                }).fail(function (error) {
                    def.reject(_this5._parseError(error));
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

    }, {
        key: 'insertUpdate',
        value: function insertUpdate(id, data, entity) {
            var _this6 = this;

            return $.Deferred(function (def) {
                return _this6._partialUpdate(id, data, entity).done(function (result) {
                    def.resolve(_this6._parseResult(result, result.statusCode === 201 ? _constants2.default.operations.OP_INSERT : _constants2.default.operations.OP_UPDATE));
                }).fail(function (error) {
                    def.reject(_this6._parseError(error));
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

    }, {
        key: 'search',
        value: function search(params, fields, entity, limit, offset) {
            var _this7 = this;

            return $.Deferred(function (def) {
                return _this7._search(params, fields, entity, limit, offset).done(function (result, textStatus, xhr) {
                    def.resolve(_this7._parseResult(_this7._parseResponse(null, result, xhr.status), _constants2.default.operations.OP_GET));
                }).fail(function (error) {
                    def.reject(_this7._parseError(error));
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

    }, {
        key: 'get',
        value: function get(id, fields, entity) {
            var _this8 = this;

            return $.Deferred(function (def) {
                return _this8._get(id, fields, entity).done(function (result, textStatus, xhr) {
                    def.resolve(_this8._parseResult(_this8._parseResponse(fields, result, xhr.status), _constants2.default.operations.OP_GET));
                }).fail(function (error) {
                    def.reject(_this8._parseError(error));
                });
            }).promise();
        }

        /**
         * Check if a master data document exists
         * @param {string} id - The ID of the document to check
         * @param {string} entity - The entity of the document to check
         * @return {promise} A rejected promise if it doesn't exist and a resolved one if it does
         */

    }, {
        key: 'exists',
        value: function exists(id, entity) {
            var _this9 = this;

            return $.Deferred(function (def) {
                return _this9._call('get', id, {
                    _fields: 'id'
                }, entity, _constants2.default.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    if (result !== undefined && result.id !== undefined) {
                        def.resolve(_this9._parseResult(_this9._parseResponse(null, { id: result.id, exists: true }, xhr.status), _constants2.default.operations.OP_GET));
                        def.resolve(_this9._parseResult(result, _constants2.default.operations.OP_GET));
                    } else def.reject(false);
                }).fail(function (error) {
                    def.reject(_this9._parseError(error));
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

    }, {
        key: 'uploadFile',
        value: function uploadFile(id, entity, field, file) {
            var _this10 = this;

            return $.Deferred(function (def) {
                return _this10._uploadAttachment(id, entity, field, file).done(function (result, textStatus, xhr) {
                    def.resolve(_this10._parseResult(_this10._parseResponse({ DocummentId: id, filename: file.name }, result, xhr.status), _constants2.default.operations.OP_INSERT));
                }).fail(function (error) {
                    def.reject(_this10._parseError(error));
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

    }, {
        key: '_get',
        value: function _get(id, fields, entity) {
            var defaults = ['email', 'id'];
            fields = fields instanceof Array ? _helpers2.default.arrayUnique(fields.concat(['id'])) : defaults;
            var data = {
                '_fields': fields.join(',')
            };

            return this._call('get', id, data, entity, _constants2.default.types.DOCUMENTS);
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
            var _this11 = this;

            return $.Deferred(function (def) {
                return _this11._call('post', null, data, entity, _constants2.default.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this11._parseResponse(data, result, xhr.status));
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
            var _this12 = this;

            return $.Deferred(function (def) {
                return _this12._call('post', null, data, entity, _constants2.default.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this12._parseResponse(null, result, xhr.status));
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
            return this._call('put', id, data, entity, _constants2.default.types.DOCUMENTS);
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
            var _this13 = this;

            return $.Deferred(function (def) {
                return _this13._call('patch', id, data, entity, _constants2.default.types.DOCUMENTS).done(function (result, textStatus, xhr) {
                    def.resolve(_this13._parseResponse(data, result, xhr.status));
                }).fail(function (error) {
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

    }, {
        key: '_search',
        value: function _search(params, fields, entity, limit, offset) {
            limit = limit || 49;
            offset = offset || 0;

            var headers = {
                'REST-Range': 'resources=' + offset + '-' + (limit + offset)
            };

            params._fields = fields.join(',');

            return this._call('get', null, params, entity, _constants2.default.types.SEARCH, headers);
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
            entity = entity !== undefined ? entity : _constants2.default.DEFAULT_ENTITY;

            if (this.storeName === null) {
                throw new Error('Store name is not set, vtexMasterdata.setStore(storeName) must be called.');
            }

            return _helpers2.default.strReplace(['{storeName}', '{entity}', '{type}'], [this.storeName, entity, type], _constants2.default.API_URL) + (id !== undefined && id !== null ? id : '');
        }
    }, {
        key: '_getAttachmentURL',
        value: function _getAttachmentURL(entity, id, field) {
            entity = entity !== undefined ? entity : _constants2.default.DEFAULT_ENTITY;

            if (this.storeName === null) {
                throw new Error('Store name is not set, vtexMasterdata.setStore(storeName) must be called.');
            }

            return _helpers2.default.strReplace(['{storeName}', '{entity}', '{id}', '{field}'], [this.storeName, entity, id !== undefined && id !== null ? id : '', field], _constants2.default.API_ATTACHMENT_URL);
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
                        request.setRequestHeader(header, headers[header]);
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
            return new _VtexSuccess2.default(result, operation);
        }

        /**
         * Parse an error
         * @param {object} error - The error that will be parsed
         * @return {VtexError} VtexError object
         */

    }, {
        key: '_parseError',
        value: function _parseError(error) {
            return new _VtexError2.default(error);
        }
    }]);

    return VtexMasterdata;
}();

exports.default = VtexMasterdata;

},{"./../data/constants.js":4,"./../utils/helpers.js":6,"./VtexError.js":1,"./VtexSuccess.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./../data/constants.js');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Vtex Success
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
var VtexSuccess = function () {
    function VtexSuccess(result, operation) {
        _classCallCheck(this, VtexSuccess);

        this.name = 'VtexMasterdata Success';
        this.result = result;
        this.operation = operation;
    }

    /**
     * To check if the response was successfull or not. Used in "always" callback,
     * @returns {mixed}
     */


    _createClass(VtexSuccess, [{
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
            return this.operation == _constants2.default.operations.OP_INSERT;
        }

        /**
         * Check if the operation was an update
         * @returns {boolean} Whether the operation was an update or not
         */

    }, {
        key: 'isUpdate',
        value: function isUpdate() {
            return this.operation == _constants2.default.operations.OP_UPDATE;
        }

        /**
         * Check if the operation was get
         * @returns {boolean} Whether the operation was an update or not
         */

    }, {
        key: 'isGet',
        value: function isGet() {
            return this.operation == _constants2.default.operations.OP_GET;
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

    return VtexSuccess;
}();

exports.default = VtexSuccess;

},{"./../data/constants.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    API_URL: '\/\/api.vtexcrm.com.br/{storeName}/dataentities/{entity}/{type}/',
    API_ATTACHMENT_URL: '\/\/api.vtexcrm.com.br/{storeName}/dataentities/{entity}/documents/{id}/{field}/attachments',
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
    }
};

},{}],5:[function(require,module,exports){
'use strict';

var _VtexMasterdata = require('./class/VtexMasterdata.js');

var _VtexMasterdata2 = _interopRequireDefault(_VtexMasterdata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window.VtexMasterdata === 'undefined') {
    window.VtexMasterdata = _VtexMasterdata2.default;
}

},{"./class/VtexMasterdata.js":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    /**
     * Return an array with unique values
     * @param {Array} arr - The array
     * @returns {Array}
     */
    arrayUnique: function arrayUnique(arr) {
        return arr.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    },


    /**
     * Check if a string is a valid mail
     * @param {string} email - The string to check
     * @returns {boolean}
     */
    isEmail: function isEmail(email) {
        return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
        );
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
    strReplace: function strReplace(search, replace, subject) {
        var regex = void 0;
        if (search instanceof Array) {
            for (var i = 0; i < search.length; i++) {
                search[i] = search[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                regex = new RegExp(search[i], 'g');
                subject = subject.replace(regex, replace instanceof Array ? replace[i] : replace);
            }
        } else {
            search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            regex = new RegExp(search, 'g');
            subject = subject.replace(regex, replace instanceof Array ? replace[0] : replace);
        }

        return subject;
    }
};

},{}]},{},[5]);
