'use strict';

// The access token and optionally refresh token.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the refresh tokens
 */
const tokens = Object.create(null);

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param   {String}   key  - The key to the access token
 * @returns {Promise}  resolved with the token
 */
exports.find = key => Promise.resolve(tokens[key]);

/**
 * Saves a refresh token, user id, client id, and scope.
 * @param   {Object}  token    - The refresh token (required)
 * @param   {String}  userID   - The user ID (required)
 * @param   {String}  clientID - The client ID (required)
 * @param   {String}  scope    - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (token, userID, clientID, scope) => {
  tokens[token] = { userID, clientID, scope };
  return Promise.resolve(tokens[token]);
};

/**
 * Deletes a refresh token
 * @param   {String}   key  - The refresh token to delete
 * @returns {Promise} resolved with the deleted token
 */
exports.delete = (key) => {
  const deletedToken = tokens[key];
  delete tokens[key];
  return Promise.resolve(deletedToken);
};
