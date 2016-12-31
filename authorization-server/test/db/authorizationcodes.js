'use strict';

const chai                   = require('chai');
const { authorizationCodes } = require('../../db');
const jwt                    = require('jsonwebtoken');
const sinonChai              = require('sinon-chai');
const utils                  = require('../../utils');

chai.use(sinonChai);
const expect = chai.expect;

describe('authorizationCodes', () => {
  beforeEach(() => authorizationCodes.removeAll());

  describe('#find', () => {
    it('should return empty authorization tokens with invalid token request', () =>
      authorizationCodes.find('abc')
      .then(token => expect(token).to.be.undefined));

    it('should return empty authorization tokens with null', () =>
      authorizationCodes.find(null)
      .then(token => expect(token).to.be.undefined));

    it('should return empty authorization tokens with undefined', () =>
      authorizationCodes.find(undefined)
      .then(token => expect(token).to.be.undefined));

    it('should find a token saved', () => {
      const token = utils.createToken();
      return authorizationCodes.save(token, '1', 'http://google.com', '1', '*')
      .then(() => authorizationCodes.find(token))
      .then(foundToken => expect(foundToken).to.eql({
        clientID    : '1',
        redirectURI : 'http://google.com',
        userID      : '1',
        scope       : '*',
      }));
    });
  });

  describe('#save', () => {
    it('should save an authorization token correctly and return that token', () => {
      const token = utils.createToken();
      return authorizationCodes.save(token, '1', 'http://google.com', '1', '*')
      .then(saved => expect(saved).to.eql({
        clientID    : '1',
        redirectURI : 'http://google.com',
        userID      : '1',
        scope       : '*',
      }))
      .then(() => authorizationCodes.find(token))
      .then(foundToken => expect(foundToken).to.eql({
        clientID    : '1',
        redirectURI : 'http://google.com',
        userID      : '1',
        scope       : '*',
      }));
    });
  });

  describe('#delete', () => {
    it('should return empty authorization tokens with invalid token request', () =>
      authorizationCodes.delete('abc')
      .then(token => expect(token).to.be.undefined));

    it('should return empty authorization tokens with null', () =>
      authorizationCodes.delete(null)
      .then(token => expect(token).to.be.undefined));

    it('should return empty authorization tokens with undefined', () =>
      authorizationCodes.delete(undefined)
      .then(token => expect(token).to.be.undefined));

    it('should delete an authorization token and return it', () => {
      const token = utils.createToken();
      return authorizationCodes.save(token, '1', 'http://google.com', '1', '*')
      .then(() => authorizationCodes.delete(token))
      .then(deletedToken => expect(deletedToken).to.eql({
        clientID    : '1',
        redirectURI : 'http://google.com',
        userID      : '1',
        scope       : '*',
      }))
      .then(() => authorizationCodes.find(token))
      .then(foundToken => expect(foundToken).to.eql(undefined));
    });
  });

  describe('#removeAll', () => {
    it('should remove all tokens', () => {
      const token1   = utils.createToken();
      const token2   = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return authorizationCodes.save(token1, '1', 'http://google.com', '1', '*')
      .then(() => authorizationCodes.save(token2, '2', 'http://google.com', '2', '*'))
      .then(() => authorizationCodes.removeAll())
      .then((expiredTokens) => {
        expect(expiredTokens[tokenId1]).to.eql({
          clientID    : '1',
          redirectURI : 'http://google.com',
          userID      : '1',
          scope       : '*',
        });
        expect(expiredTokens[tokenId2]).to.eql({
          clientID    : '2',
          redirectURI : 'http://google.com',
          userID      : '2',
          scope       : '*',
        });
      })
      .then(() => authorizationCodes.find(token1))
      .then(foundToken => expect(foundToken).to.eql(undefined))
      .then(() => authorizationCodes.find(token2))
      .then(foundToken => expect(foundToken).to.eql(undefined));
    });
  });
});
