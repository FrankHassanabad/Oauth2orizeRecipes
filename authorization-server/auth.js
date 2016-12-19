'use strict';

const config                               = require('./config');
const passport                             = require('passport');
const { Strategy: LocalStrategy }          = require('passport-local');
const { BasicStrategy }                    = require('passport-http');
const { Strategy: ClientPasswordStrategy } = require('passport-oauth2-client-password');
const { Strategy: BearerStrategy }         = require('passport-http-bearer');

const db                                   = require(`./${config.db.type}`); // eslint-disable-line

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy((username, password, done) => {
  db.users.findByUsername(username, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy((username, password, done) => {
  db.clients.findByClientId(username, (err, client) => {
    if (err) {
      return done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.clientSecret !== password) {
      return done(null, false);
    }
    return done(null, client);
  });
}));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy((clientId, clientSecret, done) => {
  db.clients.findByClientId(clientId, (err, client) => {
    if (err) {
      return done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
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
  db.accessTokens.find(accessToken, (err, token) => {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(null, false);
    }
    if (new Date() > token.expirationDate) {
      return db.accessTokens.delete(accessToken, delErr => done(delErr));
    }
    if (token.userID !== null) {
      return db.users.find(token.userID, (findErr, user) => {
        if (findErr) {
          return done(findErr);
        }
        if (!user) {
          return done(null, false);
        }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        return done(null, user, { scope: '*' });
      });
    }
    // The request came from a client only since userID is null
    // therefore the client is passed back instead of a user
    return db.clients.find(token.clientID, (findErr, client) => {
      if (findErr) {
        return done(findErr);
      }
      if (!client) {
        return done(null, false);
      }
      // to keep this example simple, restricted scopes are not implemented,
      // and this is just for illustrative purposes
      return done(null, client, { scope: '*' });
    });
  });
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
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users.find(id, (err, user) => {
    done(err, user);
  });
});
