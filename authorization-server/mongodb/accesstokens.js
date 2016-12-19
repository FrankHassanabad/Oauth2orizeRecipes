'use strict';

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

const mongodb = require('./mongoinit.js');

/**
 * Returns an access token if it finds one, otherwise returns null if one is not found.
 * @param   {String}   key  - The key to the access token
 * @param   {Function} done - The access token if found, otherwise returns undefined
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
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param   {Object}   token          - The access token (required)
 * @param   {Date}     expirationDate - The expiration of the access token (required)
 * @param   {String}   userID         - The user ID (required)
 * @param   {String}   clientID       - The client ID (required)
 * @param   {String}   scope          - The scope (optional)
 * @param   {Function} done           - Calls this with undefined or error
 * @returns {undefined}
 */
exports.save = (token, expirationDate, userID, clientID, scope, done) => {
  mongodb.getCollection((collection) => {
    collection.insert({ token, userID, expirationDate, clientID, scope }, (err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
  });
};

/**
 * Deletes an access token
 * @param   {String}   key  - The access token to delete
 * @param   {Function} done - The result of the deletion or error
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

/**
 * Removes expired access tokens.  It does this by looping through them all and then removing the
 * expired ones it finds.
 * @param   {Function} done - returns undefined always.
 * @returns {undefined}
 */
exports.removeExpired = (done) => {
  mongodb.getCollection((collection) => {
    collection.find().each((err, token) => {
      if (token != null) {
        if (new Date() > token.expirationDate) {
          collection.remove({ token });
        }
      }
    });
  });
  return done();
};

/**
 * Removes all access tokens.
 * @param   {Function} done - returns undefined always.
 * @returns {undefined}
 */
exports.removeAll = (done) => {
  mongodb.getCollection((collection) => {
    collection.remove();
    return done();
  });
};
