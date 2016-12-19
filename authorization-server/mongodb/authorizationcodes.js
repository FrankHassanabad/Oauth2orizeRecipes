'use strict';

// The authorization codes.
// You will use these to get the access codes to get to the data in your endpoints as outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

const mongodb = require('./mongoinit.js');

/**
 * Returns an authorization code if it finds one, otherwise returns undefined if one is not found.
 * @param   {String}   key  - The key to the authorization code
 * @param   {Function} done - The authorization code if found, otherwise returns undefined
 * @returns {undefined}
 */
exports.find = (key, done) => {
  mongodb.getCollection((collection) => {
    const cursor = collection.find({ token: key });
    cursor.nextObject((err, token) => {
      if (!err && token) {
        return done(null, token);
      }
      return done();
    });
  });
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param   {String}   code        - The authorization code (required)
 * @param   {String}   clientID    - The client ID (required)
 * @param   {String}   redirectURI - The redirect URI of where to send access tokens once exchanged
 * @param   {String}   userID      - The user ID (required)
 * @param   {String}   scope       - The scope (optional)
 * @param   {Function} done        - Calls this with undefined or error always
 * @returns {undefined}
 */
exports.save = (code, clientID, redirectURI, userID, scope, done) => {
  mongodb.getCollection((collection) => {
    collection.insert({ token: code, clientID, redirectURI, userID, scope }, (err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
  });
};

/**
 * Deletes an authorization code
 * @param   {String}   key  - The authorization code to delete
 * @param   {Function} done - Calls this with null or error always
 * @returns {undefined}
 */
exports.delete = (key, done) => {
  mongodb.getCollection((collection) => {
    collection.remove({ token: key }, (err, result) => {
      if (err) {
        return done(err, result);
      }
      return done(null, result);
    });
  });
};
