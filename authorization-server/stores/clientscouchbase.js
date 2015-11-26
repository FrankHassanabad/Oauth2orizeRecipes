/*jslint node: true */
'use strict';

/**
 * This is the configuration of the clients that are allowed to connected to your authorization server.
 * These represent client applications that can connect.  At a minimum you need the required properties of
 *
 * id: (A unique numeric id of your client application )
 * name: (The name of your client application)
 * clientId: (A unique id of your client application)
 * clientSecret: (A unique password(ish) secret that is _best not_ shared with anyone but your client
 *     application and the authorization server.
 *
 * Optionally you can set these properties which are
 * trustedClient: (default if missing is false.  If this is set to true then the client is regarded as a
 *     trusted client and not a 3rd party application.  That means that the user will not be presented with
 *     a decision dialog with the trusted application and that the trusted application gets full scope access
 *     without the user having to make a decision to allow or disallow the scope access.
 */
var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('http://wiki:8091');
var bucket = cluster.openBucket('oauth', 'J5ELwZrL2yvPLpxA8VVu');


/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param id The unique id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */
exports.find = function (id, done) {
    bucket.get(id, function (err, result) {
        if (err) {
            return done(err, null);
        }

        if (!(result && result.value)) {
            return done(null, null);
        }
        
        var client = result.value;
        client.id = id;

        return done(null, client);
    });
};

/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param clientId The unique client id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */
exports.findByClientId = function (clientId, done) {
    var query = ViewQuery.from('dev_oauth_views', 'clients');
    bucket.query(query, function (err, result) {
        if (err) {
            return done(err, null);
        }
        
        if (!result) {
            return done(null, null);
        }
        
        for (var i = 0; i < result.length; i++) {
            var currentClient = result[i].value;

            if (currentClient.clientId === clientId) {
                currentClient.id = result[i].key;
                return done(null, currentClient);
            }
        }
        
        return done(null, null);
    });

    //bucket.get('1', function (err, result) {
    //    if (err) {
    //        return done(err, null);
    //    }
        
    //    if (!(result && result.value)) {
    //        return done(null, null);
    //    }
        
    //    return done(null, result.value);
    //});
};
