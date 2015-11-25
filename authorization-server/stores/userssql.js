'use strict';

var sql = require('mssql');
var crypt = require('../utils/crypt');

var config = {
    user: 'sa',
    password: 'bersuit',
    server: 'sql-01', // You can use 'localhost\\instance' to connect to named instance 
    database: 'Aula365'
}

sql.connect(config, function (err) {
    // ... error checks 
        
});

exports.find = function (username, password, done) {
    var encryptedPassword = crypt.encrypt3DES(password);
    var request = new sql.Request();
    var query = "select * from [UserMaster] where [UserName] = '" + username + "' AND [Password] = '" + encryptedPassword + "'";

    request.query(query, function (err, recordset) {
        // ... error checks 
        if (err) {
            return done(err, null);
        }
        
        if (recordset.length != 1) {
            return done(null, null);
        }
        
        return done(null, recordset[0]);
    });
};

exports.findById = function (id, done) {
    var request = new sql.Request();
    var query = "select * from [UserMaster] where [UserId] = '" + id + "'";
    
    request.query(query, function (err, recordset) {
        // ... error checks 
        if (err) {
            return done(err, null);
        }
        
        if (recordset.length != 1) {
            return done(null, null);
        }
        
        return done(null, recordset[0]);
    });
};

sql.on('error', function (err) {
    // ... error handler 
});