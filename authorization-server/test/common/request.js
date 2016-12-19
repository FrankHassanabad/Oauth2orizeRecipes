'use strict';

const {
  authorization,
  clientId,
  clientinfo,
  clientSecret,
  login,
  password,
  redirect,
  username,
  userinfo,
  token,
} = require('./properties.js');

const requestLib = require('request').defaults({ jar: true, strictSSL: false }); // eslint-disable-line

/**
 * These are all request helpers to help with testing
 */
module.exports = {
  /**
   * Logins as the login dialog/form would
   * @param   {Function} next - Standard forward to the next function call
   * @returns {void}
   */
  login: (next) => {
    requestLib.post(
      login, {
        form : { username, password },
      },
      next);
  },

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}   code  - The Authorization code
   * @param   {Function} next  - Standard forward to the next function call
   * @returns {undefined}
   */
  postOAuthCode: (code, next) => {
    requestLib.post(
      token, {
        form : {
          code,
          redirect_uri  : redirect,
          client_id     : clientId,
          client_secret : clientSecret,
          grant_type    : 'authorization_code',
        },
      }, next);
  },

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}   scope - The optional scope to use
   * @param   {Function} next  - Standard forward to the next function call
   * @returns {undefined}
   */
  postOAuthPassword: (scope, next) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    requestLib.post(
      token, {
        form : {
          username,
          password,
          scope,
          grant_type: 'password',
        },
        headers : {
          Authorization : `Basic ${basicAuth}`,
        },
      }, next);
  },

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}   scope - The optionally scope to use
   * @param   {Function} next  - Standard forward to the next function call
   * @returns {undefined}
   */
  postOAuthClient: (scope, next) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    requestLib.post(
      token, {
        form : {
          username,
          password,
          scope,
          grant_type: 'client_credentials',
        },
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      }, next);
  },

  /**
   * Gets a new access token from the OAuth2 authorization server
   * @param   {String}   refreshToken - The refresh token to get the new access token from
   * @param   {Function} next         - Standard forward to the next function call
   * @returns {undefined}
   */
  postRefeshToken: (refreshToken, next) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    requestLib.post(
      token, {
        form : {
          refresh_token : refreshToken,
          grant_type    : 'refresh_token',
        },
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      }, next);
  },

  /**
   * Gets the authorization code from the OAuth2 authorization server
   * @param   {Object} options - Options which if not set will be defaults
   * like so
   * {
   *    authorization: 'https://localhost:3000/dialog/authorize'
   *    redirect: 'https://localhost:3000'
   *    responseType: 'code'
   *    scope: ''
   * }
   * @param   {Function} next - Standard forward to the next function call
   * @returns {undefined}
   */
  getAuthorization: (options = {}, next) => {
    const auth = (options.authorization) || authorization;
    const redirect_uri = (options.redirect) || redirect;    // eslint-disable-line camelcase
    const response_type = (options.responseType) || 'code'; // eslint-disable-line camelcase
    const client_id = (options.clientId) || clientId;       // eslint-disable-line camelcase
    const scope = (options.scope) || '';
    requestLib.get(`${auth}?redirect_uri=${redirect_uri}&response_type=${response_type}&client_id=${client_id}&scope=${scope}`, next); // eslint-disable-line camelcase
  },

  /**
   * Gets the user info from the OAuth2 authorization server
   * @param {String}     accessToken - The access token to get the user info from
   * @param {Function}   next        - Standard forward to the next function call
   * @returns {undefined}
   */
  getUserInfo: (accessToken, next) => {
    requestLib.get({
      url: userinfo,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }, next);
  },

  /**
   * Gets the client info from the OAuth2 authorization server
   * @param   {String}   accessToken   - The access token to get the client info from
   * @param   {Function} next Standard - forward to the next function call
   * @returns {undefined}
   */
  getClientInfo: (accessToken, next) => {
    requestLib.get({
      url: clientinfo,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }, next);
  },
};
