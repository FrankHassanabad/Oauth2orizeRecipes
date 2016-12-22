'use strict';

const db       = require('./db');
const validate = require('./validate');

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
 * @param {Object} req The request
 * @param {Object} res The response
 * @returns {undefined}
 */
exports.info = [
  (req, res) => {
    if (!req.query.access_token) {
      res.status(400);
      res.json({ error: 'invalid_token' });
      return;
    }
    db.accessTokens.find(req.query.access_token)
    .then(token => validate.tokenForHttp(token))
    .then(token =>
      db.clients.find(token.clientID)
      .then(client => validate.clientExistsForHttp(client))
      .then(client => ({ client, token })))
    .then(({ client, token }) => {
      const expirationLeft = Math.floor((token.expirationDate.getTime() - Date.now()) / 1000);
      res.json({ audience: client.clientId, expires_in: expirationLeft });
    })
    .catch((err) => {
      res.status(err.status);
      res.json({ error: err.message });
    });
  },
];
