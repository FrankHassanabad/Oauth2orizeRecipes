'use strict';

const assert      = require('assert');
const { clients } = require('../../db');

describe('clients', () => {
  it('should not find an invalid client', () =>
    clients.find('')
    .then(client => assert.equal(client, null)));

  it('should find a client by id 1', () =>
    clients.find('1')
    .then((client) => {
      assert.equal(client.id,           '1');
      assert.equal(client.name,         'Samplr');
      assert.equal(client.clientId,     'abc123');
      assert.equal(client.clientSecret, 'ssh-secret');
    }));

  it('should find a client by clientId abc123', () =>
    clients.findByClientId('abc123')
    .then((client) => {
      assert.equal(client.id,           '1');
      assert.equal(client.name,         'Samplr');
      assert.equal(client.clientId,     'abc123');
      assert.equal(client.clientSecret, 'ssh-secret');
    }));
});
