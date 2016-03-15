'use strict';

var mysql = require('mysql');
var nconf = require('nconf');
var config = nconf.get('mysql');

var APP_TABLE = "App";
var USR_TABLE = "User";

var pool = mysql.createPoolCluster();
var slave_count = 0;

config.forEach(function(dbSetting) {
    var type = undefined;
    if (dbSetting.type == "slave") {
        type = "slave" + slave_count++;
    } else if (dbSetting.type == "master") {
        type = dbSetting.type;
    }
    if (type != undefined) {
        pool.add(type, {
            connectionLimit : dbSetting.connectionLimit,
            host : dbSetting.host,
            user : dbSetting.user,
            password : dbSetting.password,
            database : dbSetting.database,
            charset : 'utf8mb4_unicode_ci'
        });
    }
});

function getMasterConnection (err, callback) {
    return pool.getConnection("master", function(err, connection) {
        callback && callback(err, connection);
    });
}

function getSlaveConnection (callback) {
    var type = slave_count > 0 ? "slave*" : "master";
    return pool.getConnection(type, function(err,connection) {
        callback && callback(err, connection);
    });
}

function executeQuery(option, is_update, callback) {
    var getConnection = is_update ? getMasterconnection : getSlaveConnection;
    getConnection(function(err, connection) {
        if (err) {
            callback && callback(err, null);
        } else {
            var query = connection.query(option, function(err, rows) {
                connection.release();
                callback && callback(err, rows);
            });
        }    
    });
} 

exports.getApp = function (client_id, callback) {
    var option = {}
    option.sql = "SELECT * FROM ?? WHERE client_id = ?;";
    option.values = [APP_TABLE, client_id];
    executeQuery(option, false, function (err, result) {
        var client_data = null;
        if (result && result.length > 0) {
            client_data = {
                client_id: result[0].client_id,
                client_name: result[0].client_name,
                client_secret: result[0].client_secret,
                redirect_uri: result[0].redirect_uri
            }
        }
        callback(err, client_data);
    });
}

exports.getUser = function (user_id, callback) {
    var option = {}
    option.sql = "SELECT * FROM ?? WHERE user_id = ?;";
    option.values = [USR_TABLE, user_id];
    executeQuery(option, false, function (err, result) {
        var user_data = null;
        if (result && result.length > 0) {
            user_data = {
                user_id: result[0].user_id,
                user_name: result[0].user_name,
                user_password: result[0].user_password,
                user_email: result[0].user_email
            }
        }
        callback(err, user_data);
    });
}
