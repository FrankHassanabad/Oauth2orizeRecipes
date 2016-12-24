'use strict';

const assert     = require('assert');
const helper     = require('./common').request;
const properties = require('./common').properties;
const request    = require('request').defaults({ jar: true, strictSSL: false }); // eslint-disable-line
const utils      = require('../utils');
const validate   = require('./common').validate;

/**
 * Tests for the Grant Type of Implicit.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Implicit', () => {
  it('should redirect when trying to get authorization without logging in', (done) => {
    request.get(properties.logout, () => {
      helper.getAuthorization({ responseType: 'token' }, (error, response) => {
        assert.equal(-1, response.request.href.indexOf('/#access_token='));
        done();
      });
    });
  });

  it('should work with the implicit asking for a access token', (done) => {
    // Log into the OAuth2 server as bob
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({ responseType: 'token' }, (error, response) => {
        // Assert that we have the ?code in our URL
        const accessTokenIndex = response.request.href.indexOf('#access_token') + '#access_token='.length;
        const endTokenIndex    = response.request.href.indexOf('&expires_in');
        const accessToken      = response.request.href.slice(accessTokenIndex, endTokenIndex);
        utils.verifyToken(accessToken);

        const expiresInIndex = response.request.href.indexOf('&expires_in') + '&expires_in='.length;
        const expiresIn = response.request.href.slice(expiresInIndex, expiresInIndex + 4);
        assert.equal(expiresIn, 3600);

        const tokenTypeIndex = response.request.href.indexOf('&token_type') + '&token_type='.length;
        const tokenType = response.request.href.slice(tokenTypeIndex, tokenTypeIndex + 6);
        assert.equal(tokenType, 'Bearer');

        // Get the user info
        helper.getUserInfo(accessToken, (userError, userResponse, body) => {
          validate.validateUserJson(userResponse, body);
          done();
        });
      });
    });
  });

  it('should give an error with an invalid client id', (done) => {
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({ responseType: 'token', clientId: 'someinvalidclientid' }, (error, response) => {
        // assert that we are getting an error code of 400
        assert.equal(response.statusCode, 403);
        done();
      });
    });
  });

  it('should give an error with a missing client id', (done) => {
    helper.login(() => {
      // Get the OAuth2 authorization code
      request.get(`${properties.authorization}?redirect_uri=${properties.redirect}&response_type=token`, (error, response) => {
        // assert that we are getting an error code of 400
        assert.equal(response.statusCode, 400);
        done();
      });
    });
  });

  it('should give an error with an invalid response type', (done) => {
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({ responseType: 'invalid' }, (error, response) => {
        // assert that we are getting an error code of 400
        assert.equal(response.statusCode, 501);
        done();
      });
    });
  });
});
