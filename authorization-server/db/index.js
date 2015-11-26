/*jslint node: true */
'use strict';

var config = require('../config');

// Environemnt related configuration
//exports.users = require('./users');
//exports.clients = require('./clients');
if (config.env == 'dev') {
    exports.users = require('../stores/users.js');
    exports.clients =require('../stores/clients.js');
} else if (config.env == 'test' || config.env == 'prod') {
    exports.users = require('../stores/userssql.js');
    exports.clients =require('../stores/clientscouchbase.js');
} else {
    throw new Error("Invalid environment.");
}


exports.accessTokens = require('./accesstokens');
exports.authorizationCodes = require('./authorizationcodes');
exports.refreshTokens = require('./refreshtokens');
