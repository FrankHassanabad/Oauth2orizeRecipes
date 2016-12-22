'use strict';

const assert           = require('assert');
const { accessTokens } = require('../../db');

describe('accesstokens', () => {
  it('should not find any empty access tokens', () =>
    accessTokens.find('')
    .then(token => assert.equal(token, null)));

  it('should save an access token, then delete it correctly', () =>
    accessTokens.save(
      'someMadeUpAccessTokenLookAtMe', new Date(), 'madeUpUser', 'madeUpClient', 'madeUpScope')
    .then((token) => {
      assert.equal(token.userID,   'madeUpUser');
      assert.equal(token.clientID, 'madeUpClient');
      assert.equal(token.scope,    'madeUpScope');
    })
    .then(() => accessTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      assert.equal(token.userID,   'madeUpUser');
      assert.equal(token.clientID, 'madeUpClient');
      assert.equal(token.scope,    'madeUpScope');
    })
    .then(() => accessTokens.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => accessTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => assert.equal(token, null)));

  it('should remove all tokens', () =>
    accessTokens.save('123', new Date(), 'user', 'client', 'scope')
    .then(() => accessTokens.save('456', new Date(), 'user2', 'client2', 'scope2'))
    .then(() => accessTokens.removeAll())
    .then(() => accessTokens.find('123'))
    .then(token => assert.equal(token, null))
    .then(() => accessTokens.find('456'))
    .then(token => assert.equal(token, null)));
});
