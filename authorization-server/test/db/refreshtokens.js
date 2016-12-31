'use strict';

const chai              = require('chai');
const { refreshTokens } = require('../../db');
const sinonChai         = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

describe('refreshTokens', () => {
  it('should not find any empty refreshTokens tokens', () =>
    refreshTokens.find('')
    .then(token => expect(token).to.be.undefined));

  it('should save an refreshtokens token, then delete it correctly', () =>
    refreshTokens.save(
      'someMadeUpAccessTokenLookAtMe', 'madeUpUser', 'madeUpClient', 'madeUpScope')
    .then((token) => {
      expect(token).to.contain({
        userID   : 'madeUpUser',
        clientID : 'madeUpClient',
        scope    : 'madeUpScope',
      });
    })
    .then(() => refreshTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      expect(token).to.contain({
        userID   : 'madeUpUser',
        clientID : 'madeUpClient',
        scope    : 'madeUpScope',
      });
    })
    .then(() => refreshTokens.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => refreshTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => expect(token).to.be.undefined));
});
