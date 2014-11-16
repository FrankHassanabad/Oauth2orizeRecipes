/*jslint node: true */
/*global exports */
'use strict';

var assert = require("assert");

/**
 * Our validate module object we export at the bottom
 */
var validate = {};

/**
 * Validates an access token.  An access token should be in the form of:
 * {
 *     access_token: (some 256 characters)
 *     expires_in: 3600
 *     token_type: "Bearer"
 * }
 * @param response The http response
 * @param body The body of the message which contains the access token and refresh token
 */
validate.validateAccessToken = function (response, body) {
  assert.equal(response.statusCode, 200);
  var jsonResponse = JSON.parse(body);
  assert.equal(response.headers["content-type"], "application/json");
  assert.equal(Object.keys(jsonResponse).length, 3);
  assert.equal(jsonResponse.access_token.length, 256);
  assert.equal(jsonResponse.expires_in, 3600);
  assert.equal(jsonResponse.token_type, "Bearer");
};

/**
 * Validates an access token.  An access token should be in the form of:
 * {
 *     access_token: (some 256 characters)
 *     refresh_token: (some 256 characters)
 *     expires_in: 3600
 *     token_type: "Bearer"
 * }
 * @param response The http response
 * @param body The body of the message which contains the access token and refresh token
 */
validate.validateAccessRefreshToken = function (response, body) {
  assert.equal(response.statusCode, 200);
  var jsonResponse = JSON.parse(body);
  assert.equal(response.headers["content-type"], "application/json");
  assert.equal(Object.keys(jsonResponse).length, 4);
  assert.equal(jsonResponse.access_token.length, 256);
  assert.equal(jsonResponse.expires_in, 3600);
  assert.equal(jsonResponse.token_type, "Bearer");
};

/**
 * Validates a user json message. It validates against this exact
 * user json message in the form of:
 * {
 *     "user_d": "1"
 *     "name": "Bob Smith"
 *     "token_type": "Bearer"
 * }
 * @param response The http response
 * @param body The body of the message which contains the user json message
 */
validate.validateUserJson = function (response, body) {
  assert.equal(response.statusCode, 200);
  var jsonResponse = JSON.parse(body);
  assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(Object.keys(jsonResponse).length, 3);
  assert.equal(jsonResponse.user_id, "1");
  assert.equal(jsonResponse.name, "Bob Smith");
  assert.equal(jsonResponse.scope, "*");
};

/**
 * Validates a client json message. It validates against this exact
 * client json message in the form of:
 * {
 *     "client_id": "3"
 *     "name": "Samplr3"
 *     "scope": "*"
 * }
 * @param response The http response
 * @param body The body of the message which contains the client json message
 */
validate.validateClientJson = function (response, body) {
  assert.equal(response.statusCode, 200);
  var jsonResponse = JSON.parse(body);
  assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(Object.keys(jsonResponse).length, 3);
  assert.equal(jsonResponse.client_id, "3");
  assert.equal(jsonResponse.name, "Samplr3");
  assert.equal(jsonResponse.scope, "*");
};

/**
 * Validates an invalid code error.  The error should be in the form of:
 * {
 *     error: invalid_grant
 *     error_description: invalid_code
 * }
 * @param response The http response
 * @param body The body of the message which contains the error message
 */
validate.validateInvalidCodeError = function (response, body) {
  assert.equal(response.statusCode, 403);
  var jsonResponse = JSON.parse(body);
  assert.equal(response.headers["content-type"], "application/json");
  assert.equal(Object.keys(jsonResponse).length, 2);
  assert.equal(jsonResponse.error, "invalid_grant");
  assert.equal(jsonResponse.error_description, "Invalid authorization code");
};

/**
 * Given an access code, this will validate its length
 * @param code The code to validate the access code against the
 * correct length.
 */
validate.validateAuthorizationCode = function (code) {
  assert.equal(code.length, 16);
};

exports.validate = validate;
