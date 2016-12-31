'use strict';

const chai                   = require('chai');
const { authorizationCodes } = require('../../db');
const sinonChai              = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

describe('authorizatoncodes', () => {
  it('should not find any empty authorizaton codes', () =>
    authorizationCodes.find('')
    .then(token => expect(token).to.be.undefined));

  it('should save an authorizaton code, then delete it correctly', () =>
    authorizationCodes.save(
      'someMadeUpAccessTokenLookAtMe', 'madeUpClient', 'http://madeup.com', 'madeupUser', 'madeUpScope')
    .then((token) => {
      expect(token).to.contain({
        clientID    : 'madeUpClient',
        redirectURI : 'http://madeup.com',
        scope       : 'madeUpScope',
      });
    })
    .then(() => authorizationCodes.find('someMadeUpAccessTokenLookAtMe'))
    .then((token) => {
      expect(token).to.contain({
        clientID    : 'madeUpClient',
        redirectURI : 'http://madeup.com',
        scope       : 'madeUpScope',
      });
    })
    .then(() => authorizationCodes.delete('someMadeUpAccessTokenLookAtMe'))
    .then(() => authorizationCodes.find('someMadeUpAccessTokenLookAtMe'))
    .then(token => expect(token).to.be.undefined));
});
