'use strict';

const chai      = require('chai');
const helper    = require('./common').helper;
const request   = require('request').defaults({ jar: true, strictSSL: false }); // eslint-disable-line
const sinonChai = require('sinon-chai');
const validate  = require('./common').validate;

chai.use(sinonChai);
const expect = chai.expect;

/**
 * Tests for the token actions such as info and revoke.
 * This follows the testing guide roughly from
 * https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken
 * https://developers.google.com/identity/protocols/OAuth2WebServer
 */
describe('Token Endpoints', () => {
  describe('#info', () => {
    it('should get a valid token info from a regular token', () =>
      helper.login()
      .then(() => helper.getAuthorization({}))
      .then(([response]) => {
        expect(response.req.path.indexOf('/?code=')).eql(0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(([response, body]) => {
        validate.accessToken(response, body);
        return body;
      })
      .then(body => helper.getTokenInfo(JSON.parse(body).access_token))
      .then(([response, body]) => validate.tokenInfoJson(response, body)));

    it('should get an invalid info from a undefined token', () =>
      helper.getTokenInfo(undefined)
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));

    it('should get an invalid info from a null token', () =>
      helper.getTokenInfo(null)
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));

    it('should get an invalid info from a made up token', () =>
      helper.getTokenInfo('abcdefg')
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));
  });

  describe('#revoke', () => {
    it('should revoke a valid refresh token', () =>
      helper.login()
      .then(() => helper.getAuthorization({ scope: 'offline_access' }))
      .then(([response]) => {
        expect(response.req.path.indexOf('/?code=')).eql(0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(([response, body]) => {
        validate.accessRefreshToken(response, body);
        return JSON.parse(body);
      })
      .then(tokens => helper.getRevokeToken(tokens.refresh_token))
      .then(([response, body]) => validate.revokeTokenJson(response, body)));

    it('should revoke a valid refresh token and the refresh should not be capable of creating access tokens', () =>
      helper.login()
      .then(() => helper.getAuthorization({ scope: 'offline_access' }))
      .then(([response]) => {
        expect(response.req.path.indexOf('/?code=')).eql(0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(([response, body]) => {
        validate.accessRefreshToken(response, body);
        return JSON.parse(body);
      })
      .then(tokens =>
        helper.getRevokeToken(tokens.refresh_token)
        .then(() => helper.postRefeshToken(tokens.refresh_token)))
      .then(([response, body]) => validate.invalidRefreshToken(response, body)));

    it('should revoke a valid access token', () =>
      helper.login()
      .then(() => helper.getAuthorization({}))
      .then(([response]) => {
        expect(response.req.path.indexOf('/?code=')).eql(0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(([response, body]) => {
        validate.accessToken(response, body);
        return body;
      })
      .then(body => helper.getRevokeToken(JSON.parse(body).access_token))
      .then(([response, body]) => validate.revokeTokenJson(response, body)));

    it('should revoke a access token the access token should not work with token info', () =>
      helper.login()
      .then(() => helper.getAuthorization({}))
      .then(([response]) => {
        expect(response.req.path.indexOf('/?code=')).eql(0);
        const code = response.req.path.slice(7, response.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(([response, body]) => {
        validate.accessToken(response, body);
        return body;
      })
      .then(body =>
        helper.getRevokeToken(JSON.parse(body).access_token)
        .then(() => helper.getTokenInfo(JSON.parse(body).access_token)))
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));

    it('should get an invalid info from a undefined token', () =>
      helper.getRevokeToken(undefined)
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));

    it('should get an invalid info from a null token', () =>
      helper.getRevokeToken(null)
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));

    it('should get an invalid info from a made up token', () =>
      helper.getRevokeToken('abcdefg')
      .then(([response, body]) => validate.invalidTokenInfoJson(response, body)));
  });
});
