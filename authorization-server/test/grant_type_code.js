var assert = require("assert")
    , app = require("../app.js")
    , request = require('request');

//Enable cookies so that we can perform logging in correctly to the OAuth server
//and turn off the strict SSL requirement
var request = request.defaults({jar: true, strictSSL: false});

/**
 * Tests for the Grant Type of Authorization Code.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Types', function () {
    //set the time out to be 20 seconds
    this.timeout(20000);
    describe('Grant Type of authorization_code', function () {
        it('should work with the authorization_code asking for a refresh token', function (done) {
            //Log into the OAuth2 server as bob
            request.post(
                'https://localhost:3000/login', {
                    form: {
                        username: 'bob',
                        password: 'secret'
                    }
                },
                function (error, response, body) {
                    //Get the OAuth2 authorization code
                    request.get(
                        'https://localhost:3000/dialog/authorize?redirect_uri=https://localhost:3000&response_type=code&client_id=trustedClient&scope=offline_access',
                        function (error, response, body) {
                            //Assert that we have the ?code in our URL
                            assert.equal(0, response.req.path.indexOf("/?code="));
                            var code = response.req.path.slice(7, response.req.path.length);
                            //Get the token
                            request.post(
                                'https://localhost:3000/oauth/token',
                                {
                                    form: {
                                        code: code,
                                        redirect_uri: 'https://localhost:3000',
                                        client_id: 'trustedClient',
                                        client_secret: 'ssh-otherpassword',
                                        grant_type: 'authorization_code'
                                    }
                                },
                                function (error, response, body) {
                                    //Assert that we got back an application/json response
                                    assert.equal(response.headers["content-type"], "application/json");
                                    var jsonResponse = JSON.parse(body);
                                    assert.equal(Object.keys(jsonResponse).length, 4);
                                    assert.equal(jsonResponse.access_token.length, 256);
                                    assert.equal(jsonResponse.refresh_token.length, 256);
                                    assert.equal(jsonResponse.expires_in, 3600);
                                    assert.equal(jsonResponse.token_type, "bearer");
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });
        it('should work with the authorization_code asking not asking for a refresh token', function (done) {
            //Log into the OAuth2 server as bob
            request.post(
                'https://localhost:3000/login', {
                    form: {
                        username: 'bob',
                        password: 'secret'
                    }
                },
                function (error, response, body) {
                    //Get the OAuth2 authorization code
                    request.get(
                        'https://localhost:3000/dialog/authorize?redirect_uri=https://localhost:3000&response_type=code&client_id=trustedClient',
                        function (error, response, body) {
                            //Assert that we have the ?code in our URL
                            assert.equal(0, response.req.path.indexOf("/?code="));
                            var code = response.req.path.slice(7, response.req.path.length);
                            //Get the token
                            request.post(
                                'https://localhost:3000/oauth/token',
                                {
                                    form: {
                                        code: code,
                                        redirect_uri: 'https://localhost:3000',
                                        client_id: 'trustedClient',
                                        client_secret: 'ssh-otherpassword',
                                        grant_type: 'authorization_code'
                                    }
                                },
                                function (error, response, body) {
                                    //Assert that we got back an application/json response
                                    assert.equal(response.headers["content-type"], "application/json");
                                    var jsonResponse = JSON.parse(body);
                                    assert.equal(Object.keys(jsonResponse).length, 3);
                                    assert.equal(jsonResponse.access_token.length, 256);
                                    assert.equal(jsonResponse.expires_in, 3600);
                                    assert.equal(jsonResponse.token_type, "bearer");
                                    done();
                                }
                            );
                        }
                    );
                }
            );
        });
        it('should work with the authorization_code with an invalid client id', function (done) {
            //Log into the OAuth2 server as bob
            request.post(
                'https://localhost:3000/login', {
                    form: {
                        username: 'bob',
                        password: 'secret'
                    }
                },
                function (error, response, body) {
                    //Get the OAuth2 authorization code
                    request.get(
                        'https://localhost:3000/dialog/authorize?redirect_uri=https://localhost:3000&response_type=code&client_id=someInvalidClientId',
                        function (error, response, body) {
                            //assert that we are getting an error code of 400
                            assert.equal(response.statusCode, 400);
                            done();
                        }
                    );
                }
            );
        });
        it('should work with the authorization_code with a missing client id', function (done) {
            //Log into the OAuth2 server as bob
            request.post(
                'https://localhost:3000/login', {
                    form: {
                        username: 'bob',
                        password: 'secret'
                    }
                },
                function (error, response, body) {
                    //Get the OAuth2 authorization code
                    request.get(
                        'https://localhost:3000/dialog/authorize?redirect_uri=https://localhost:3000&response_type=code',
                        function (error, response, body) {
                            //assert that we are getting an error code of 400
                            assert.equal(response.statusCode, 400);
                            done();
                        }
                    );
                }
            );
        });
        it('should work with an invalid response type', function (done) {
            //Log into the OAuth2 server as bob
            request.post(
                'https://localhost:3000/login', {
                    form: {
                        username: 'bob',
                        password: 'secret'
                    }
                },
                function (error, response, body) {
                    //Get the OAuth2 authorization code
                    request.get(
                        'https://localhost:3000/dialog/authorize?redirect_uri=https://localhost:3000&response_type=invalid&client_id=trustedClient',
                        function (error, response, body) {
                            //assert that we are getting an error code of 400
                            assert.equal(response.statusCode, 400);
                            done();
                        }
                    );
                }
            );
        });
    });
});
