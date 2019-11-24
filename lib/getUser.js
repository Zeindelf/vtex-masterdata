import resultOk from './internal/resultOk';
import head from './internal/head';

import getByEmail from './getByEmail';
import get from './get';

/**
 * Get User by mail
 * @param {string} email - The email of the user
 * @param {Array} [fields] - A list of fields to retrieve
 * @return {promise}
 */
const getUser = async (email, fields) => {
  const result = await getByEmail(email);

  return (resultOk(result)
    ? get(head(result).id, fields)
    : Promise.reject(new Error('User doesn\'t exist')));
};

export default getUser;
