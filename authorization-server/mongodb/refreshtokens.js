'use strict';

// The refresh tokens.
// You will use these to get access tokens to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

const mongodb = require('./mongoinit.js');

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param   {String}   key  - The key to the refresh token
 * @param   {Function} done - The refresh token if found, otherwise returns undefined
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
 * Saves a refresh token, user id, client id, and scope.
 * @param   {String}   token    - The refresh token (required)
 * @param   {String}   userID   - The user ID (required)
 * @param   {String}   clientID - The client ID (required)
 * @param   {String}   scope    - The scope (optional)
 * @param   {Function} done     - Calls this with undefined or error always
 * @returns {undefined}
 */
exports.save = (token, userID, clientID, scope, done) => {
  mongodb.getCollection((collection) => {
    collection.insert({ token, userID, clientID, scope }, (err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
  });
};

/**
 * Deletes a refresh token
 * @param   {String}   key  - The refresh token to delete
 * @param   {Function} done - the deletion results
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
