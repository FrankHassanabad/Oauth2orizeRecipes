/*jslint node: true */
'use strict';

//The access tokens.
//You will use these to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('http://wiki:8091');
var bucket = cluster.openBucket('oauth', 'J5ELwZrL2yvPLpxA8VVu');

/**
 * Returns an access token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the access token
 * @param done The function to call next
 * @returns The access token if found, otherwise returns null
 */
exports.find = function (key, done) {
    bucket.get('accesstoken_' + key, function (err, result) { 
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
    var newToken = { type: 'accesstoken', userID: userID, expirationDate: expirationDate, clientID: clientID, scope: scope };

    bucket.insert('accesstoken_' + token, newToken, function (err, result) { 
        if (err) {
            return done(err, null);
        }
            
        return done(null);
    });
};

/**
 * Deletes an access token
 * @param key The access token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
    bucket.remove('accesstoken_' + token, function (err, result) {
        if (err) {
            return done(err, null);
        }

        return done(null);
    });
};

/**
 * Removes expired access tokens.  It does this by looping through them all
 * and then removing the expired ones it finds.
 * @param done returns this when done.
 * @returns done
 */
exports.removeExpired = function (done) {
    var query = ViewQuery.from('dev_oauth_views', 'accesstokens').stale(ViewQuery.Update.BEFORE);
    
    bucket.query(query, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        var tokensToDelete = [];
        
        for (var i = 0; i < result.length; i++) {
            var currentAccessToken = result[i].value;
            
            if (new Date() > new Date(currentAccessToken.expirationDate)) {
                tokensToDelete.push(result[i].key);
            }
        }
        
        for (var i = 0; i < tokensToDelete.length; ++i) {
            bucket.remove(tokensToDelete[i], function (err, result) {
                if (err) {
                    return done(err, null);
                }
                
                return done(null);
            });
        }

        return done(null);
    });
};

/**
 * Removes all access tokens.
 * @param done returns this when done.
 */
exports.removeAll = function (done) {
    var query = ViewQuery.from('dev_oauth_views', 'accesstokens').stale(ViewQuery.Update.BEFORE);
    
    bucket.query(query, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        for (var i = 0; i < result.length; i++) {
            var currentKey = result[i].key;
            bucket.remove(currentKey, function (err, result) {
                if (err) {
                    return done(err, null);
                }
                
                return done(null);
            });
        }
        
        return done(null);
    });
};
