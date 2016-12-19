'use strict';

// The refresh tokens.
// You will use these to get access tokens to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the refresh tokens
 */
const tokens = Object.create(null);

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param   {String}   key  - The key to the refresh token
 * @param   {Function} done - The refresh token if found, otherwise returns null
 * @returns {undefined}
 */
exports.find = (key, done) => {
  const token = tokens[key];
  return done(null, token);
};

/**
 * Saves a refresh token, user id, client id, and scope.
 * @param   {Object} token    - The refresh token (required)
 * @param   {String} userID   - The user ID (required)
 * @param   {String} clientID - The client ID (required)
 * @param   {String} scope    - The scope (optional)
 * @param   {Function} done   - Calls this with undefined always
 * @returns {undefined}
 */
exports.save = (token, userID, clientID, scope, done) => {
  tokens[token] = { userID, clientID, scope };
  return done();
};

/**
 * Deletes a refresh token
 * @param   {String}   key  - The refresh token to delete
 * @param   {Function} done - Calls this with undefined always
 * @returns {undefined}
 */
exports.delete = (key, done) => {
  delete tokens[key];
  return done();
};
