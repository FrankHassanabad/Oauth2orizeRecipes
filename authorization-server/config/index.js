//
// The configuration options of the server
//

/**
 * Configuration of access tokens.
 *
 * expiresIn - The time in seconds before the access token expires
 * calculateExpirationDate - A simple function to calculate the absolute
 * time that th token is going to expire in.
 * @type {{expiresIn: number, calculateExpirationDate: Function}}
 */
exports.token = {
    expiresIn: 3600,
    calculateExpirationDate: function() {
        return new Date(new Date().getTime() + (this.expiresIn * 1000));
    }
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

//todo Add configuration for the size of the Authorization tokens
//todo Add configuration for the size of the access tokens