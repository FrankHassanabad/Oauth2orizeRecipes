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
 * Returns an authorization code if it finds one, otherwise returns
 * null if one is not found.
 * @param   {String}   key  - The key to the authorization code
 * @param   {Function} done - Calls this with the authorization code if found else undefined
 * @returns {undefined}
 */
exports.find = (key, done) => {
  const code = codes[key];
  return done(null, code);
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param   {String}   code        - The authorization code (required)
 * @param   {String}   clientID    - The client ID (required)
 * @param   {String}   redirectURI - The redirect URI of where to send access tokens once exchanged
 * @param   {String}   userID      - The user ID (required)
 * @param   {String}   scope       - The scope (optional)
 * @param   {Function} done        - Calls this with undefined always
 * @returns {undefined}
 */
exports.save = (code, clientID, redirectURI, userID, scope, done) => {
  codes[code] = { clientID, redirectURI, userID, scope };
  return done();
};

/**
 * Deletes an authorization code
 * @param   {String}   key  - The authorization code to delete
 * @param   {Function} done - Calls this with undefined always
 * @returns {undefined}
 */
exports.delete = (key, done) => {
  delete codes[key];
  return done();
};

