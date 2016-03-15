'use strict';

var cache = require('../model/cache');
var security = require('../lib/security');
var util = require('../lib/util');

var ScopeMap = {
    Application: "application",
    UserProfile: "user-profile",
    UserActivity: "user-activity"
}

var ScopeUser = [ScopeMap.Application, ScopeMap.UserProfile, ScopeMap.UserActivity];

exports.getClient = function (clientId, clientSecret, callback) {
    cache.getApp(clientId, function(err, client_data) {
        if (err) return callback(err);
        if (!client_data || (clientSecret != null && client_data.client_secret !== clientSecret)) {
            return callback();
        }
        callback(null, {
            clientId: client_data.client_id,
            clientSecret: client_data.client_secret,
            redirectUri: client_data.redirect_uri 
        });
    });
};

exports.getAccessToken = function (bearerToken, callback) {    
    cache.getToken(bearerToken, 'access', function(err, token_data) {
        if (err) return callback(err);
        if (!token_data) return callback();

        var access_token = {
            accessToken: token_data.token_value,
            clientId: token_data.client_id,
            expires: new Date(token_data.expires),
            userId: token_data.user_id,
            scope: token_data.scope,
        };
        callback(null,access_token);
    });
}

exports.getRefreshToken = function (bearerToken, callback) {
    cache.getToken(bearerToken, 'refresh', function(err, token_data) {
        if (err) return callback(err);
        if (!token_data) return callback();

        var refresh_token = {
            accessToken: token_data.token_value,
            clientId: token_data.client_id,
            expires: new Date(token_data.expires),
            userId: token_data.user_id,
            scope: token_data.scope,
        }
        callback(null,refresh_token);
    });
}

exports.grantTypeAllowed = function (clientId, grantType, callback) {
    if (grantType == "password" || grantType == "client_credentials" || grantType == "refresh_token" || grantType == "authorization_code") {
        return callback(false, true);
    }
};

exports.checkScope = function (clientId, grantType, newScope, oldScope, callback) {
    if (grantType == "client_credentials") {
        return callback(false, [ScopeMap.Application]);
    } else if (grantType == "authorization_code" || grantType == "password") {
        for (var key in newScope) {
            if (ScopeUser.indexOf(newScope[key]) < 0) {
                return callback(true);    
            }
        }
        return callback(false, newScope);
    } else if (grantType == "refresh_token") {
        return callback(false, oldScope);
    }
    return callback(true);
}

exports.saveAccessToken = function (accessToken, clientId, expires, user, newScope, callback) {
    cache.saveToken(accessToken, 'access', clientId, expires.toISOString(), user, newScope, callback);
};

exports.saveRefreshToken = function (refreshToken, clientId, expires, user, newScope, callback) {
    cache.saveToken(refreshToken, 'refresh', clientId, expires.toISOString(), user, newScope, callback);
};

exports.getUser = function (username, password, callback) {
    var encPassword = security.encrypt_password(password);
    cache.getUser(username, function(err, user_data) {
        if (!user_data || encPassword !== user_data.user_password) {
            return callback();
        }
        callback(null, {id: username});
    });
};

exports.getUserFromClient = function (clientId, clientSecret, callback) {
    cache.getApp(clientId, function(err, client_data) {
        if (err) return callback(err);
        if (client_data) {
            callback(err, {id: client_data.client_name});
        }       
    });
}

exports.revokeRefreshToken = function (refreshToken, callback) {
    cache.delToken(refreshToken, function(err) {
        callback();
    });
}

exports.getAuthCode = function (code, callback) {
    cache.getToken(code, 'authcode', function(err, token_data) {
        if (err) return callback(err);
        if (!token_data) return callback();

        var auth_token = {
            clientId: token_data.client_id,
            expires: new Date(token_data.expires),
            user: {id: token_data.user_id},
            scope: token_data.scope,
        };
        callback(null,auth_token);
    });
}

exports.saveAuthCode = function (authCode, clientId, expires, user, callback) {
    console.log(user);
    cache.saveToken(authCode, 'authcode', clientId, expires.toISOString(), user, ['application'], callback);
}
