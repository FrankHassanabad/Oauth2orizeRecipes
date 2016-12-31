'use strict';

const BearerStrategy = require('passport-http-bearer').Strategy;
const config         = require('./config');
const db             = require('./db');
const LocalStrategy  = require('passport-local').Strategy;
const passport       = require('passport');
const request        = require('request');

/* eslint-disable camelcase */

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.  The login
 * mechanism is going to use our server's client id/secret to authenticate/authorize
 * the user and get both an access and refresh token.  The sever *does not* store the
 * user's name and the server *does not* store the user's password.  Instead, using
 * the access token the server can reach endpoints that the user has been granted
 * access to.
 *
 * A cookie/session which *does not* have the access token is pushed through passport
 * onto the local user's system.  That web cookie/session enables us to not have to
 * repeatedly call the authentication/authorization sever continuously for simple static
 * HTML page loading.  However, end points that are protected still will need the access
 * token passed to them through the Authorization Bearer usage.
 */
passport.use(new LocalStrategy((username, password, done) => {
  const basicAuth = new Buffer(`${config.client.clientID}:${config.client.clientSecret}`).toString('base64');
  request.post('https://localhost:3000/oauth/token', {
    form : {
      username,
      password,
      grant_type : 'password',
      scope      : 'offline_access',
    },
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
  }, (error, response, body) => {
    const { access_token, refresh_token, expires_in } = JSON.parse(body);
    if (response.statusCode === 200 && access_token) {
      // TODO: scopes
      const expirationDate = expires_in ? new Date(Date.now() + (expires_in * 1000)) : null;
      db.accessTokens.save(access_token, expirationDate, config.client.clientID)
      .then(() => {
        if (refresh_token != null) {
          return db.refreshTokens.save(refresh_token, config.client.clientID);
        }
        return Promise.resolve();
      })
      .then(done(null, { accessToken: access_token, refreshToken: refresh_token }))
      .catch(() => done(null, false));
    }
  });
}));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy((accessToken, done) => {
  db.accessTokens.find(accessToken)
  .then((token) => {
    if (token != null && new Date() > token.expirationDate) {
      db.accessTokens.delete(accessToken)
      .then(() => null);
    }
    return token;
  })
  .then((token) => {
    if (token == null) {
      const tokeninfoURL = config.authorization.tokeninfoURL;
      request.get(tokeninfoURL + accessToken, (error, response, body) => {
        if (error != null || response.statusCode !== 200) {
          throw new Error('Token request not valid');
        }
        const { expires_in } = JSON.parse(body);
        const expirationDate = expires_in ? new Date(Date.now() + (expires_in * 1000)) : null;
        // TODO: scopes
        return db.accessTokens.save(accessToken, expirationDate, config.client.clientID);
      });
    }
    return token;
  })
  .then(() => done(null, accessToken))
  .catch(() => done(null, false));
}));

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

