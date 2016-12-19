'use strict';

const login    = require('connect-ensure-login');
const passport = require('passport');
const sso      = require('./sso');

/**
 * https://localhost:4000/
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response that we send the string of "OAuth 2.0 Resource Server"
 * @returns {undefined}
 */
exports.index = (req, res) => {
  res.send('OAuth 2.0 Resource Server');
};

/**
 * https://localhost:4000/login (GET)
 * The OAuth2 Resource Owner Password Credentials login form
 * being rendered.  Use this to enter a user id and password
 * which will then be sent to the Authorization server through
 * the grant type of "password"
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the login page of views/login.ejs is rendered
 * @returns {undefined}
 */
exports.loginForm = (req, res) => {
  res.render('login');
};

/**
 * https://localhost:4000/login (POST)
 *
 * The login endpoint when a post occurs through the login form
 */
exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

/**
 * https://localhost:4000/info
 * An information screen which first checks if the user is logged in through
 * the OAuth2 Resource Owner Password Credentials.  If the user is logged in,
 * then it sends the access token and refresh token to the page of views/info.ejs
 *
 * Although this uses login.ensureLoggedIn(), behind the scenes it's
 * using OAuth2's Resource Owner Password Credentials to authenticate
 * the user.  On Authentication, a regular web session is created, and
 * a access_token and refresh_token are attached.
 *
 * See auth.js's LocalStrategy
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the login page of info is rendered
 * @returns {undefined}
 */
exports.info = [
  login.ensureLoggedIn(),
  (req, res) => {
    const accessToken  = req.user.accessToken;
    const refreshToken = req.user.refreshToken;
    res.render('info', {
      access_token  : accessToken,
      refresh_token : refreshToken,
    });
  },
];

/**
 * https://localhost:4000/infosso
 *
 * An information screen which first checks if the user is logged in through
 * the OAuth2 Authorization Code on the authorization server.  This operates
 * as a single sign on session, since if the user is already authenticated with
 * the authorization server, then they're redirected back here, to the resource
 * server.  The authorization server holds a persistent session on the user's
 * machine through a cookie while the resource server only holds a session cookie.
 * If you close your browser and then reopen it, you will be directed to the
 * authorization server and then back to this, the resource server, but you will
 * not have to re-login back since your login is controlled through the authorization
 * server's persistent session/cookie.
 *
 * If you're not logged into the authorization server, then you will have to
 * enter your credentials with the authorization server's login form.  Once you're
 * logged in and you're redirected back to the resource server, the access token and
 * refresh token follows with the redirection per the OAuth2 Authorization Code grant.
 * The access token and (optionally) the refresh token are pushed to the client browser
 * to access API calls to protected endpoints.
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the infoss is rendered
 * @returns {undefined}
 */
exports.infosso = [
  sso.ensureSingleSignOn(),
  (req, res) => {
    const accessToken  = req.session.accessToken;
    const refreshToken = req.session.refreshToken;
    res.render('info', {
      access_token  : accessToken,
      refresh_token : refreshToken,
    });
  },
];

/**
 * https://localhost:4000/api/protectedEndPoint
 *
 * An example protected endPoint
 *
 * This endpoint is protected to where you have to send the Authorization Bearer
 * token to it and that token has to be valid on the authorization server.  If the
 * user is authenticated the it will send a plain text message back.
 * @param   {Object}   req - The request, which nothing is done with
 * @param   {Object}   res - The response, which the protectedEndPoint is rendered
 * @returns {undefined}
 */
exports.protectedEndPoint = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    // You can send whatever you want, such as JSON, etc...
    // For a illustrative example, I'm just sending a string back
    res.send('Successful Protected EndPoint Data Call');
  },
];
