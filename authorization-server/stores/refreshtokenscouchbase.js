/*jslint node: true */
'use strict';

//The refresh tokens.
//You will use these to get access tokens to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('http://wiki:8091');
var bucket = cluster.openBucket('oauth', 'J5ELwZrL2yvPLpxA8VVu');

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the refresh token
 * @param done The function to call next
 * @returns The refresh token if found, otherwise returns null
 */
exports.find = function (key, done) {
    bucket.get('refreshtoken_' + key, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        if (!result) {
            return done(null, null);
        }
        
        return done(null, result.value);
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
    var newToken = { type: "refreshtoken", userID: userID, clientID: clientID, scope: scope };

    bucket.insert('refreshtoken_' + token, newToken, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        return done(null);
    });
};

/**
 * Deletes a refresh token
 * @param key The refresh token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
    bucket.remove('refreshtoken_' + key, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        return done(null);
    });
};
