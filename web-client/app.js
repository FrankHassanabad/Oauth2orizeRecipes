'use strict';

// Create a proxy that combines the authorization server and
// resource server with this server so that we can make calls
// to both without cross domain issues

const finalhandler = require('finalhandler');
const fs           = require('fs');
const httpProxy    = require('http-proxy');
const https        = require('https');
const path         = require('path');
const serveStatic  = require('serve-static');

// TODO: Change these for your own certificates.  This was generated
// through the commands:
// openssl genrsa -out privatekey.pem 2048
// openssl req -new -key privatekey.pem -out certrequest.csr
// openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
const options = {
  // This is for the proxy
  ssl : {
    key  : fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem')),
    cert : fs.readFileSync(path.join(__dirname, 'certs/certificate.pem')),
  },
  // This is duplicated for the regular https server
  key  : fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem')),
  cert : fs.readFileSync(path.join(__dirname, 'certs/certificate.pem')),
};

/**
 * The HTTPS Authorization Server
 */
const authServer = httpProxy.createProxyServer({
  target : 'https://localhost:3000',
  secure : false,
});

/**
 * The HTTPS Resource Server
 */
const resourceServer = httpProxy.createProxyServer({
  target : 'https://localhost:4000',
  secure : false,
});

/**
 * The local HTTP Resource Server
 */
const localServer = httpProxy.createProxyServer({
  target : 'https://localhost:6000',
  secure : false,
});

/**
 * Proxy that listens on 5000, which proxies all the
 * Authorization requests to port 3000 and all
 * Resource Servers to 4000
 */
https.createServer(options, (req, res) => {
  if (req.url.startsWith('/api/tokeninfo') || req.url.startsWith('/oauth/token')) {
    authServer.web(req, res);
  } else if (req.url.startsWith('/login') || req.url.startsWith('/info') || req.url.startsWith('/api/protectedEndPoint')) {
    resourceServer.web(req, res);
  } else {
    localServer.web(req, res);
  }
}).listen(5000);

/**
 * Create a very simple static file server which listens
 * on port 6000, to serve up our local static content
 */
const serve = serveStatic('views', { index: ['index.html', 'index.htm'] });
// Create server
const server = https.createServer(options, (req, res) => {
  const done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(6000);

console.log('Web Client Server started on port 5000');
