'use strict';

const jwt = require('jsonwebtoken');

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the access tokens
 */
let tokens = Object.create(null);

/**
 * Returns an access token if it finds one, otherwise returns null if one is not found.
 * @param   {String}  token - The token to decode to get the id of the access token to find.
 * @returns {Promise} resolved with the token if found, otherwise resolved with undefined
 */
exports.find = (token) => {
  try {
    const id = jwt.decode(token).jti;
    return Promise.resolve(tokens[id]);
  } catch (error) {
    return Promise.resolve(undefined);
  }
};

/**
 * Saves a access token, expiration date, user id, client id, and scope. Note: The actual full
 * access token is never saved.  Instead just the ID of the token is saved.  In case of a database
 * breach this prevents anyone from stealing the live tokens.
 * @param   {Object}  token          - The access token (required)
 * @param   {Date}    expirationDate - The expiration of the access token (required)
 * @param   {String}  userID         - The user ID (required)
 * @param   {String}  clientID       - The client ID (required)
 * @param   {String}  scope          - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (token, expirationDate, userID, clientID, scope) => {
  const id = jwt.decode(token).jti;
  tokens[id] = { userID, expirationDate, clientID, scope };
  return Promise.resolve(tokens[id]);
};

/**
 * Deletes/Revokes an access token by getting the ID and removing it from the storage.
 * @param   {String}  token - The token to decode to get the id of the access token to delete.
 * @returns {Promise} resolved with the deleted token
 */
exports.delete = (token) => {
  try {
    const id = jwt.decode(token).jti;
    const deletedToken = tokens[id];
    delete tokens[id];
    return Promise.resolve(deletedToken);
  } catch (error) {
    return Promise.resolve(undefined);
  }
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
