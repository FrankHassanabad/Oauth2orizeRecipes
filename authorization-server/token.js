/*jslint node: true */
/*global exports */
'use strict';

var passport = require('passport');
var config = require('./config');
var db = require('./' + config.db.type);

/**
 * This endpoint is for verifying a token.  This has the same signature to
 * Google's token verification system from:
 * https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken
 *
 * You call it like so
 * https://localhost:3000/api/tokeninfo?access_token=someToken
 *
 * If the token is valid you get returned
 * {
 *   "audience": someClientId
 * }
 *
 * If the token is not valid you get a 400 Status and this returned
 * {
 *   "error": "invalid_token"
 * }
 */
exports.info = [
  function (req, res) {
    if (req.query.access_token) {
      db.accessTokens.find(req.query.access_token, function (err, token) {
        if (err || !token) {
          res.status(400);
          res.json({error: "invalid_token"});
        } else if (new Date() > token.expirationDate) {
          res.status(400);
          res.json({error: "invalid_token"});
        }
        else {
          db.clients.find(token.clientID, function (err, client) {
            if (err || !client) {
              res.status(400);
              res.json({error: "invalid_token"});
            } else {
              if (token.expirationDate) {
                var expirationLeft = Math.floor((token.expirationDate.getTime() - new Date().getTime()) / 1000);
                if (expirationLeft <= 0) {
                  res.json({error: "invalid_token"});
                } else {
                  res.json({audience: client.clientId, expires_in: expirationLeft});
                }
              } else {
                res.json({audience: client.clientId});
              }
            }
          });
        }
      });
    } else {
      res.status(400);
      res.json({error: "invalid_token"});
    }
  }
];
