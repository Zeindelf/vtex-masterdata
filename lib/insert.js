import call from './call';

/**
 * Insert a document
 * @param {Object} data - The data that will be inserted
 * @param {string} entity - The entity of the document to insert
 * @return {promise}
 */
const insert = (data, entity) => call('POST', null, data, entity, 'documents');

export default insert;
