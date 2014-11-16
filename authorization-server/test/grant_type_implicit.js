/*jslint node: true */
/*global it */
/*global describe */
'use strict';

var assert = require("assert");
var app = require("../app.js");
var request = require('request');
var helper = require('./common').request;
var validate = require('./common').validate;
var properties = require('./common').properties;
var config = require('../config');
var dbTokens = require('../' + config.db.type);


//Enable cookies so that we can perform logging in correctly to the OAuth server
//and turn off the strict SSL requirement
request = request.defaults({jar: true, strictSSL: false});

/**
 * Tests for the Grant Type of Implicit.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Implicit', function () {
  //set the time out to be 20 seconds
  this.timeout(20000);
  it('should remove all tokens', function (done) {
    dbTokens.accessTokens.removeAll(function () {
      done();
    });
  });
  it('should redirect when trying to get authorization without logging in', function (done) {
    request.get(properties.logout, function (err) {
      helper.getAuthorization({responseType: 'token'},
        function (error, response, body) {
          assert.equal(-1, response.request.href.indexOf("/#access_token="));
          done();
        }
      );
    });
  });
  it('should work with the implicit asking for a access token', function (done) {
    //Log into the OAuth2 server as bob
    helper.login(
      function (error, response, body) {
        //Get the OAuth2 authorization code
        helper.getAuthorization({responseType: 'token'},
          function (error, response, body) {
            //Assert that we have the ?code in our URL
            assert.equal(22, response.request.href.indexOf("/#access_token="));
            var accessToken = response.request.href.slice(37, 293);
            assert.equal(accessToken.length, 256);
            var expiresIn = response.request.href.slice(305, 309);
            assert.equal(expiresIn, 3600);
            var tokenType = response.request.href.slice(321, 328);
            assert.equal(tokenType, 'Bearer');
            //Get the user info
            helper.getUserInfo(accessToken,
              function (error, response, body) {
                validate.validateUserJson(response, body);
                done();
              }
            );
          }
        );
      }
    );
  });
  it('should give an error with an invalid client id', function (done) {
    helper.login(
      function (error, response, body) {
        //Get the OAuth2 authorization code
        helper.getAuthorization({responseType: 'token', clientId: 'someinvalidclientid'},
          function (error, response, body) {
            //assert that we are getting an error code of 400
            assert.equal(response.statusCode, 403);
            done();
          }
        );
      }
    );
  });
  it('should give an error with a missing client id', function (done) {
    helper.login(
      function (error, response, body) {
        //Get the OAuth2 authorization code
        request.get(
          properties.authorization + '?redirect_uri=' + properties.redirect + "&response_type=token",
          function (error, response, body) {
            //assert that we are getting an error code of 400
            assert.equal(response.statusCode, 400);
            done();
          }
        );
      }
    );
  });
  it('should give an error with an invalid response type', function (done) {
    helper.login(
      function (error, response, body) {
        //Get the OAuth2 authorization code
        helper.getAuthorization({responseType: 'invalid'},
          function (error, response, body) {
            //assert that we are getting an error code of 400
            assert.equal(response.statusCode, 501);
            done();
          }
        );
      }
    );
  });
  it('should remove all tokens', function (done) {
    dbTokens.accessTokens.removeAll(function () {
      done();
    });
  });
});
