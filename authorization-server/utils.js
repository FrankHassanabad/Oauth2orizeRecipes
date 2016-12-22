'use strict';

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param  {Number}   min - Minimum
 * @param  {Number}   max - Maximum
 * @return {Number} Random number
 * @api private
 */
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;// eslint-disable-line no-mixed-operators

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number}  len - Length
 * @return {String} String of random characters
 * @api private
 */
exports.uid = (len) => {
  const buf     = [];
  const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charlen = chars.length;

  for (let i = 0; i < len; i += 1) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};
