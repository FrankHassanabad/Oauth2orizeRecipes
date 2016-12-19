'use strict';

const assert   = require('assert');
const config   = require('../config');

const dbTokens = require(`../${config.db.type}`); // eslint-disable-line

describe('access token saving/deleting', () => {
  it('should not find any empty access tokens', (done) => {
    dbTokens.accessTokens.find('', (token) => {
      assert.equal(token, null);
      done();
    });
  });

  it('should save an access token, then delete it correctly', (done) => {
    dbTokens.accessTokens.save('someMadeUpAccessTokenLookAtMe',
      new Date(), 'madeUpUser', 'madeUpClient', 'madeUpScope', () => {
        dbTokens.accessTokens.find('someMadeUpAccessTokenLookAtMe', (err, token) => {
          assert.equal(token.userID,   'madeUpUser');
          assert.equal(token.clientID, 'madeUpClient');
          assert.equal(token.scope,    'madeUpScope');
          dbTokens.accessTokens.delete('someMadeUpAccessTokenLookAtMe', () => {
            dbTokens.accessTokens.find('someMadeUpAccessTokenLookAtMe', (accessErr, accessToken) => {
              assert.equal(accessToken, null);
              done();
            });
          });
        });
      });
  });
});
