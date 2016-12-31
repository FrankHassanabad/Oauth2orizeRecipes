'use strict';

const chai      = require('chai');
const sinonChai = require('sinon-chai');
const utils     = require('../../../utils');

chai.use(sinonChai);
const expect = chai.expect;

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
  expect(response.statusCode).to.eql(200);
  const jsonResponse = JSON.parse(body);
  expect(response.headers['content-type']).to.eql('application/json');
  expect(Object.keys(jsonResponse)).to.have.lengthOf(3);
  utils.verifyToken(jsonResponse.access_token);
  expect(jsonResponse.expires_in).to.eql(3600);
  expect(jsonResponse.token_type).to.eql('Bearer');
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
  expect(response.statusCode).to.eql(200);
  const jsonResponse = JSON.parse(body);
  expect(response.headers['content-type']).to.eql('application/json');
  expect(Object.keys(jsonResponse)).to.have.lengthOf(4);
  utils.verifyToken(jsonResponse.access_token);
  expect(jsonResponse.expires_in).to.eql(3600);
  expect(jsonResponse.token_type).to.eql('Bearer');
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
  expect(response.statusCode).to.eql(200);
  const jsonResponse = JSON.parse(body);
  expect(response.headers['content-type']).to.eql('application/json; charset=utf-8');
  expect(Object.keys(jsonResponse)).to.have.lengthOf(3);
  expect(jsonResponse).to.eql({
    user_id : '1',
    name    : 'Bob Smith',
    scope   : '*',
  });
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
  expect(response.statusCode).to.eql(200);
  const jsonResponse = JSON.parse(body);
  expect(response.headers['content-type']).to.eql('application/json; charset=utf-8');
  expect(Object.keys(jsonResponse)).to.have.lengthOf(3);
  expect(jsonResponse).to.eql({
    client_id : '3',
    name      : 'Samplr3',
    scope     : '*',
  });
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
  expect(response.statusCode).to.eql(403);
  const jsonResponse = JSON.parse(body);
  expect(response.headers['content-type']).to.eql('application/json');
  expect(Object.keys(jsonResponse)).to.have.lengthOf(2);
  expect(jsonResponse).to.eql({
    error             : 'invalid_grant',
    error_description : 'Invalid authorization code',
  });
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
