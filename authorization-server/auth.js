/*jslint node: true */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var config = require('./config');
var db = require('./' + config.db.type);

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  function (username, password, done) {
    db.users.find(username, password, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

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
passport.use(new BasicStrategy(
  function (username, password, done) {
    db.clients.findByClientId(username, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret != password) {
        return done(null, false);
      }
      return done(null, client);
    });
  }
));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
    db.clients.findByClientId(clientId, function (err, client) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret != clientSecret) {
        return done(null, false);
      }
      return done(null, client);
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function (accessToken, done) {
    db.accessTokens.find(accessToken, function (err, token) {
      if (err) {
        return done(err);
      }
      if (!token) {
        return done(null, false);
      }
      if (new Date() > token.expirationDate) {
        db.accessTokens.delete(accessToken, function (err) {
          return done(err);
        });
      } else {
        if (token.userID !== null) {
          db.users.findById(token.userID, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            // to keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes
            var info = {scope: '*'};
            return done(null, user, info);
          });
        } else {
          //The request came from a client only since userID is null
          //therefore the client is passed back instead of a user
          db.clients.find(token.clientID, function (err, client) {
            if (err) {
              return done(err);
            }
            if (!client) {
              return done(null, false);
            }
            // to keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes
            var info = {scope: '*'};
            return done(null, client, info);
          });
        }
      }
    });
  }
));

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

passport.serializeUser(function (user, done) {
  done(null, user.UserId);
});

passport.deserializeUser(function (id, done) {
  db.users.findById(id, function (err, user) {
    done(err, user);
  });
});
