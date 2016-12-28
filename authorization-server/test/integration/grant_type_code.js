'use strict';

const assert     = require('assert');
const helper     = require('./common').helper;
const promisify  = require('es6-promisify');
const properties = require('./common').properties;
const request    = require('request').defaults({ jar: true, strictSSL: false }); // eslint-disable-line
const validate   = require('./common').validate;

const get = promisify(request.get, { multiArgs : true });

/**
 * Tests for the Grant Type of Authorization Code.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Authorization Code', () => {
  it('should redirect when trying to get authorization without logging in', () =>
    get(properties.logout)
    .then(() => helper.getAuthorization({}))
    .then(([response]) => assert.equal(response.req.path.indexOf('/?code='), -1)));

  it('should work with the authorization_code asking for a refresh token', () =>
    helper.login()
    .then(() => helper.getAuthorization({ scope: 'offline_access' }))
    .then(([response]) => {
      assert.equal(response.req.path.indexOf('/?code='), 0);
      const code = response.req.path.slice(7, response.req.path.length);
      validate.validateAuthorizationCode(code);
      return code;
    })
    .then(code => helper.postOAuthCode(code))
    .then(([response, body]) => {
      validate.validateAccessRefreshToken(response, body);
      return JSON.parse(body);
    })
    .then((tokens) => {
      const userInfo = helper.getUserInfo(tokens.access_token)
      .then(([response, body]) => validate.validateUserJson(response, body));

      const refreshToken = helper.postRefeshToken(tokens.refresh_token)
      .then(([response, body]) => {
        validate.validateAccessToken(response, body);
      });

      const refreshToken2 = helper.postRefeshToken(tokens.refresh_token)
      .then(([response, body]) => {
        validate.validateAccessToken(response, body);
      });
      return Promise.all([userInfo, refreshToken, refreshToken2]);
    }));

  it('should give invalid code error when posting code twice', () =>
    helper.login()
    .then(() => helper.getAuthorization({ scope: 'offline_access' }))
    .then(([response]) => {
      assert.equal(response.req.path.indexOf('/?code='), 0);
      const code = response.req.path.slice(7, response.req.path.length);
      validate.validateAuthorizationCode(code);
      return code;
    })
    .then(code =>
      Promise.all([helper.postOAuthCode(code), helper.postOAuthCode(code)]))
    .then(([[response1, body1], [response2, body2]]) => {
      validate.validateAccessRefreshToken(response1, body1);
      validate.validateInvalidCodeError(response2, body2);
    }));

  it('should work with the authorization_code not asking for a refresh token', () =>
    helper.login()
    .then(() => helper.getAuthorization({}))
    .then(([response]) => {
      assert.equal(response.req.path.indexOf('/?code='), 0);
      const code = response.req.path.slice(7, response.req.path.length);
      validate.validateAuthorizationCode(code);
      return code;
    })
    .then(code => helper.postOAuthCode(code))
    .then(([response, body]) => {
      validate.validateAccessToken(response, body);
      return body;
    })
    .then(body => helper.getUserInfo(JSON.parse(body).access_token))
    .then(([response, body]) => validate.validateUserJson(response, body)));

  it('should give an error with an invalid client id', () =>
    helper.login()
    .then(() => helper.getAuthorization({ clientId: 'someinvalidclientid' }))
    .then(([response]) => assert.equal(response.statusCode, 403)));

  it('should give an error with a missing client id', () =>
    helper.login()
    .then(() => get(`${properties.authorization}?redirect_uri=${properties.redirect}&response_type=code`))
    .then(([response]) => assert.equal(response.statusCode, 400)));

  it('should give an error with an invalid response type', () =>
    helper.login()
    .then(() => helper.getAuthorization({ responseType: 'invalid' }))
    .then(([response]) => assert.equal(response.statusCode, 501)));
});
