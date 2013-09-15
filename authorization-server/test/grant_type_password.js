var assert = require("assert")
    , app = require("../app.js")
    , request = require('request')
    , helper = require('./common').request
    , validate = require('./common').validate
    , properties = require('./common').properties


//Enable cookies so that we can perform logging in correctly to the OAuth server
//and turn off the strict SSL requirement
var request = request.defaults({jar: true, strictSSL: false});

/**
 * Tests for the Grant Type of Password.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Password', function () {
    //set the time out to be 20 seconds
    this.timeout(20000);
    describe('', function () {
        it('should work with the implicit asking for a access token', function (done) {
            helper.postOAuthPassword('offline_access',
                function (error, response, body) {
                    validate.validateAccessRefreshToken(response.headers, body);
                    var tokens = JSON.parse(body);
                    //Get the user info
                    helper.getUserInfo(tokens.access_token,
                        function (error, response, body) {
                            validate.validateUserJson(response.headers, body);
                        }
                    );
                    //Get another valid access token from the refresh token
                    helper.postRefeshToken(tokens.refresh_token, function (error, response, body) {
                        validate.validateAccessToken(response.headers, body);
                    });
                    //Get another valid access token from the refresh token
                    helper.postRefeshToken(tokens.refresh_token, function (error, response, body) {
                        validate.validateAccessToken(response.headers, body);
                    });
                }
            );
            //test it with no off line access
            helper.postOAuthPassword(undefined,
                function(error, response, body) {
                    validate.validateAccessToken(response.headers, body);
                    var tokens = JSON.parse(body);
                    //Get the user info
                    helper.getUserInfo(tokens.access_token,
                        function(error, response, body) {
                            validate.validateUserJson(response.headers, body);
                            done();
                        }
                    );
                }
            );
        });
    });
});
