'use strict';

// This is needed to start the server for the tests since these are more integration than unit tests
require('../app.js');

const helper   = require('./common').request;
const validate = require('./common').validate;

/**
 * Tests for the Grant Type of Password.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Password', () => {
  it('should work with asking for an access token and refresh token', (done) => {
    helper.postOAuthPassword('offline_access', (error, response, body) => {
      validate.validateAccessRefreshToken(response, body);
      const tokens = JSON.parse(body);
      // Get the user info
      helper.getUserInfo(tokens.access_token, (userError, userResponse, userBody) => {
        validate.validateUserJson(userResponse, userBody);
      });
      // Get another valid access token from the refresh token
      helper.postRefeshToken(tokens.refresh_token, (refreshError, refreshResponse, refreshBody) => {
        validate.validateAccessToken(refreshResponse, refreshBody);
      });
      // Get another valid access token from the refresh token
      helper.postRefeshToken(tokens.refresh_token, (postError, postResponse, postBody) => {
        validate.validateAccessToken(postResponse, postBody);
        done();
      });
    });
  });

  it('should work just an access token and a scope of undefined', (done) => {
    // test it with no off line access
    helper.postOAuthPassword(undefined, (error, response, body) => {
      validate.validateAccessToken(response, body);
      const tokens = JSON.parse(body);
      // Get the user info
      helper.getUserInfo(tokens.access_token, (userRrror, userResponse, userBody) => {
        validate.validateUserJson(userResponse, userBody);
        done();
      });
    });
  });
});
