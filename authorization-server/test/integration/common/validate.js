'use strict';

const assert = require('assert');
const utils  = require('../../../utils');

/**
 * Our validate module object we export at the bottom
 */
const validate = Object.create(null);

/**
 * Validates an access token.  An access token should be in the form of:
 * {
 *     access_token: (some 256 characters)
 *     expires_in: 3600
 *     token_type: "Bearer"
 * }
 * @param   {Object}   response - The http response
 * @param   {Object}   body     - The body of the message with the access token and refresh token
 * @returns {undefined}
 */
validate.validateAccessToken = (response, body) => {
  assert.equal(response.statusCode, 200);
  const jsonResponse = JSON.parse(body);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.equal(Object.keys(jsonResponse).length, 3);
  utils.verifyToken(jsonResponse.access_token);
  assert.equal(jsonResponse.expires_in, 3600);
  assert.equal(jsonResponse.token_type, 'Bearer');
};

/**
 * Validates an access token.  An access token should be in the form of:
 * {
 *     access_token: (some 256 characters)
 *     refresh_token: (some 256 characters)
 *     expires_in: 3600
 *     token_type: "Bearer"
 * }
 * @param {Object}     response - The http response
 * @param {Object}     body     - The body of the message with the access token and refresh token
 * @returns {undefined}
 */
validate.validateAccessRefreshToken = (response, body) => {
  assert.equal(response.statusCode, 200);
  const jsonResponse = JSON.parse(body);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.equal(Object.keys(jsonResponse).length, 4);
  utils.verifyToken(jsonResponse.access_token);
  assert.equal(jsonResponse.expires_in, 3600);
  assert.equal(jsonResponse.token_type, 'Bearer');
};

/**
 * Validates a user json message. It validates against this exact
 * user json message in the form of:
 * {
 *     "user_d": "1"
 *     "name": "Bob Smith"
 *     "token_type": "Bearer"
 * }
 * @param {Object}     response - The http response
 * @param {Object}     body     - The body of the message which contains the user json message
 * @returns {undefined}
 */
validate.validateUserJson = (response, body) => {
  assert.equal(response.statusCode, 200);
  const jsonResponse = JSON.parse(body);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(Object.keys(jsonResponse).length, 3);
  assert.equal(jsonResponse.user_id, '1');
  assert.equal(jsonResponse.name, 'Bob Smith');
  assert.equal(jsonResponse.scope, '*');
};

/**
 * Validates a client json message. It validates against this exact
 * client json message in the form of:
 * {
 *     "client_id": "3"
 *     "name": "Samplr3"
 *     "scope": "*"
 * }
 * @param   {Object}   response - The http response
 * @param   {Object}   body     - The body of the message which contains the client json message
 * @returns {undefined}
 */
validate.validateClientJson = (response, body) => {
  assert.equal(response.statusCode, 200);
  const jsonResponse = JSON.parse(body);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(Object.keys(jsonResponse).length, 3);
  assert.equal(jsonResponse.client_id, '3');
  assert.equal(jsonResponse.name, 'Samplr3');
  assert.equal(jsonResponse.scope, '*');
};

/**
 * Validates an invalid code error.  The error should be in the form of:
 * {
 *     error: invalid_grant
 *     error_description: invalid_code
 * }
 * @param {Object}     response - The http response
 * @param {Object}     body     - The body of the message which contains the error message
 * @returns {undefined}
 */
validate.validateInvalidCodeError = (response, body) => {
  assert.equal(response.statusCode, 403);
  const jsonResponse = JSON.parse(body);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.equal(Object.keys(jsonResponse).length, 2);
  assert.equal(jsonResponse.error, 'invalid_grant');
  assert.equal(jsonResponse.error_description, 'Invalid authorization code');
};

/**
 * Given an access code, this will validate its length
 * @param {String}     code - The code to validate the access code against the correct length.
 * @returns {undefined}
 */
validate.validateAuthorizationCode = (code) => {
  utils.verifyToken(code);
};

module.exports = validate;
