'use strict';

/**
 * This is the configuration of the clients that are allowed to connected to your authorization
 * server. These represent client applications that can connect. At a minimum you need the required
 * properties of
 *
 * id:           A unique numeric id of your client application
 * name:         The name of your client application
 * clientId:     A unique id of your client application
 * clientSecret: A unique password(ish) secret that is _best not_ shared with anyone but your
 *               client application and the authorization server.
 *
 * Optionally you can set these properties which are
 *
 * trustedClient: default if missing is false. If this is set to true then the client is regarded
 * as a trusted client and not a 3rd party application. That means that the user will not be
 * presented with a decision dialog with the trusted application and that the trusted application
 * gets full scope access without the user having to make a decision to allow or disallow the scope
 * access.
 */
const clients = [{
  id            : '1',
  name          : 'Samplr',
  clientId      : 'abc123',
  clientSecret  : 'ssh-secret',
}, {
  id            : '2',
  name          : 'Samplr2',
  clientId      : 'xyz123',
  clientSecret  : 'ssh-password',
}, {
  id            : '3',
  name          : 'Samplr3',
  clientId      : 'trustedClient',
  clientSecret  : 'ssh-otherpassword',
  trustedClient : true,
}];

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {String}   id   - The unique id of the client to find
 * @returns {Promise}  resolved promise with the client if found, otherwise undefined
 */
exports.find = id => Promise.resolve(clients.find(client => client.id === id));

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {String}   clientId - The unique client id of the client to find
 * @param   {Function} done     - The client if found, otherwise returns undefined
 * @returns {Promise} resolved promise with the client if found, otherwise undefined
 */
exports.findByClientId = clientId =>
  Promise.resolve(clients.find(client => client.clientId === clientId));
