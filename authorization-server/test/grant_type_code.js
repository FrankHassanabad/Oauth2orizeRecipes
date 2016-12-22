'use strict';

const assert     = require('assert');
const helper     = require('./common').request;
const properties = require('./common').properties;
const request    = require('request').defaults({ jar: true, strictSSL: false }); // eslint-disable-line
const validate   = require('./common').validate;

/**
 * Tests for the Grant Type of Authorization Code.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Authorization Code', () => {
  it('should redirect when trying to get authorization without logging in', (done) => {
    request.get(properties.logout, () => {
      helper.getAuthorization({}, (error, response) => {
        assert.equal(response.req.path.indexOf('/?code='), -1);
        done();
      });
    });
  });

  it('should work with the authorization_code asking for a refresh token', (done) => {
    // Log into the OAuth2 server as bob
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({ scope: 'offline_access' }, (error, response) => {
        // Assert that we have the ?code in our URL
        assert.equal(response.req.path.indexOf('/?code='), 0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.validateAuthorizationCode(code);
        // Get the token
        helper.postOAuthCode(code, (postError, postResponse, body) => {
          validate.validateAccessRefreshToken(postResponse, body);
          const tokens = JSON.parse(body);
          // Get the user info
          helper.getUserInfo(tokens.access_token, (userError, userResponse, userBody) => {
            validate.validateUserJson(userResponse, userBody);
          });
          // Get another valid access token from the refresh token
          helper.postRefeshToken(tokens.refresh_token, (rErr, refreshResponse, refreshBody) => {
            validate.validateAccessToken(refreshResponse, refreshBody);
          });
          // Get another valid access token from the refresh token
          helper.postRefeshToken(tokens.refresh_token, (rErr, refreshResponse2, refreshBody2) => {
            validate.validateAccessToken(refreshResponse2, refreshBody2);
          });
          // Try to get the token again but we shouldn't be able to reuse the same code
          helper.postOAuthCode(code, (cErr, codeResponse, codeBody) => {
            validate.validateInvalidCodeError(codeResponse, codeBody);
            done();
          });
        });
      });
    });
  });

  it('should work with the authorization_code not asking for a refresh token', (done) => {
    // Log into the OAuth2 server as bob
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({}, (error, response) => {
        // Assert that we have the ?code in our URL
        assert.equal(response.req.path.indexOf('/?code='), 0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.validateAuthorizationCode(code);
        // Get the token
        helper.postOAuthCode(code, (codeError, codeResponse, codeBody) => {
          validate.validateAccessToken(codeResponse, codeBody);
          // Get the user info
          helper.getUserInfo(JSON.parse(codeBody).access_token, (uErr, uRes, uBody) => {
            validate.validateUserJson(uRes, uBody);
            done();
          });
        });
      });
    });
  });

  it('should give an error with an invalid client id', (done) => {
    helper.login(() => {
      // Get the OAuth2 authorization code
      helper.getAuthorization({ clientId: 'someinvalidclientid' }, (error, response) => {
        // assert that we are getting an error code of 400
        assert.equal(response.statusCode, 403);
        done();
      });
    });
  });

  it('should give an error with a missing client id', (done) => {
    helper.login(() => {
      // Get the OAuth2 authorization code
      request.get(`${properties.authorization}?redirect_uri=${properties.redirect}&response_type=code`, (error, response) => {
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
