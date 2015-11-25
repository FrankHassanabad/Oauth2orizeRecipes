'use strict';

var crypto = require('crypto');

var key = 'passKey';

exports.encrypt3DES = function (input) {
    var md5Bytes = new Buffer(key, 'ascii');
    var md5sum = crypto.createHash('md5');
    md5sum.update(md5Bytes);
    var md5Key = md5sum.digest('hex');
    var md5Buffer = new Buffer(md5Key, 'hex');

    var des_key = new Buffer(md5Buffer, 'ascii');
    var slicedKey = des_key.slice(0, 16);

    var des_iv = new Buffer(0, 'ascii');
    var des_encryption = crypto.createCipheriv('DES-EDE', slicedKey, des_iv);
    var byteInput = new Buffer(input, 'ascii');
    
    var deciphered_string = des_encryption.update(byteInput, 'ascii', 'base64');
    deciphered_string += des_encryption.final('base64');

    return deciphered_string;
};
