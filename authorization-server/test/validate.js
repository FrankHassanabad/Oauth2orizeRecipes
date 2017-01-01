'use strict';

require('process').env.OAUTHRECIPES_SURPRESS_TRACE = true;

const chai      = require('chai');
const sinonChai = require('sinon-chai');
const utils     = require('../utils');
const validate  = require('../validate');

chai.use(sinonChai);
const expect = chai.expect;

describe('validate', () => {
  describe('#logAndThrow', () => {
    it('should throw a given mesage', () => {
      expect(() => validate.logAndThrow('some message')).to.throw('some message');
    });
  });

  describe('#user', () => {
    it('show throw if user is undefined', () => {
      expect(() => validate.user(undefined, 'pass')).to.throw('User does not exist');
    });

    it('show throw if user is null', () => {
      expect(() => validate.user(null, 'pass')).to.throw('User does not exist');
    });

    it('show throw if password does not match', () => {
      expect(() =>
        validate.user({ password : 'password' }, 'otherpassword'))
        .to.throw('User password does not match');
    });

    it('show return user if password matches', () => {
      expect(validate.user({ password: 'password' }, 'password'))
        .to.eql({ password : 'password' });
    });

    it('show return user if password matches with data', () => {
      expect(validate.user({ user: 'yo', password: 'password' }, 'password'))
        .to.eql({ user : 'yo', password : 'password' });
    });
  });

  describe('#userExists', () => {
    it('show throw if user is undefined', () => {
      expect(() => validate.userExists(undefined)).to.throw('User does not exist');
    });

    it('show throw if user is null', () => {
      expect(() => validate.userExists(null)).to.throw('User does not exist');
    });

    it('show return user if it exists', () => {
      expect(validate.userExists({ password : 'password' }))
        .to.eql({ password : 'password' });
    });
  });

  describe('#client', () => {
    it('show throw if client is undefined', () => {
      expect(() => validate.client(undefined, 'pass')).to.throw('Client does not exist');
    });

    it('show throw if client is null', () => {
      expect(() => validate.client(null, 'pass')).to.throw('Client does not exist');
    });

    it('show throw if client secret does not match', () => {
      expect(() =>
        validate.client({ clientSecret : 'password' }, 'otherpassword'))
        .to.throw('Client secret does not match');
    });

    it('show return client if client secret matches', () => {
      expect(validate.client({ clientSecret : 'password' }, 'password'))
        .to.eql({ clientSecret : 'password' });
    });

    it('show return client if password matches with data', () => {
      expect(validate.client({ client: 'yo', clientSecret: 'password' }, 'password'))
        .to.eql({ client : 'yo', clientSecret : 'password' });
    });
  });

  describe('#clientExists', () => {
    it('show throw if client is undefined', () => {
      expect(() => validate.clientExists(undefined)).to.throw('Client does not exist');
    });

    it('show throw if client is null', () => {
      expect(() => validate.clientExists(null)).to.throw('Client does not exist');
    });

    it('show return user if it exists', () => {
      expect(validate.clientExists({ clientSecret : 'password' }))
        .to.eql({ clientSecret : 'password' });
    });
  });

  describe('#token', () => {
    it('should throw with undefined code', () => {
      expect(() =>
        validate.token({ userID : '1' }, undefined))
          .to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with null code', () => {
      expect(() =>
        validate.token({ userID : '1' }, null))
          .to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with invalid userID', () => {
      const token = utils.createToken();
      return validate.token({ userID : '-1' }, token)
      .catch(err => expect(err.message).to.eql('User does not exist'));
    });

    it('should throw with invalid clientID', () => {
      const token = utils.createToken();
      return validate.token({ clientID: '-1' }, token)
      .catch(err => expect(err.message).to.eql('Client does not exist'));
    });

    it('should throw with invalid userID and invalid clientID', () => {
      const token = utils.createToken();
      return validate.token({ userID : '-1', clientID: '-1' }, token)
      .catch(err => expect(err.message).to.eql('User does not exist'));
    });

    it('should return user with valid user', () => {
      const token = utils.createToken();
      const user  = { userID   : '1' };
      return validate.token(user, token)
      .then(returnedUser => expect(returnedUser.id).eql(user.userID));
    });

    it('should return client with valid client', () => {
      const token = utils.createToken();
      const client  = { clientID   : '1' };
      return validate.token(client, token)
      .then(returnedClient => expect(returnedClient.id).eql(client.clientID));
    });
  });

  describe('#refreshToken', () => {
    it('should throw with undefined code', () => {
      expect(() =>
        validate.refreshToken({
          clientID : '1',
        }, undefined, {
          id : '1',
        })).to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with null code', () => {
      expect(() =>
        validate.refreshToken({
          clientID : '1',
        }, null, {
          id : '1',
        })).to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with invalid client ID', () => {
      const token = utils.createToken();
      expect(() =>
        validate.refreshToken({
          clientID : '1',
        }, token, {
          id : '2',
        })).to.throw('RefreshToken clientID does not match client id given');
    });

    it('should return refreshToken with everything valid', () => {
      const token = utils.createToken();
      expect(validate.refreshToken({ clientID: '1' }, token, { id : '1' })).to.eql(token);
    });
  });

  describe('#authCode', () => {
    it('should throw with undefined code', () => {
      expect(() =>
        validate.authCode(undefined, {
          clientID    : '1',
          redirectURI : 'a',
        }, {
          id : '1',
        }, 'a')).to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with null code', () => {
      expect(() =>
        validate.authCode(null, {
          clientID    : '1',
          redirectURI : 'a',
        }, {
          id : '1',
        }, 'a')).to.throw('JsonWebTokenError: jwt must be provided');
    });

    it('should throw with invalid client ID', () => {
      const token = utils.createToken();
      expect(() =>
        validate.authCode(token, {
          clientID    : '1',
          redirectURI : 'a',
        }, {
          id : '2',
        }, 'a')).to.throw('AuthCode clientID does not match client id given');
    });

    it('should throw with invalid redirectURI', () => {
      const token = utils.createToken();
      expect(() =>
        validate.authCode(token, {
          clientID    : '1',
          redirectURI : 'a',
        }, {
          id : '1',
        }, 'b')).to.throw('AuthCode redirectURI does not match redirectURI given');
    });

    it('should return authCode with everything valid', () => {
      const token    = utils.createToken();
      const authCode = { clientID: '1', redirectURI : 'a' };
      expect(validate.authCode(token, authCode, { id : '1' }, 'a')).to.eql(authCode);
    });
  });

  describe('#isRefreshToken', () => {
    it('show return true for scope having offline_access', () => {
      expect(validate.isRefreshToken({ scope : 'offline_access' })).to.eql(true);
    });

    it('show return false for scope of other value', () => {
      expect(validate.isRefreshToken({ scope : '*' })).to.eql(false);
    });

    it('show return false for non existent scope', () => {
      expect(validate.isRefreshToken({ })).to.eql(false);
    });
  });

  describe('#generateRefreshToken', () => {
    it('should generate and return a refresh token', () =>
      validate.generateRefreshToken({ userID: '1', clientID: '1', scope: '*' })
      .then(token => utils.verifyToken(token)));
  });

  describe('#generateToken', () => {
    it('should generate and return a token', () =>
      validate.generateToken({ userID: '1', clientID: '1', scope: '*' })
      .then(token => utils.verifyToken(token)));
  });

  describe('#generateTokens', () => {
    it('should generate and return an access and refresh token', () =>
      validate.generateTokens({ userID : '1', clientID : '1', scope : 'offline_access' })
      .then(([accessToken, refreshToken]) => {
        utils.verifyToken(accessToken);
        utils.verifyToken(refreshToken);
      }));

    it('should generate and return an access with no refresh token when scope is defined as all', () =>
      validate.generateTokens({ userID : '1', clientID : '1', scope : '*' })
      .then(([accessToken, refreshToken]) => {
        utils.verifyToken(accessToken);
        expect(refreshToken).to.be.eql(undefined);
      }));
  });

  describe('#tokenForHttp', () => {
    it('should return 400 status', () =>
      validate.tokenForHttp().catch(err => expect(err.status).to.eql(400)));

    it('should reject undefined token', () =>
      validate.tokenForHttp().catch(err => expect(err.message).to.eql('invalid_token')));

    it('should reject null token', () =>
      validate.tokenForHttp(null).catch(err => expect(err.message).to.eql('invalid_token')));

    it('should reject invalid token', () =>
      validate.tokenForHttp('abc').catch(err => expect(err.message).to.eql('invalid_token')));

    it('should work with a valid token', () => {
      const token = utils.createToken();
      return validate.tokenForHttp(token)
      .then(returnedToken => expect(returnedToken).to.eql(token));
    });
  });

  describe('#clientExistsForHttp', () => {
    it('should return 400 status', () => {
      try {
        validate.clientExistsForHttp();
      } catch (err) {
        expect(err.status).to.eql(400);
      }
    });

    it('should reject undefined client', () => {
      expect(() => validate.clientExistsForHttp()).to.throw('invalid_token');
    });

    it('should reject null client`', () => {
      expect(() => validate.clientExistsForHttp(null)).to.throw('invalid_token');
    });

    it('should return a non null client', () => {
      const client = validate.clientExistsForHttp({ client: 123 });
      expect(client).eql({ client: 123 });
    });
  });
});

