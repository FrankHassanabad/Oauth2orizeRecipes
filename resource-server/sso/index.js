/*jslint node: true */
/*global exports */
'use strict';

var config = require('../config');
var request = require('request');
var db = require('../db');

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
 */
exports.ensureSingleSignOn = function () {
  return function (req, res, next) {
    if (!req.session.isAuthorized) {
      req.session.redirectURL = req.originalUrl || req.url;
      res.redirect(
        config.authorization.authorizeURL + '?redirect_uri=' + config.authorization.redirectURL +
        '&response_type=code&client_id=' + config.client.clientID + '&scope=offline_access'
      );
    } else {
      next();
    }
  };
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
 * @param req The request which should have the parameter query of ?code=(authorization code)
 * @param res We use this to redirect to the original URL that needed to authenticate with the
 * authorization server.
 */
exports.receivetoken = function (req, res) {
  //Get the token
  request.post(
    config.authorization.url + config.authorization.tokenURL, {
      form: {
        code: req.query.code,
        redirect_uri: config.authorization.redirectURL,
        client_id: config.client.clientID,
        client_secret: config.client.clientSecret,
        grant_type: 'authorization_code'
      }
    },
    function (error, response, body) {
      var jsonResponse = JSON.parse(body);
      if (response.statusCode === 200 && jsonResponse.access_token) {
        req.session.accessToken = jsonResponse.access_token;
        req.session.refreshToken = jsonResponse.refresh_token;
        req.session.isAuthorized = true;

        var expirationDate = null;
        if (jsonResponse.expires_in) {
          expirationDate = new Date(new Date().getTime() + (jsonResponse.expires_in * 1000));
        }
        var saveAccessToken = function (err) {
          if (err) {
            res.send(500);
          }
          res.redirect(req.session.redirectURL);
        };
        if (jsonResponse.refresh_token) {
          db.refreshTokens.save(jsonResponse.refresh_token, config.client.clientID, null, function (err) {
            if (err) {
              res.send(500);
            }
            db.accessTokens.save(jsonResponse.access_token, expirationDate, config.client.clientID, null, saveAccessToken);
          });
        } else {
          db.accessTokens.save(jsonResponse.access_token, expirationDate, config.client.clientID, null, saveAccessToken);
        }
      } else {
        //Error, someone is trying to put a bad authorization code in
        res.status(response.statusCode);
        res.send(response.body);
      }
    }
  );
};
