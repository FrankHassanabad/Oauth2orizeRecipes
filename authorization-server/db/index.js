/*jslint node: true */
'use strict';

var config = require('../config');

// Environemnt related configuration
//exports.users = require('./users');
//exports.clients = require('./clients');
//exports.accessTokens = require('./accesstokens');

if (config.env == 'dev') {
    exports.users = require('../stores/users.js');
    exports.clients = require('../stores/clients.js');
    exports.accessTokens = require('./accesstokens');
} else if (config.env == 'test' || config.env == 'prod') {
    exports.users = require('../stores/userssql.js');
    exports.clients = require('../stores/clientscouchbase.js');
    exports.accessTokens = require('../stores/accesstokenscouchbase.js');
} else {
    throw new Error("Invalid environment.");
}



exports.authorizationCodes = require('./authorizationcodes');
exports.refreshTokens = require('./refreshtokens');
