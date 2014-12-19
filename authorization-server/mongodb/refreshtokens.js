/*jslint node: true */
/*global exports */
/*global mongodb */
'use strict';

//The refresh tokens.
//You will use these to get access tokens to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var mongodb = require('./mongoinit.js');

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the refresh token
 * @param done The function to call next
 * @returns The refresh token if found, otherwise returns null
 */
exports.find = function (key, done) {
  mongodb.getCollection(function (collection) {
    var cursor = collection.find({token: key});
    cursor.nextObject(function (err, token) {
      if (!err && token) {
        return done(null, token);
      } else {
        return done(null);
      }
    });
  });
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
  mongodb.getCollection(function (collection) {
    collection.insert({
      token: token,
      userID: userID,
      clientID: clientID,
      scope: scope
    }, function (err, inserted) {
      if (err) {
        return done(err);
      } else {
        return done(null);
      }
    });
  });
};

/**
 * Deletes a refresh token
 * @param key The refresh token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  mongodb.getCollection(function (collection) {
    collection.remove({
      token: key
    }, function (err, result) {
      if (err) {
        return done(err, result);
      } else {
        return done(null, result);
      }
    });
  });
};
