'use strict';

// This is needed to start the server for the tests since these are more integration than unit tests
require('../../app.js');

const helper   = require('./common').helper;
const validate = require('./common').validate;

/**
 * Tests for the Grant Type of Password.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Password', () => {
  it('should work with asking for an access token and refresh token', () =>
    helper.postOAuthPassword('offline_access')
    .then(([response, body]) => {
      validate.accessRefreshToken(response, body);
      return JSON.parse(body);
    })
    .then((tokens) => {
      const userInfo = helper.getUserInfo(tokens.access_token)
      .then(([response, body]) => validate.userJson(response, body));

      const refreshToken = helper.postRefeshToken(tokens.refresh_token)
      .then(([response, body]) => validate.accessToken(response, body));

      const refreshToken2 = helper.postRefeshToken(tokens.refresh_token)
      .then(([response, body]) => validate.accessToken(response, body));

      return Promise.all([userInfo, refreshToken, refreshToken2]);
    }));

  it('should work just an access token and a scope of undefined', () =>
    helper.postOAuthPassword(undefined)
    .then(([response, body]) => {
      validate.accessToken(response, body);
      return JSON.parse(body);
    })
    .then(tokens => helper.getUserInfo(tokens.access_token))
    .then(([response, body]) => validate.userJson(response, body)));
});
