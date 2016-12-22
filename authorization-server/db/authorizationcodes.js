'use strict';

// The authorization codes.
// You will use these to get the access codes to get to the data in your endpoints as outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Authorization codes in-memory data structure which stores all of the authorization codes
 */
const codes = Object.create(null);

/**
 * Returns an authorization code if it finds one, otherwise returns null if one is not found.
 * @param   {String}   key  - The key to the authorization code
 * @returns {Promise}  resolved with the authorization code if found, otherwise undefined
 */
exports.find = (key) => {
  const code = codes[key];
  return Promise.resolve(code);
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param   {String}   code        - The authorization code (required)
 * @param   {String}   clientID    - The client ID (required)
 * @param   {String}   redirectURI - The redirect URI of where to send access tokens once exchanged
 * @param   {String}   userID      - The user ID (required)
 * @param   {String}   scope       - The scope (optional)
 * @returns {Promise}  resolved with the saved token
 */
exports.save = (code, clientID, redirectURI, userID, scope) => {
  codes[code] = { clientID, redirectURI, userID, scope };
  return Promise.resolve(codes[code]);
};

/**
 * Deletes an authorization code
 * @param   {String}   key  - The authorization code to delete
 * @returns {Promise}  resolved with the deleted value
 */
exports.delete = (key) => {
  const deletedValue = codes[key];
  delete codes[key];
  return Promise.resolve(deletedValue);
};

