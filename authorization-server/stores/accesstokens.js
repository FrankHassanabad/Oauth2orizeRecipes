/*jslint node: true */
'use strict';

//The access tokens.
//You will use these to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

/**
 * Tokens in-memory data structure which stores all of the access tokens
 */
var tokens = {};

/**
 * Returns an access token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the access token
 * @param done The function to call next
 * @returns The access token if found, otherwise returns null
 */
exports.find = function (key, done) {
  var token = tokens[key];
  return done(null, token);
};

/**
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param token The access token (required)
 * @param expirationDate The expiration of the access token that is a javascript Date() object (required)
 * @param userID The user ID (required)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, expirationDate, userID, clientID, scope, done) {
  tokens[token] = {userID: userID, expirationDate: expirationDate, clientID: clientID, scope: scope};
  return done(null);
};

/**
 * Deletes an access token
 * @param key The access token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  delete tokens[key];
  return done(null);
};

/**
 * Removes expired access tokens.  It does this by looping through them all
 * and then removing the expired ones it finds.
 * @param done returns this when done.
 * @returns done
 */
exports.removeExpired = function (done) {
  var tokensToDelete = [];
  for (var key in tokens) {
    if (tokens.hasOwnProperty(key)) {
      var token = tokens[key];
      if (new Date() > token.expirationDate) {
        tokensToDelete.push(key);
      }
    }
  }
  for (var i = 0; i < tokensToDelete.length; ++i) {
    console.log("Deleting token:" + key);
    delete tokens[tokensToDelete[i]];
  }
  return done(null);
};

/**
 * Removes all access tokens.
 * @param done returns this when done.
 */
exports.removeAll = function (done) {
  tokens = {};
  return done(null);
};
