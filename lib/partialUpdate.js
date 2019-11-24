import call from './call';

/**
 * Partial update of a document
 * @param {string} id - The ID of the document to update
 * @param {Object} data - The data that will be updated
 * @param {string} entity - The entity of the document to insert
 * @return {promise}
 */
const partialUpdate = (id, data, entity) => call('PATCH', id, data, entity, 'documents');

export default partialUpdate;
