//The access token and optionally refresh token.
//You will use these to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var tokens = { };

/**
 * Finds an access token and passes it if it exists, otherwise
 * it passes null
 * @param accessToken The accessToken to find
 * @param done Passes the token or null
 */
exports.find = function(accessToken, done) {
    var token = tokens[accessToken];
    return done(null, token);
};

/**
 * Saves a access token, refresh token, client id, and scope.
 * @param accessToken The access token (required)
 * @param refreshToken The refresh token (optional)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null
 */
exports.save = function(refreshToken, clientID, scope, done) {
    tokens[refreshToken] = { refreshToken: refreshToken, clientID: clientID, scope: scope };
    return done(null);
};

/**
 * Deletes an access token
 * @param accessToken The access token to delete
 * @param done returns this when done
 */
exports.delete = function(accessToken, done) {
    delete tokens[accessToken];
    return done(null);
}