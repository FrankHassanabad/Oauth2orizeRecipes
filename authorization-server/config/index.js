//
// The configuration options of the server
//

/**
 * Configuration of access tokens.
 *
 * expiresIn - The time in seconds before the access token expires
 * calculateExpirationDate - A simple function to calculate the absolute
 * time that th token is going to expire in.
 * authorizationCodeLength - The length of the authorization code
 * accessTokenLength - The length of the access token
 * refreshTokenLength - The length of the refresh token
 */
exports.token = {
    expiresIn: 3600,
    calculateExpirationDate: function() {
        return new Date(new Date().getTime() + (this.expiresIn * 1000));
    },
    authorizationCodeLength: 16,
    accessTokenLength: 256,
    refreshTokenLength: 256
};

/**
 * Database configuration for access and refresh tokens.
 *
 * timeToCheckExpiredTokens - The time in seconds to check the database
 * for expired access tokens.  For example, if it's set to 3600, then that's
 * one hour to check for expired access tokens.
 * type - The type of database to use.  "db" for "in-memory", or
 * "mongodb" for the mongo database store.
 * dbName - The database name to use.
 */
exports.db = {
    timeToCheckExpiredTokens: 3600,
    type: "db",
    dbName: "OAuth2orizeRecipeTokens"
};

/**
 * Session configuration
 *
 * type - The type of session to use.  MemoryStore for "in-memory",
 * or MonoStore for the mongo database store
 * maxAge - The maximum age in milliseconds of the session.  Use null for
 * web browser session only.  Use something else large like 3600000 * 24 * 7 * 52
 * for a year.
 * secret - The session secret that you should change to what you want
 * dbName - The database name if you're using Mongo
 */
exports.session = {
    type: "MemoryStore",
    maxAge: 3600000 * 24 * 7 * 52,
    //TODO You need to change this secret to something that you choose for your secret
    secret: "A Secret That Should Be Changed",
    dbName: "Session"
};
