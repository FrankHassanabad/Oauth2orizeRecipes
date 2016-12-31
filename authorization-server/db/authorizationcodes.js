'use strict';

const jwt = require('jsonwebtoken');

// The authorization codes.
// You will use these to get the access codes to get to the data in your endpoints as outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Authorization codes in-memory data structure which stores all of the authorization codes
 */
let codes = Object.create(null);

/**
 * Returns an authorization code if it finds one, otherwise returns null if one is not found.
 * @param   {String}  token - The token to decode to get the id of the authorization token to find.
 * @returns {Promise} resolved with the authorization code if found, otherwise undefined
 */
exports.find = (token) => {
  try {
    const id = jwt.decode(token).jti;
    return Promise.resolve(codes[id]);
  } catch (error) {
    return Promise.resolve(undefined);
  }
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope. Note: The actual full
 * authorization token is never saved.  Instead just the ID of the token is saved.  In case of a
 * database breach this prevents anyone from stealing the live tokens.
 * @param   {String}  code        - The authorization code (required)
 * @param   {String}  clientID    - The client ID (required)
 * @param   {String}  redirectURI - The redirect URI of where to send access tokens once exchanged
 * @param   {String}  userID      - The user ID (required)
 * @param   {String}  scope       - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (code, clientID, redirectURI, userID, scope) => {
  const id = jwt.decode(code).jti;
  codes[id] = { clientID, redirectURI, userID, scope };
  return Promise.resolve(codes[id]);
};

/**
 * Deletes an authorization code
 * @param   {String}  token - The authorization code to delete
 * @returns {Promise} resolved with the deleted value
 */
exports.delete = (token) => {
  try {
    const id = jwt.decode(token).jti;
    const deletedToken = codes[id];
    delete codes[id];
    return Promise.resolve(deletedToken);
  } catch (error) {
    return Promise.resolve(undefined);
  }
};

/**
 * Removes all authorization codes.
 * @returns {Promise} resolved with all removed authorization codes returned
 */
exports.removeAll = () => {
  const deletedTokens = codes;
  codes               = Object.create(null);
  return Promise.resolve(deletedTokens);
};
