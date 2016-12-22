'use strict';

const assert                 = require('assert');
const { authorizationCodes } = require('../../db');

describe('authorizatoncodes', () => {
  it('should not find any empty authorizaton codes', () =>
    authorizationCodes.find('')
    .then(token => assert.equal(token, null)));

  it('should save an authorizaton code, then delete it correctly', () =>
    authorizationCodes.save(
      'someMadeUpAccessTokenLookAtMe', 'madeUpClient', 'http://madeup.com', 'madeupUser', 'madeUpScope')
    .then((token) => {
      assert.equal(token.clientID,    'madeUpClient');
      assert.equal(token.redirectURI, 'http://madeup.com');
      assert.equal(token.userID,      'madeupUser');
      assert.equal(token.scope,       'madeUpScope');
    })
    .then(() => authorizationCodes.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      assert.equal(token.clientID,    'madeUpClient');
      assert.equal(token.redirectURI, 'http://madeup.com');
      assert.equal(token.userID,      'madeupUser');
      assert.equal(token.scope,       'madeUpScope');
    })
    .then(() => authorizationCodes.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => authorizationCodes.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => assert.equal(token, null)));
});
