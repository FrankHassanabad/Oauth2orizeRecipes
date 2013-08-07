var passport = require('passport')
    , login = require('connect-ensure-login')
    , client = require('./config').client;


exports.index = function(req, res) {
    res.send('OAuth 2.0 Resource Server');
};

exports.loginForm = function(req, res) {
    res.render('login');
};

exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

/**
 * OAuth 2.0 Login
 * https://localhost:4000/login
 *
 * Although this uses login.ensureLoggedIn(), behind the scenes it's
 * using OAuth 2.0's Resource Owner Password Credentials to authenticate
 * the user.  On Authentication, a regular web session is created, and
 * a access_token and refresh_token are attached.
 *
 * See auth.js's LocalStrategy
 */
exports.info = [
    login.ensureLoggedIn(),
    function(req, res) {
        var accessToken = req.user.accessToken;
        var refreshToken = req.user.refreshToken;
        res.render('info', {
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }
];

/**
 * Example Protected EndPoint
 *
 * This endpoint is protected to where you have to send the Authorization Bearer
 * token to it and that token has to be valid on the authorization server
 */
exports.protectedEndPoint = [
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        //You can send whatever you want, such as JSON, etc...
        //For a illustrative example, I'm just sending a string back
        res.send('Successful Protected EndPoint Data Call');
    }
];
