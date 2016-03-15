'use strict';

var crypto = require('crypto');
var fs = require('fs');

var key = "";

exports.init_passkey = function(key_file, callback) {
    fs.readFile(key_file, 'ascii',function (err, data) {
        if (err) { return callback(err);}
        key = data;
        return callback(false);
    });
}

exports.encrypt_password = function(password) {
    return crypto.createHash('md5').update(password + key).digest('hex');
}

