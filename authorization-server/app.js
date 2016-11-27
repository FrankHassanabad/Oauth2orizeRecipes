/*jslint node: true */
'use strict';

var config = require('./config');
var express = require('express');
var passport = require('passport');
var site = require('./site');
var oauth2 = require('./oauth2');
var user = require('./user');
var client = require('./client');
var token = require('./token');
var https = require('https');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var expressSession = require("express-session");
var path = require('path');
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });


//Pull in the mongo store if we're configured to use it
//else pull in MemoryStore for the session configuration
var sessionStorage;
if (config.session.type === 'MongoStore') {
  var MongoStore = require('connect-mongo')({session: expressSession});
  console.log('Using MongoDB for the Session');
  sessionStorage = new MongoStore({
    db: config.session.dbName
  });
} else if (config.session.type === 'MemoryStore') {
  var MemoryStore = expressSession.MemoryStore;
  console.log('Using MemoryStore for the Session');
  sessionStorage = new MemoryStore();
} else {
  //We have no idea here
  throw new Error("Within config/index.js the session.type is unknown: " + config.session.type);
}

//Pull in the mongo store if we're configured to use it
//else pull in MemoryStore for the database configuration
var db = require('./' + config.db.type);
if (config.db.type === 'mongodb') {
  console.log('Using MongoDB for the data store');
} else if (config.db.type === 'db') {
  console.log('Using MemoryStore for the data store');
} else {
  //We have no idea here
  throw new Error("Within config/index.js the db.type is unknown: " + config.db.type);
}

// Express configuration
var app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');






//app.use(express.csrf());
//app.use(function (req, res, next) {
//    res.locals.token = req.csrfToken();
//    next();
//});





//Session Configuration
app.use(expressSession({
  saveUninitialized: true,
  resave: true,
  secret: config.session.secret,
  store: sessionStorage,
  key: "authorization.sid",
  cookie: {maxAge: config.session.maxAge}
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

app.get('/', site.index);
app.get('/login', csrfProtection, site.loginForm);
app.post('/login', csrfProtection, site.login);
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

//static resources for stylesheets, images, javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Catch all for error messages.  Instead of a stack
// trace, this will log the json of the error message
// to the browser and pass along the status with it
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status);
    res.json(err);
  } else {
    next();
  }
});

//From time to time we need to clean up any expired tokens
//in the database
setInterval(function () {
  db.accessTokens.removeExpired(function (err) {
    if (err) {
      console.error("Error removing expired tokens");
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


