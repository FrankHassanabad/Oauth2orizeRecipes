'use strict';

const chai      = require('chai');
const config    = require('../../config');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

describe('config', () => {
  beforeEach(() => {
    sinon.useFakeTimers();
  });

  it('should calculate expiration date correctly', () => {
    expect(config.token.calculateExpirationDate().valueOf()).to.eql(3600000);
  });

  it('should have expiresIn as a number', () => {
    expect(config.token.expiresIn).to.be.a('number');
  });

  it('should have authorizationCodeLength as a number', () => {
    expect(config.token.authorizationCodeLength).to.be.a('number');
  });

  it('should have accessTokenLength as a number', () => {
    expect(config.token.accessTokenLength).to.be.a('number');
  });

  it('should have db timeToCheckExpiredTokens as a number', () => {
    expect(config.db.timeToCheckExpiredTokens).to.be.a('number');
  });

  it('should have session maxAge as a number', () => {
    expect(config.session.maxAge).to.be.a('number');
  });

  it('should have session secret as a string', () => {
    expect(config.session.secret).to.be.a('string');
  });
});
