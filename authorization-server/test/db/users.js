'use strict';

const assert    = require('assert');
const { users } = require('../../db');

describe('users', () => {
  it('should not find an invalid user', () =>
    users.find('')
    .then(user => assert.equal(user, null)));

  it('should find a user by id 1', () =>
    users.find('1')
    .then((user) => {
      assert.equal(user.id,       '1');
      assert.equal(user.username, 'bob');
      assert.equal(user.password, 'secret');
      assert.equal(user.name,     'Bob Smith');
    }));

  it('should find a user by username bob', () =>
    users.findByUsername('bob')
    .then((user) => {
      assert.equal(user.id,       '1');
      assert.equal(user.username, 'bob');
      assert.equal(user.password, 'secret');
      assert.equal(user.name,     'Bob Smith');
    }));
});
