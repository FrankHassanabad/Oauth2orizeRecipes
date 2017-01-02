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
  revokeToken,
  token,
  tokenInfo,
} = require('./properties.js');
const promisify = require('es6-promisify');
const request   = require('request').defaults({ jar : true, strictSSL : false }); // eslint-disable-line

const get  = promisify(request.get, { multiArgs : true });
const post = promisify(request.post, { multiArgs : true });

/**
 * These are all request helpers to help with testing
 */
module.exports = {
  /**
   * Logins as the login dialog/form would
   * @returns {Promise} The login success
   */
  login : () => post(login, { form : { username, password } }),

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}  code  - The Authorization code
   * @returns {Promise} The auth code resolved
   */
  postOAuthCode : code =>
    post(token, {
      form : {
        code,
        redirect_uri  : redirect,
        client_id     : clientId,
        client_secret : clientSecret,
        grant_type    : 'authorization_code',
      },
    }),

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}  scope - The optional scope to use
   * @returns {Promise} OAuthPassword resolved
   */
  postOAuthPassword : (scope) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return post(token, {
      form : {
        username,
        password,
        scope,
        grant_type: 'password',
      },
      headers : {
        Authorization : `Basic ${basicAuth}`,
      },
    });
  },

  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}   scope - The optionally scope to use
   * @returns {Promise}  post resolved
   */
  postOAuthClient: (scope) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return post(token, {
      form : {
        username,
        password,
        scope,
        grant_type : 'client_credentials',
      },
      headers : {
        Authorization : `Basic ${basicAuth}`,
      },
    });
  },

  /**
   * Gets a new access token from the OAuth2 authorization server
   * @param   {String}  refreshToken - The refresh token to get the new access token from
   * @returns {Promise} refresh token resolved
   */
  postRefeshToken: (refreshToken) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return post(
      token, {
        form : {
          refresh_token : refreshToken,
          grant_type    : 'refresh_token',
        },
        headers : {
          Authorization: `Basic ${basicAuth}`,
        },
      });
  },

  /**
   * Gets the authorization code from the OAuth2 authorization server
   * @param {Object} options - Options which if not set will be defaults like so
   * {
   *    authorization: 'https://localhost:3000/dialog/authorize'
   *    redirect: 'https://localhost:3000'
   *    responseType: 'code'
   *    scope: ''
   * }
   * @returns {Promise} authorization resolved
   */
  getAuthorization: (options = {}) => {
    const auth          = (options.authorization) || authorization;
    const redirect_uri  = (options.redirect) || redirect;    // eslint-disable-line camelcase
    const response_type = (options.responseType) || 'code'; // eslint-disable-line camelcase
    const client_id     = (options.clientId) || clientId;       // eslint-disable-line camelcase
    const scope         = (options.scope) || '';
    return get(`${auth}?redirect_uri=${redirect_uri}&response_type=${response_type}&client_id=${client_id}&scope=${scope}`); // eslint-disable-line camelcase
  },

  /**
   * Gets the user info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the user info from
   * @returns {Promise} User Info resolved
   */
  getUserInfo : accessToken =>
    get({
      url     : userinfo,
      headers : {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  /**
   * Gets the client info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the client info from
   * @returns {Promise} Client Info resolved
   */
  getClientInfo : accessToken =>
    get({
      url     : clientinfo,
      headers : {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  /**
   * Gets the token info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the user info from
   * @returns {Promise} User Info resolved
   */
  getTokenInfo : accessToken =>
    get({
      url : `${tokenInfo}?access_token=${accessToken}`,
    }),

  /**
   * Revokes a token from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to revoke
   * @returns {Promise} User revocation resolved
   */
  getRevokeToken : accessToken =>
    get({
      url : `${revokeToken}?token=${accessToken}`,
    }),

};
