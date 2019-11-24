import head from './head';

/**
 * Check if a result is valid
 * @param {object} result - The result that will be parsed
 * @return {boolean}
 */
const resultOk = (result) => result !== undefined && result.length && head(result).id !== undefined;

export default resultOk;
