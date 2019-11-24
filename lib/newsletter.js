import insertUpdateUser from './insertUpdateUser';

/**
 * Newsletter opt-in / opt-out
 * @param {string} email - The email of the user to opt-in/out
 * @param {boolean} [isNewsletterOptIn=true] - Whether to opt-in/out
 * @param {object} [data={}] Custom data to send
 * @return {promise}
 */
const newsletter = async (email, isNewsletterOptIn = true, data = {}) => (
  insertUpdateUser(email, { isNewsletterOptIn, ...data })
);

export default newsletter;
