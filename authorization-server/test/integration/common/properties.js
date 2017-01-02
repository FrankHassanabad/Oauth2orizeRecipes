'use strict';

/**
 * Properties and settings of the OAuth2 authorization server for defaults
 */
module.exports = {
  username      : 'bob',
  password      : 'secret',
  hostname      : 'https://localhost:3000',
  login         : 'https://localhost:3000/login',
  redirect      : 'https://localhost:3000',
  clientId      : 'trustedClient',
  clientSecret  : 'ssh-otherpassword',
  token         : 'https://localhost:3000/oauth/token',
  tokenInfo     : 'https://localhost:3000/api/tokeninfo',
  authorization : 'https://localhost:3000/dialog/authorize',
  userinfo      : 'https://localhost:3000/api/userinfo',
  revokeToken   : 'https://localhost:3000/api/revoke',
  clientinfo    : 'https://localhost:3000/api/clientinfo',
  logout        : 'https://localhost:3000/logout',
};
