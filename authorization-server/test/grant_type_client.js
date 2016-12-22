'use strict';

const helper   = require('./common').request;
const validate = require('./common').validate;

/**
 * Tests for the Grant Type of Client.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Client', () => {
  it('should work with asking for an access token', (done) => {
    helper.postOAuthClient({}, (error, response, body) => {
      validate.validateAccessToken(response, body);
      const tokens = JSON.parse(body);
      // Get the user info
      helper.getClientInfo(tokens.access_token, (clientError, clientResponse, clientBody) => {
        validate.validateClientJson(clientResponse, clientBody);
        done();
      });
    });
  });

  it('should work with a scope of undefined', (done) => {
    // test it with no off line access
    helper.postOAuthClient(undefined, (error, response, body) => {
      validate.validateAccessToken(response, body);
      const tokens = JSON.parse(body);
      // Get the user info
      helper.getClientInfo(tokens.access_token, (clientError, clientResponse, clientBody) => {
        validate.validateClientJson(clientResponse, clientBody);
        done();
      });
    });
  });
});
