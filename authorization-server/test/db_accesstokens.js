var assert = require("assert");
var config = require('../config');
var dbTokens = require('../' + config.db.type);

describe('access token saving/deleting', function () {

    it('should remove all tokens', function(done) {
        dbTokens.accessTokens.removeAll(function() {
            done();
        });
    });

    it('should not find any empty access tokens', function (done) {
        dbTokens.accessTokens.find('', function(token) {
            assert.equal(token, null);
        });
        done();
    });

    it('should save an access token, then delete it correctly', function (done) {
        dbTokens.accessTokens.save('someMadeUpAccessTokenLookAtMe',
            new Date(),
            "madeUpUser",
            "madeUpClient",
            "madeUpScope"
            , function (err) {
                dbTokens.accessTokens.find('someMadeUpAccessTokenLookAtMe', function (err, token) {
                    assert.equal(token.userID, 'madeUpUser');
                    assert.equal(token.clientID, 'madeUpClient');
                    assert.equal(token.scope, 'madeUpScope');
                    dbTokens.accessTokens.delete('someMadeUpAccessTokenLookAtMe', function (err) {
                        dbTokens.accessTokens.find('someMadeUpAccessTokenLookAtMe', function (err, token) {
                            assert.equal(token, null);
                            done();
                        });
                    });
                });
            }
        );
    });

    it('should remove all tokens', function(done) {
        dbTokens.accessTokens.removeAll(function() {
            done();
        });
    });
});
