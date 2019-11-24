import uniq from './internal/uniq';

import call from './call';
/**
 * Get a master data document
 * @param {string} id - The ID of the document to get
 * @param {Array} [fields=["id"]] - A list of fields to retrieve,
 *   default values will always be retrieved
 * @param {string} entity - The entity of the document to get
 * @return {promise}
 */
const get = (id, fields, entity) => {
  const defaults = ['id'];
  fields = Array.isArray(fields) ? uniq(fields.concat(['id'])) : defaults;
  const params = {
    _fields: fields.join(','),
  };

  return call('get', id, params, entity, 'documents');
};

export default get;
