/*jslint node: true */
'use strict';

var config = require('../config');

// Environemnt related configuration
//exports.users = require('./users');
if (config.env == 'dev') {
    exports.users = require('../stores/users.js');
} else if (config.env == 'test' || config.env == 'prod') {
    exports.users = require('../stores/userssql.js');
} else {
    throw new Error("Invalid environment.");
}

exports.clients = require('./clients');
exports.accessTokens = require('./accesstokens');
exports.authorizationCodes = require('./authorizationcodes');
exports.refreshTokens = require('./refreshtokens');
