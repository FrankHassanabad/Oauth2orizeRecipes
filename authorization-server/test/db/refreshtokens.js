'use strict';

const assert            = require('assert');
const { refreshTokens } = require('../../db');

describe('refreshTokens', () => {
  it('should not find any empty refreshTokens tokens', () =>
    refreshTokens.find('')
    .then(token => assert.equal(token, null)));

  it('should save an refreshtokens token, then delete it correctly', () =>
    refreshTokens.save(
      'someMadeUpAccessTokenLookAtMe', 'madeUpUser', 'madeUpClient', 'madeUpScope')
    .then((token) => {
      assert.equal(token.userID,   'madeUpUser');
      assert.equal(token.clientID, 'madeUpClient');
      assert.equal(token.scope,    'madeUpScope');
    })
    .then(() => refreshTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      assert.equal(token.userID,   'madeUpUser');
      assert.equal(token.clientID, 'madeUpClient');
      assert.equal(token.scope,    'madeUpScope');
    })
    .then(() => refreshTokens.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => refreshTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => assert.equal(token, null)));
});
