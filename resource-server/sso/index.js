'use strict';

const config  = require('../config');
const db      = require('../db');
const request = require('request');

/* eslint-disable camelcase */

/**
 * https://localhost:4000/(any end point that is part of your API)
 * Use this to protect any end point that you might have.  On successful
 * login you will get back a req.session.accessToken and (optionally) a
 * req.session.refreshToken if the authorization server is setup to send back
 * refresh tokens.
 *
 * For example, I use this with the https://localhost:4000/infoss like so
 * (see site.js)
 *
 * exports.infosso = [
 *   sso.ensureSingleSignOn(),
 *     function(req, res) {
 *       var accessToken = req.session.accessToken;
 *       var refreshToken = req.session.refreshToken;
 *       res.render('info', {
 *         access_token: accessToken,
 *         refresh_token: refreshToken
 *       });
 *     }
 * ];
 * @returns {Function} Single sign on function`
 */
exports.ensureSingleSignOn = () => (req, res, next) => {
  if (!req.session.isAuthorized) {
    req.session.redirectURL = req.originalUrl || req.url; // eslint-disable-line no-param-reassign
    res.redirect(`${config.authorization.authorizeURL}?redirect_uri=${config.authorization.redirectURL}&response_type=code&client_id=${config.client.clientID}&scope=offline_access`);
  } else {
    next();
  }
};

/**
 * https://localhost:4000/receivetoken?code=(authorization code)
 *
 * This is part of the single sign on using the OAuth2 Authorization Code grant type.  This is the
 * redirect from the authorization server.  If you send in a bad authorization code you will get the
 * response code of 400 and the message of
 * {
 *     "error": "invalid_grant",
 *     "error_description": "invalid code"
 * }
 * @param   {Object} req - The request which should have the parameter query of
 *                         ?code=(authorization code)
 * @param   {Object} res - We use this to redirect to the original URL that needed to
 *                         authenticate with the authorization server.
 * @returns {undefined}
 */
exports.receivetoken = (req, res) => {
  // Get the token
  request.post(config.authorization.url + config.authorization.tokenURL, {
    form : {
      code          : req.query.code,
      redirect_uri  : config.authorization.redirectURL,
      client_id     : config.client.clientID,
      client_secret : config.client.clientSecret,
      grant_type    : 'authorization_code',
    },
  }, (error, response, body) => {
    const { access_token, refresh_token, expires_in } = JSON.parse(body);
    if (response.statusCode === 200 && access_token != null) {
      req.session.accessToken  = access_token;  // eslint-disable-line no-param-reassign
      req.session.refreshToken = refresh_token; // eslint-disable-line no-param-reassign
      req.session.isAuthorized = true;          // eslint-disable-line no-param-reassign

      const expirationDate = expires_in ? new Date(Date.now() + (expires_in * 1000)) : null;
      db.accessTokens.save(access_token, expirationDate, config.client.clientID)
      .then(() => {
        if (refresh_token != null) {
          return db.refreshTokens.save(refresh_token, config.client.clientID);
        }
        return Promise.resolve();
      })
      .then(res.redirect(req.session.redirectURL))
      .catch(() => res.send(500));
    } else {
      // Error, someone is trying to put a bad authorization code in
      res.status(response.statusCode);
      res.send(response.body);
    }
  });
};
