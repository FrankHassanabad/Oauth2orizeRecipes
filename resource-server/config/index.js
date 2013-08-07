/**
 * The client id and the client secret
 * @type {{clientID: string, clientSecret: string}}
 */
exports.client = {
    clientID: "abc123",
    clientSecret: "ssh-secret"
};

//TODO Compact this more, and document it better
/**
 * The Authorization server's location, port number, and the token info end point
 * @type {{host: string, port: string, url: string, tokenURL: string, tokeninfoURL: string}}
 */
exports.authorization = {
    host: "localhost",
    port: "3000",
    url: "https://localhost:3000/",
    tokenURL: "oauth/token",
    tokeninfoURL: "/api/tokeninfo?access_token="
};

/**
 * Database configuration for access and refresh tokens.
 *
 * timeToCheckExpiredTokens - The time in seconds to check the database
 * for expired access tokens.  For example, if it's set to 3600, then that's
 * one hour to check for expired access tokens.
 * @type {{timeToCheckExpiredTokens: number}}
 */
exports.db = {
    timeToCheckExpiredTokens: 3600
};
