'use strict';

require('process').env.OAUTHRECIPES_SURPRESS_TRACE = true;

const chai      = require('chai');
const sinonChai = require('sinon-chai');
const validate  = require('../validate');

chai.use(sinonChai);
const expect = chai.expect;


describe('accesstokens', () => {
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

  describe.skip('#token', () => {
    // TODO
  });

  describe.skip('#refreshToken', () => {
    // TODO
  });

  describe.skip('#authCode', () => {
    // TODO
  });

  describe.skip('#isRefreshToken', () => {
    // TODO
  });

  describe.skip('#generateRefreshToken', () => {
    // TODO
  });

  describe.skip('#generateToken', () => {
    // TODO
  });

  describe.skip('#generateTokens', () => {
    // TODO
  });

  describe.skip('#tokenForHttp', () => {
    // TODO
  });

  describe.skip('#clientExistsForHttp', () => {
    // TODO
  });
});

