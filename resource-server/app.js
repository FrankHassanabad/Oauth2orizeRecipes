'use strict';

var express = require('express')
  , site = require('./site')
  , passport = require('passport')
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  , config = require('./config')
  , path = require('path')
  , db = require('./db')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , expressSession = require("express-session")
  , sso = require('./sso');

// Express configuration
var app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(expressSession({
  saveUninitialized: true,
  resave: true,
  secret: config.session.secret
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

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

// Passport configuration
require('./auth');

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/info', site.info);
app.get('/infosso', site.infosso);
app.get('/api/protectedEndPoint', site.protectedEndPoint);
app.get('/receivetoken', sso.receivetoken);

//static resources for stylesheets, images, javascript files
app.use(express.static(path.join(__dirname, 'public')));

//From time to time we need to clean up any expired tokens
//in the database
setInterval(function () {
  console.log("Checking for expired tokens");
  db.accessTokens.removeExpired(function (err) {
    if (err) {
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

//This setting is so that our certificates will work although they are all self signed
//TODO Remove this if you are NOT using self signed certs
https.globalAgent.options.rejectUnauthorized = false;

// Create our HTTPS server listening on port 4000.
https.createServer(options, app).listen(4000);
console.log("Resource Server started on port 4000");

