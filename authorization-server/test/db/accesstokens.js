'use strict';

const chai             = require('chai');
const { accessTokens } = require('../../db');
const sinonChai        = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

describe('accesstokens', () => {
  it('should not find any empty access tokens', () =>
    accessTokens.find('')
    .then(token => expect(token).to.be.undefined));

  it('should save an access token, then delete it correctly', () =>
    accessTokens.save(
      'someMadeUpAccessTokenLookAtMe', new Date(), 'madeUpUser', 'madeUpClient', 'madeUpScope')
    .then((token) => {
      expect(token).to.contain({
        userID   : 'madeUpUser',
        clientID : 'madeUpClient',
        scope    : 'madeUpScope',
      });
    })
    .then(() => accessTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      expect(token).to.contain({
        userID   : 'madeUpUser',
        clientID : 'madeUpClient',
        scope    : 'madeUpScope',
      });
    })
    .then(() => accessTokens.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => accessTokens.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => expect(token).to.be.undefined));

  it('should remove all tokens', () =>
    accessTokens.save('123', new Date(), 'user', 'client', 'scope')
    .then(() => accessTokens.save('456', new Date(), 'user2', 'client2', 'scope2'))
    .then(() => accessTokens.removeAll())
    .then(() => accessTokens.find('123'))
    .then(token => expect(token).to.be.undefined)
    .then(() => accessTokens.find('456'))
    .then(token => expect(token).to.be.undefined));
});
