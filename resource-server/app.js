var express = require('express')
    , site = require('./site')
    , passport = require('passport')
    , fs = require('fs')
    , http = require('http')
    , https = require('https')
    , config = require('./config')
    , db = require('./db');

// Express configuration
var app = express();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'client keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
require('./auth');

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/info', site.info);
app.get('/api/protectedEndPoint', site.protectedEndPoint);

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

//This setting is so that our certificates will work although they are all self signed
//TODO Remove this if you are NOT using self signed certs
https.globalAgent.options.rejectUnauthorized = false;

// Create our HTTPS server listening on port 4000.
https.createServer(options, app).listen(4000);
console.log("Resource Server started on port 4000");

