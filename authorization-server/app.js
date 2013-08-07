var express = require('express')
    , passport = require('passport')
    , site = require('./site')
    , oauth2 = require('./oauth2')
    , user = require('./user')
    , client = require('./client')
    , utils = require('./utils')
    , token = require('./token')
    , http = require('http')
    , https = require('https')
    , fs = require('fs')
    , config = require('./config')
    , db = require('./db');

// Express configuration
var app = express();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: utils.uid(256) }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
require('./auth');

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);
app.get('/api/clientinfo', client.info);

// Mimicking google's token info endpoint from
// https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken
app.get('/api/tokeninfo', token.info);

//From time to time we need to clean up any expired tokens
//in the database
setInterval(function () {
    console.log("Checking for expired tokens");
    db.accessTokens.removeExpired(function(err) {
        if(err) {
            console.log("Error removing expired tokens");
        }
    });
}, config.db.timeToCheckExpiredTokens * 1000);

//TODO: Change these for your own certificates.  This was generated
//through the commands:
//openssl genrsa -out privatekey.pem 1024
//openssl req -new -key privatekey.pem -out certrequest.csr
//openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
var options = {
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/certificate.pem')
};

// Create our HTTPS server listening on port 3000.
https.createServer(options, app).listen(3000);
console.log("OAuth 2.0 Authorization Server started on port 3000");


