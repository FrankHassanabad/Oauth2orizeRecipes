/*jslint node: true */
'use strict';

//The refresh tokens.
//You will use these to get access tokens to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the refresh tokens
 */
var tokens = {};

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the refresh token
 * @param done The function to call next
 * @returns The refresh token if found, otherwise returns null
 */
exports.find = function (key, done) {
  var token = tokens[key];
  return done(null, token);
};

/**
 * Saves a refresh token, user id, client id, and scope.
 * @param token The refresh token (required)
 * @param userID The user ID (required)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, userID, clientID, scope, done) {
  tokens[token] = {userID: userID, clientID: clientID, scope: scope};
  return done(null);
};

/**
 * Deletes a refresh token
 * @param key The refresh token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  delete tokens[key];
  return done(null);
};
