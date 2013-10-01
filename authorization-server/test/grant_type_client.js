var assert = require("assert")
    , app = require("../app.js")
    , request = require('request')
    , helper = require('./common').request
    , validate = require('./common').validate
    , properties = require('./common').properties
    , config = require('../config')
    , dbTokens = require('../' + config.db.type);


//Enable cookies so that we can perform logging in correctly to the OAuth server
//and turn off the strict SSL requirement
var request = request.defaults({jar: true, strictSSL: false});

/**
 * Tests for the Grant Type of Client.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Client', function () {
    //set the time out to be 20 seconds
    this.timeout(20000);
    it('should remove all tokens', function(done) {
        dbTokens.accessTokens.removeAll(function() {
            done();
        });
    });
    it('should work with asking for an access token', function (done) {
        helper.postOAuthClient({},
            function (error, response, body) {
                validate.validateAccessToken(response, body);
                var tokens = JSON.parse(body);
                //Get the user info
                helper.getClientInfo(tokens.access_token,
                    function (error, response, body) {
                        validate.validateClientJson(response, body);
                        done();
                    }
                );
            }
        );
    });
    it('should work with a scope of undefined', function (done) {
        //test it with no off line access
        helper.postOAuthClient(undefined,
            function (error, response, body) {
                validate.validateAccessToken(response, body);
                var tokens = JSON.parse(body);
                //Get the user info
                helper.getClientInfo(tokens.access_token,
                    function (error, response, body) {
                        validate.validateClientJson(response, body);
                        done();
                    }
                );
            }
        );
    });
    it('should remove all tokens', function(done) {
        dbTokens.accessTokens.removeAll(function() {
            done();
        });
    });
});
