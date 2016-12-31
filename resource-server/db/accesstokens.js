'use strict';

// The access token and optionally refresh token.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the access tokens
 */
let tokens = Object.create(null);

/**
 * Returns an access token if it finds one, otherwise returns null if one is not found.
 * @param   {String}  key  - The key to the access token
 * @returns {Promise} resolved with the token
 */
exports.find = key => Promise.resolve(tokens[key]);

/**
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param   {Object}  token          - The access token (required)
 * @param   {Date}    expirationDate - The expiration of the access token (required)
 * @param   {String}  userID         - The user ID (required)
 * @param   {String}  clientID       - The client ID (required)
 * @param   {String}  scope          - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (token, expirationDate, userID, clientID, scope) => {
  tokens[token] = { userID, expirationDate, clientID, scope };
  return Promise.resolve(tokens[token]);
};

/**
 * Deletes an access token
 * @param   {String}  key - The access token to delete
 * @returns {Promise} resolved with the deleted token
 */
exports.delete = (key) => {
  const deletedToken = tokens[key];
  delete tokens[key];
  return Promise.resolve(deletedToken);
};

/**
 * Removes expired access tokens. It does this by looping through them all and then removing the
 * expired ones it finds.
 * @returns {Promise} resolved with an associative of tokens that were expired
 */
exports.removeExpired = () => {
  const keys    = Object.keys(tokens);
  const expired = keys.reduce((accumulator, key) => {
    if (new Date() > tokens[key].expirationDate) {
      const expiredToken = tokens[key];
      delete tokens[key];
      accumulator[key] = expiredToken; // eslint-disable-line no-param-reassign
    }
    return accumulator;
  }, Object.create(null));
  return Promise.resolve(expired);
};

/**
 * Removes all access tokens.
 * @returns {Promise} resolved with all removed tokens returned
 */
exports.removeAll = () => {
  const deletedTokens = tokens;
  tokens              = Object.create(null);
  return Promise.resolve(deletedTokens);
};
