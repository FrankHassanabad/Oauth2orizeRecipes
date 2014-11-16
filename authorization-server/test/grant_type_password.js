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
 * Tests for the Grant Type of Password.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Password', function () {
  //set the time out to be 20 seconds
  this.timeout(20000);
  it('should remove all tokens', function (done) {
    dbTokens.accessTokens.removeAll(function () {
      done();
    });
  });
  it('should work with asking for an access token and refrsh token', function (done) {
    helper.postOAuthPassword('offline_access',
      function (error, response, body) {
        validate.validateAccessRefreshToken(response, body);
        var tokens = JSON.parse(body);
        //Get the user info
        helper.getUserInfo(tokens.access_token,
          function (error, response, body) {
            validate.validateUserJson(response, body);
          }
        );
        //Get another valid access token from the refresh token
        helper.postRefeshToken(tokens.refresh_token, function (error, response, body) {
          validate.validateAccessToken(response, body);
        });
        //Get another valid access token from the refresh token
        helper.postRefeshToken(tokens.refresh_token, function (error, response, body) {
          validate.validateAccessToken(response, body);
          done();
        });
      }
    );
  });
  it('should work just an access token and a scope of undefined', function (done) {
    //test it with no off line access
    helper.postOAuthPassword(undefined,
      function (error, response, body) {
        validate.validateAccessToken(response, body);
        var tokens = JSON.parse(body);
        //Get the user info
        helper.getUserInfo(tokens.access_token,
          function (error, response, body) {
            validate.validateUserJson(response, body);
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
