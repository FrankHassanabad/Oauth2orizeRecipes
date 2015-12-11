/*jslint node: true */
'use strict';

//The authorization codes.
//You will use these to get the access codes to get to the data in your endpoints as outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('http://wiki:8091');
var bucket = cluster.openBucket('oauth', 'J5ELwZrL2yvPLpxA8VVu');

/**
 * Returns an authorization code if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the authorization code
 * @param done The function to call next
 * @returns The authorization code if found, otherwise returns null
 */
exports.find = function (key, done) {
    bucket.get('authorizationcode_' + key, function (err, result) {
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
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param code The authorization code (required)
 * @param clientID The client ID (required)
 * @param userID The user ID (required)
 * @param redirectURI The redirect URI of where to send access tokens once exchanged (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (code, clientID, redirectURI, userID, scope, done) {
    var newAuthCode = { type: "authorizationcode", clientID: clientID, redirectURI: redirectURI, userID: userID, scope: scope };
  
    bucket.insert('authorizationcode_' + code, newAuthCode, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        return done(null);
    });
};

/**
 * Deletes an authorization code
 * @param key The authorization code to delete
 * @param done Calls this with null always
 */
exports.delete = function (key, done) {
    bucket.remove('authorizationcode_' + key, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        return done(null);
    });
};

