'use strict';

const chai        = require('chai');
const { clients } = require('../../db');
const sinonChai   = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

describe('clients', () => {
  it('should not find an invalid client', () =>
    clients.find('')
    .then(token => expect(token).to.be.undefined));

  it('should find a client by id 1', () =>
    clients.find('1')
    .then((client) => {
      expect(client).to.contain({
        id           : '1',
        name         : 'Samplr',
        clientId     : 'abc123',
        clientSecret : 'ssh-secret',
      });
    }));

  it('should find a client by clientId abc123', () =>
    clients.findByClientId('abc123')
    .then((client) => {
      expect(client).to.contain({
        id           : '1',
        name         : 'Samplr',
        clientId     : 'abc123',
        clientSecret : 'ssh-secret',
      });
    }));
});
