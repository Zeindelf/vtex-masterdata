import isEmail from './internal/isEmail';

import search from './search';

/**
 * Performs a search by email
 * @param {string} email - The email that will be searched
 * @param {string} entity - The entity where the search will be performed
 * @return {promise}
 */
const getByEmail = (email) => {
  if (!isEmail(email)) return Promise.reject(new Error('Invalid email'));

  return search({ email }, ['email', 'id'], null, 1, 0);
};

export default getByEmail;
