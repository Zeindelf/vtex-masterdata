import partialUpdate from './partialUpdate';

/**
 * Insert/update a document
 * @param {string} id - The ID of the item that will be inserted/updated
 * @param {Object} data - The data that will be inserted
 * @param {string} entity - The entity of the document to insert
 * @return {promise}
 */
const insertUpdate = (id, data, entity) => partialUpdate(id, data, entity);

export default insertUpdate;
