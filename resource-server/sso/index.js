var config = require('../config')
    , request = require('request');

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
 *     sso.ensureSingleSignOn(),
 *     function(req, res) {
 *         var accessToken = req.session.accessToken;
 *         var refreshToken = req.session.refreshToken;
 *         res.render('info', {
 *             access_token: accessToken,
 *             refresh_token: refreshToken
 *         });
 *      }
 * ];
 */
exports.ensureSingleSignOn = function() {
    return function(req, res, next) {
        if(!req.session.isAuthorized) {
            req.session.redirectURL = req.originalUrl || req.url;
            res.redirect(
                config.authorization.authorizeURL + '?redirect_uri=' + config.authorization.redirectURL +
                '&response_type=code&client_id=' + config.client.clientID + '&scope=offline_access'
            );
        } else {
            next();
        }
    }
};

/**
 * https://localhost:4000/receivetoken?code=(authorization code)
 *
 * This is part of the single sign on using the OAuth2 Authorization Code grant type.  This is the
 * redirect from the authorization server.
 * @param req The request which should have the parameter query of ?code=(authorization code)
 * @param res We use this to redirect to the original URL that needed to authenticate with the
 * authorization server.
 */
exports.receivetoken = function(req, res) {
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
            //TODO Check for errors (even though there shouldn't be any, still good to check for them)
            //TODO Store in the local database (otherwise we end up making an additional unnecessary end point call later)
            req.session.accessToken = jsonResponse.access_token;
            req.session.refreshToken = jsonResponse.refresh_token;
            req.session.isAuthorized = true;
            res.redirect(req.session.redirectURL);
        }
    );
};
