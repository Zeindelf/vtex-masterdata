
import CONSTANTS from './vtex-masterdata.constants.js';
import CustomSuccess from './vtex-masterdata.success.js';
import CustomError from './vtex-masterdata.error.js';

class Private {
    constructor() {
        this._globalHelpers = null;
        this._vtexHelpers = null;
        this._storeName = null;
    }

    _setStore(store) {
        this._storeName = store;
    }

    _setHelpers(globalHelpers, vtexHelpers) {
        this._globalHelpers = globalHelpers;
        this._vtexHelpers = vtexHelpers;
        this._storeName = this._vtexHelpers.getStoreName;
    }

    /**
     * Get a master data document
     * @param {string} id - The ID of the document to get
     * @param {Array} [fields=['email', 'id']] - A list of fields to retrieve
     * @param {string} entity - The entity of the document to get
     * @return {promise}
     */
    _get(id, fields, entity) {
        this._validateStoreName();

        const defaults = ['id'];
        fields = ( this._globalHelpers.isArray(fields) ) ? this._globalHelpers.arrayUnique(fields.concat(['id'])) : defaults;
        const data = {
            '_fields': fields.join(','),
        };

        return this._call('get', id, data, entity, CONSTANTS.types.DOCUMENTS);
    }

    /**
     * Insert a document
     * @param {Object} data - The data that will be inserted
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _insert(data, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return this._call('post', null, data, entity, CONSTANTS.types.DOCUMENTS).done((result, textStatus, xhr) => {
                def.resolve(this._parseResponse(data, result, xhr.status));
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
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return this._call('post', null, data, entity, CONSTANTS.types.DOCUMENTS).done((result, textStatus, xhr) => {
                def.resolve(this._parseResponse(null, result, xhr.status));
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
        return this._call('put', id, data, entity, CONSTANTS.types.DOCUMENTS);
    };

    /**
     * Partial update of a document
     * @param {string} id - The ID of the document to update
     * @param {Object} data - The data that will be updated
     * @param {string} entity - The entity of the document to insert
     * @return {promise}
     */
    _partialUpdate(id, data, entity) {
        /* eslint-disable */
        return $.Deferred((def) => {
            /* eslint-enable */
            return this._call('patch', id, data, entity, CONSTANTS.types.DOCUMENTS).done((result, textStatus, xhr) => {
                def.resolve(this._parseResponse(data, result, xhr.status));
            }).fail((error) => {
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
    _search(params, fields, entity, limit, offset) {
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
    _fullSearch(params, fields, filters, entity, limit, offset) {
        return this._performSearch(params, fields, entity, limit, offset, filters);
    }

    /**
     * Performs a search by email
     * @param {string} email - The email that will be searched
     * @param {string} entity - The entity where the search will be performed
     * @return {promise}
     */
    _getByEmail(email, entity) {
        return this._search({
            email: email,
        }, ['email', 'id'], entity, 1, 0);
    }

    _getURL(entity, type, id) {
        this._validateStoreName();

        entity = ( ! this._globalHelpers.isUndefined(entity) ) ? entity : CONSTANTS.DEFAULT_ENTITY;

        return this._globalHelpers.strReplace(['{storeName}', '{entity}', '{type}'], [this._storeName, entity, type], CONSTANTS.API_URL) + (id !== undefined && id !== null ? id : '');
    }

    _getAttachmentURL(entity, id, field) {
        this._validateStoreName();

        entity = ( !this._globalHelpers.isUndefined(entity) ) ? entity : CONSTANTS.DEFAULT_ENTITY;

        return this._globalHelpers.strReplace(['{storeName}', '{entity}', '{id}', '{field}'], [this._storeName, entity, (id !== undefined && id !== null ? id : ''), field], CONSTANTS.API_ATTACHMENT_URL);
    }

    _call(method, id, data, entity, type, headers) {
        return $.ajax({
            url: this._getURL(entity, type, id),
            type: method,
            accept: 'application/vnd.vtex.ds.v10+json',
            contentType: 'application/json; charset=utf-8',
            beforeSend(request) {
                for ( let header in headers ) {
                    if ( {}.hasOwnProperty.call(headers, header) ) {
                        request.setRequestHeader(header, headers[header]);
                    }
                }
            },
            crossDomain: true,
            data: method !== 'get' && data !== null ? JSON.stringify(data) : data,
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
            mimeType: 'multipart/form-data',
        });
    }

    _performSearch(params, fields, entity, limit, offset, filters) {
        this._validateStoreName();

        limit = limit || 49;
        offset = offset || 0;

        const headers = {'REST-Range': 'resources=' + offset + '-' + (limit + offset)};
        const defaults = ['id'];
        fields = ( this._globalHelpers.isArray(fields) ) ? this._globalHelpers.arrayUnique(fields.concat(['id'])) : defaults;
        params._fields = fields.join(',');

        if ( this._globalHelpers.isObject(filters) ) {
            if ( filters.hasOwnProperty('_where') ) {
                params._where = filters._where;
            }

            if ( filters.hasOwnProperty('_keyword') ) {
                params._keyword = filters._keyword;
            }

            if ( filters.hasOwnProperty('_sort') ) {
                params._sort = filters._sort;
            }
        }

        return this._call('get', null, params, entity, CONSTANTS.types.SEARCH, headers);
    }

    _validateStoreName() {
        if ( this._globalHelpers.isUndefined(this._storeName) ) {
            throw new Error(CONSTANTS.messages.storeName);
        }
    }

    /**
     * Parse response into object
     * @param  {array} data   Contains element inserted
     * @param  {array|object} result Contains AJAX Response
     * @param  {integer} status Status code response
     * @return {object}        Object with all values
     */
    _parseResponse(data, result, status) {
        const obj = {
            dataInsert: data,
            dataResponse: result,
            dataStatus: status,
        };

        return obj;
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
        return new CustomSuccess(result, operation);
    }

    /**
     * Parse an error
     * @param {object} error - The error that will be parsed
     * @return {VtexError} VtexError object
     */
    _parseError(error) {
        return new CustomError(error);
    }
}

export default Private;
