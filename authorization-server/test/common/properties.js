/*jslint node: true */
/*global exports */
'use strict';

/**
 * Properties and settings of the OAuth2 authorization server
 */
exports.properties = {
  username: 'bob',
  password: 'secret',
  hostname: 'https://localhost:3000',
  login: 'https://localhost:3000/login',
  redirect: 'https://localhost:3000',
  clientId: 'trustedClient',
  clientSecret: 'ssh-otherpassword',
  token: 'https://localhost:3000/oauth/token',
  authorization: 'https://localhost:3000/dialog/authorize',
  userinfo: 'https://localhost:3000/api/userinfo',
  clientinfo: 'https://localhost:3000/api/clientinfo',
  logout: 'https://localhost:3000/logout'
};
