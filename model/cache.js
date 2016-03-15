'use strict';

var redis = require('redis');
var nconf = require('nconf');
var storage = require('./storage');

var config = nconf.get("redis");

var CacheKeyPrefix = {
    APP: "APP:",
    TOKEN: "TOK:",
    USER: "USR:"
}

var cache = redis.createClient(config.port, config.host);
cache.on('connect', function(){
    console.log("connect to redis successfully");
});

exports.getApp = function(client_id, callback) {
    cache.get(CacheKeyPrefix.APP + client_id, function(err, reply) {
        if (reply == null) {
            storage.getApp(client_id, function(err, client_data) {
                if (client_data != null) {
                    reply = JSON.stringify(client_data);
                    cache.set(CacheKeyPrefix.APP + client_id, reply);
                }
                callback(err, client_data);
            });
        } else {
            callback(err, JSON.parse(reply));
        }
    });
}

exports.getUser = function(user_id, callback) {
    cache.get(CacheKeyPrefix.USR + user_id, function(err, reply) {
        if (reply == null) {
            storage.getUser(user_id, function(err, user_data) {
                if (user_data != null) {
                    reply = JSON.stringify(user_data);
                    cache.set(CacheKeyPrefix.USER + user_id, reply);
                }
                callback(err, user_data);
            });
        } else {
            callback(err, JSON.parse(reply));
        }
    });
}

exports.saveToken = function(token, type, clientId, expires, user, scope, callback) {
    var token_data = {
        token_value: token,
        token_type: type,
        client_id: clientId,
        expires: expires,
        user_id: user ? user.id : "",
        scope: scope,
    }
    cache.set(CacheKeyPrefix.TOKEN + token, JSON.stringify(token_data), function(err, reply){
        if (!err) {
            cache.expireat(CacheKeyPrefix.TOKEN + token, parseInt(new Date(expires).getTime() / 1000) + 300);
        }
        callback(err, reply);
    });
}

exports.getToken = function(token, type, callback) {
    cache.get(CacheKeyPrefix.TOKEN + token, function(err, reply) {
        if (err) return callback(err);
        if (!reply) return callback();

        var token_data = JSON.parse(reply);
        if (token_data && token_data.token_type === type) {
            return callback(null, token_data);
        } else {
            return callback();
        }
    });
} 

exports.delToken = function(token, callback) {
    cache.del(CacheKeyPrefix.TOKEN + token, function(err, reply) {
        callback(err);
    });
}
