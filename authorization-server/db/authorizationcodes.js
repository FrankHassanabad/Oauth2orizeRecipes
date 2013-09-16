/**
 * Authorization codes in-memory data structure which stores all of the authorization codes
 */
var codes = {};

/**
 * Returns an authorization code if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the authorization code
 * @param done The function to call next
 * @returns The authorization code if found, otherwise returns null
 */
exports.find = function (key, done) {
    var code = codes[key];
    return done(null, code);
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param code The authorization code (required)
 * @param clientID The client ID (required)
 * @param userID The user ID (required)
 * @param redirectURI The redirect URI of where to send access tokens once exchanged (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @param returns this with null
 */
exports.save = function (code, clientID, redirectURI, userID, scope, done) {
    codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID, scope: scope };
    return done(null);
};

/**
 * Deletes an authorization code
 * @param key The authorization code to delete
 * @param done Calls this with null always
 */
exports.delete = function(key, done) {
    delete codes[key];
    return done(null);
}

