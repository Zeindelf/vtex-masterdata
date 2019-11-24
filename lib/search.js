import isObject from './internal/isObject';
import uniq from './internal/uniq';

import call from './call';

/**
 * Performs a single search
 * @param {Object} params - The search parameters
 * @param {Array} fields - The Fields that will be retrieved
 * @param {string} [entity='CL'] - The entity where the search will be performed
 * @param {int} [limit=49] - The search limit
 * @param {int} [offset=0] - The search offset
 * @param {Object} [filters=null] - The filters params. Accept: _where, _keyword and _sort
 * @return {promise}
 */
const search = (params, fields, entity, limit = 49, offset = 0, filters = null) => {
  const headers = { 'REST-Range': `resources=${offset}-${limit + offset}` };
  const defaults = ['id'];
  fields = Array.isArray(fields) ? uniq(fields.concat(['id'])) : defaults;
  params._fields = fields.join(',');

  if (isObject(filters)) {
    if (hasOwnProperty.call(filters, '_where')) {
      params._where = filters._where;
    }

    if (hasOwnProperty.call(filters, '_keyword')) {
      params._keyword = filters._keyword;
    }

    if (hasOwnProperty.call(filters, '_sort')) {
      params._sort = filters._sort;
    }
  }

  return call('GET', null, params, entity, 'search', headers);
};

export default search;
