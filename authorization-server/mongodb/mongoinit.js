'use strict';

const config      = require('../config');
const MongoClient = require('mongodb').MongoClient;

// TODO: Configure the connection string for mongo to accept more than just local host

/**
 * Our local static db
 */
let localDb;

/**
 * Gets the static collection of "storage" that is stored within mongo db
 * @param   {Function} next - Calls when completed
 * @returns {undefined}
 */
const getCollection = (next) => {
  if (typeof localDb !== 'undefined') {
    // The database is already initialized
    const localCollection = localDb.collection('storage');
    next(localCollection);
  } else {
    // We have to initialize the database and its connection
    MongoClient.connect(`mongodb://127.0.0.1:27017/${config.db.dbName}`, (err, db) => {
      if (err) {
        throw err;
      }
      localDb = db;
      // Add an index to the tokens
      localDb.collection('storage').ensureIndex({ token: 1 });
      getCollection(next);
    });
  }
};

exports.getCollection = getCollection;
