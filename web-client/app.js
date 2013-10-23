//Create a proxy that combines the authorization server and
//resource server with this server so that we can make calls
//to both without cross domain issues

var httpProxy = require('http-proxy')
    , http = http = require('http')
    , connect = require('connect')
    , https = require('https')
    , fs = require('fs');

//TODO: Change these for your own certificates.  This was generated
//through the commands:
//openssl genrsa -out privatekey.pem 1024
//openssl req -new -key privatekey.pem -out certrequest.csr
//openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
var options = {
    https: {
        key: fs.readFileSync('certs/privatekey.pem'),
        cert: fs.readFileSync('certs/certificate.pem')
    }
};

/**
 * The HTTPS Authorization Server
 */
var authServer = new httpProxy.HttpProxy({
    target: {
        host: 'localhost',
        port: 3000,
        rejectUnauthorized: false,
        https: true
    }
});

/**
 * The HTTPS Resource Server
 */
var resourceServer = new httpProxy.HttpProxy({
    target: {
        host: 'localhost',
        port: 4000,
        rejectUnauthorized: false,
        https: true
    }
});

/**
 * The local HTTP Resource Server
 */
var localServer = new httpProxy.HttpProxy({
    target: {
        host: 'localhost',
        port: 6000,
        rejectUnauthorized: false
    }
});

/**
 * Proxy that listens on 5000, which proxies all the
 * Authorization requests to port 3000 and all
 * Resource Servers to 4000
 */
httpProxy.createServer(options, function (req, res) {
    if(startsWith(req.url, '/api/tokeninfo') || startsWith(req.url, '/oauth/token')) {
        authServer.proxyRequest(req, res);
    } else if(startsWith(req.url, '/login') || startsWith(req.url, '/info') || startsWith(req.url, '/api/protectedEndPoint')) {
        resourceServer.proxyRequest(req, res);
    } else {
        localServer.proxyRequest(req, res);
    }
}).listen(5000);

/**
 * Create a very simple static file server which listens
 * on port 6000, to server up our local static content
 */
connect.createServer(
    connect.static('views')
).listen(6000);

console.log("Web Client Server started on port 3000");

/**
 * Function which returns true if str1 starts with str2
 */
function startsWith(str1, str2) {
    return str1.indexOf(str2) == 0;
}
