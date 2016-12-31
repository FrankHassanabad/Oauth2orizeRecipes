'use strict';

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const config         = require('./config');
const db             = require('./db');
const express        = require('express');
const expressSession = require('express-session');
const fs             = require('fs');
const https          = require('https');
const passport       = require('passport');
const path           = require('path');
const site           = require('./site');
const sso            = require('./sso');

// Express configuration
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());

// Session Configuration
app.use(expressSession({
  saveUninitialized : true,
  resave            : true,
  secret            : config.session.secret,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Catch all for error messages.  Instead of a stack
// trace, this will log the json of the error message
// to the browser and pass along the status with it
app.use((err, req, res, next) => {
  if (err) {
    if (err.status == null) {
      console.error('Internal unexpected error from:', err.stack);
      res.status(500);
      res.json(err);
    } else {
      res.status(err.status);
      res.json(err);
    }
  } else {
    next();
  }
});

// Passport configuration
require('./auth');

app.get('/',                      site.index);
app.get('/login',                 site.loginForm);
app.post('/login',                site.login);
app.get('/info',                  site.info);
app.get('/infosso',               site.infosso);
app.get('/api/protectedEndPoint', site.protectedEndPoint);
app.get('/receivetoken',          sso.receivetoken);

// static resources for stylesheets, images, javascript files
app.use(express.static(path.join(__dirname, 'public')));

// From time to time we need to clean up any expired tokens
// in the database
setInterval(() => {
  db.accessTokens.removeExpired()
  .catch(err => console.error('Error trying to remove expired tokens:', err.stack));
}, config.db.timeToCheckExpiredTokens * 1000);

// TODO: Change these for your own certificates.  This was generated
// through the commands:
// openssl genrsa -out privatekey.pem 2048
// openssl req -new -key privatekey.pem -out certrequest.csr
// openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
const options = {
  key  : fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem')),
  cert : fs.readFileSync(path.join(__dirname, 'certs/certificate.pem')),
};

// This setting is so that our certificates will work although they are all self signed
// TODO: Remove this if you are NOT using self signed certs
https.globalAgent.options.rejectUnauthorized = false;

// Create our HTTPS server listening on port 4000.
https.createServer(options, app).listen(4000);
console.log('Resource Server started on port 4000');

