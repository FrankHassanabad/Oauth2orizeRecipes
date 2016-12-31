'use strict';

const chai             = require('chai');
const { accessTokens } = require('../../db');
const jwt              = require('jsonwebtoken');
const sinonChai        = require('sinon-chai');
const utils            = require('../../utils');

chai.use(sinonChai);
const expect = chai.expect;

describe('accesstokens', () => {
  beforeEach(() => accessTokens.removeAll());

  describe('#find', () => {
    it('should return empty access tokens with invalid token request', () =>
      accessTokens.find('abc')
      .then(token => expect(token).to.be.undefined));

    it('should return empty access tokens with null', () =>
      accessTokens.find(null)
      .then(token => expect(token).to.be.undefined));

    it('should return empty access tokens with undefined', () =>
      accessTokens.find(undefined)
      .then(token => expect(token).to.be.undefined));

    it('should find a token saved', () => {
      const token = utils.createToken();
      return accessTokens.save(token, new Date(0), '1', '1', '*')
      .then(() => accessTokens.find(token))
      .then(foundToken => expect(foundToken).to.eql({
        clientID       : '1',
        expirationDate : new Date(0),
        userID         : '1',
        scope          : '*',
      }));
    });
  });

  describe('#save', () => {
    it('should save an access token correctly and return that token', () => {
      const token = utils.createToken();
      return accessTokens.save(token, new Date(0), '1', '1', '*')
      .then(saved => expect(saved).to.eql({
        clientID       : '1',
        expirationDate : new Date(0),
        userID         : '1',
        scope          : '*',
      }))
      .then(() => accessTokens.find(token))
      .then(foundToken => expect(foundToken).to.eql({
        clientID       : '1',
        expirationDate : new Date(0),
        userID         : '1',
        scope          : '*',
      }));
    });
  });

  describe('#delete', () => {
    it('should return empty access tokens with invalid token request', () =>
      accessTokens.delete('abc')
      .then(token => expect(token).to.be.undefined));

    it('should return empty access tokens with null', () =>
      accessTokens.delete(null)
      .then(token => expect(token).to.be.undefined));

    it('should return empty access tokens with undefined', () =>
      accessTokens.delete(undefined)
      .then(token => expect(token).to.be.undefined));

    it('should delete an access token and return it', () => {
      const token = utils.createToken();
      return accessTokens.save(token, new Date(0), '1', '1', '*')
      .then(() => accessTokens.delete(token))
      .then(deletedToken => expect(deletedToken).to.eql({
        clientID       : '1',
        expirationDate : new Date(0),
        userID         : '1',
        scope          : '*',
      }))
      .then(() => accessTokens.find(token))
      .then(foundToken => expect(foundToken).to.eql(undefined));
    });
  });

  describe('#removeExpired', () => {
    it('should remove expired tokens', () => {
      const token1   = utils.createToken();
      const token2   = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return accessTokens.save(token1, new Date(0), '1', '1', '*')
      .then(() => accessTokens.save(token2, new Date(0), '2', '2', '*'))
      .then(() => accessTokens.removeExpired())
      .then((expiredTokens) => {
        expect(expiredTokens[tokenId1]).to.eql({
          clientID       : '1',
          expirationDate : new Date(0),
          userID         : '1',
          scope          : '*',
        });
        expect(expiredTokens[tokenId2]).to.eql({
          clientID       : '2',
          expirationDate : new Date(0),
          userID         : '2',
          scope          : '*',
        });
      })
      .then(() => accessTokens.find(token1))
      .then(foundToken => expect(foundToken).to.eql(undefined))
      .then(() => accessTokens.find(token2))
      .then(foundToken => expect(foundToken).to.eql(undefined));
    });
  });

  describe('#removeAll', () => {
    it('should remove all tokens', () => {
      const token1   = utils.createToken();
      const token2   = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return accessTokens.save(token1, new Date(0), '1', '1', '*')
      .then(() => accessTokens.save(token2, new Date(0), '2', '2', '*'))
      .then(() => accessTokens.removeAll())
      .then((expiredTokens) => {
        expect(expiredTokens[tokenId1]).to.eql({
          clientID       : '1',
          expirationDate : new Date(0),
          userID         : '1',
          scope          : '*',
        });
        expect(expiredTokens[tokenId2]).to.eql({
          clientID       : '2',
          expirationDate : new Date(0),
          userID         : '2',
          scope          : '*',
        });
      })
      .then(() => accessTokens.find(token1))
      .then(foundToken => expect(foundToken).to.eql(undefined))
      .then(() => accessTokens.find(token2))
      .then(foundToken => expect(foundToken).to.eql(undefined));
    });
  });
});
