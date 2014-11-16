/*jslint node: true */
'use strict';

//Create a proxy that combines the authorization server and
//resource server with this server so that we can make calls
//to both without cross domain issues

var httpProxy = require('http-proxy');
var connect = require('connect');
var https = require('https');
var fs = require('fs');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

//TODO: Change these for your own certificates.  This was generated
//through the commands:
//openssl genrsa -out privatekey.pem 1024
//openssl req -new -key privatekey.pem -out certrequest.csr
//openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
var options = {
  //This is for the proxy
  ssl: {
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/certificate.pem')
  },
  //This is duplicated for the regular https server
  key: fs.readFileSync('certs/privatekey.pem'),
  cert: fs.readFileSync('certs/certificate.pem')
};

/**
 * The HTTPS Authorization Server
 */
var authServer = httpProxy.createProxyServer({
  target: 'https://localhost:3000',
  secure: false
});

/**
 * The HTTPS Resource Server
 */
var resourceServer = httpProxy.createProxyServer({
  target: 'https://localhost:4000',
  secure: false
});

/**
 * The local HTTP Resource Server
 */
var localServer = httpProxy.createProxyServer({
  target: 'https://localhost:6000',
  secure: false
});

/**
 * Proxy that listens on 5000, which proxies all the
 * Authorization requests to port 3000 and all
 * Resource Servers to 4000
 */
https.createServer(options, function (req, res) {
  if (startsWith(req.url, '/api/tokeninfo') || startsWith(req.url, '/oauth/token')) {
    authServer.web(req, res);
  } else if (startsWith(req.url, '/login') || startsWith(req.url, '/info') || startsWith(req.url, '/api/protectedEndPoint')) {
    resourceServer.web(req, res);
  } else {
    localServer.web(req, res);
  }
}).listen(5000);

/**
 * Create a very simple static file server which listens
 * on port 6000, to server up our local static content
 */
var serve = serveStatic('views', {'index': ['index.html', 'index.htm']});
// Create server
var server = https.createServer(options, function (req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(6000);

console.log("Web Client Server started on port 5000");

/**
 * Function which returns true if str1 starts with str2
 */
function startsWith(str1, str2) {
  return str1.indexOf(str2) === 0;
}
