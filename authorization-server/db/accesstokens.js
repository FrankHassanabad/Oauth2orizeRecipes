'use strict';

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the access tokens
 */
let tokens = Object.create(null);

/**
 * Returns an access token if it finds one, otherwise returns
 * null if one is not found.
 * @param   {String}   key  - The key to the access token
 * @param   {Function} done - The access token if found, otherwise returns undefined
 * @returns {undefined}
 */
exports.find = (key, done) => {
  const token = tokens[key];
  return done(null, token);
};

/**
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param   {Object}   token          - The access token (required)
 * @param   {Date}     expirationDate - The expiration of the access token (required)
 * @param   {String}   userID         - The user ID (required)
 * @param   {String}   clientID       - The client ID (required)
 * @param   {String}   scope          - The scope (optional)
 * @param   {Function} done           - Calls this with undefined always
 * @returns {undefined}
 */
exports.save = (token, expirationDate, userID, clientID, scope, done) => {
  tokens[token] = { userID, expirationDate, clientID, scope };
  return done();
};

/**
 * Deletes an access token
 * @param   {String}   key  - The access token to delete
 * @param   {Function} done - Calls this with undefined always
 * @returns {undefined}
 */
exports.delete = (key, done) => {
  delete tokens[key];
  return done();
};

/**
 * Removes expired access tokens. It does this by looping through them all
 * and then removing the expired ones it finds.
 * @param   {Function} done - Calls this with undefined always.
 * @returns {undefined}
 */
exports.removeExpired = (done) => {
  tokens = tokens.filter(token => new Date() > token.expirationDate);
  return done();
};

/**
 * Removes all access tokens.
 * @param   {Function} done - Calls this with undefined always.
 * @returns {undefined}
 */
exports.removeAll = (done) => {
  tokens = Object.create(null);
  return done();
};
