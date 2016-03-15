'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var oauthserver = require('oauth2-server');
var https = require('https');
var fs = require('fs');

var config = require('config');
var routes = require('routes');
var security = require('lib/security');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.oauth = oauthserver({
    model: require('routes/oauth'),
    grants: ['password', 'client_credentials', 'refresh_token', 'authorization_code'],
    accessTokenLifetime: 86400,
    refreshTokenLifetime: 86400 * 14,
    authCodeLifetime: 600
});

app.security = security.init_passkey('./config/password.key', function(err) {
    if (err) { 
        console.log('can not read password key file');
        process.exit(1);
    }
});

var options = {
    key: fs.readFileSync('./config/server.key.pem'),
    cert: fs.readFileSync('./config/server.crt')
}

app.post('/oauth/token', app.oauth.grant());
app.get('/oauth/authorise', function(req, res, next) {
    req.body.allow = "yes";
    next();
}, app.oauth.authCodeGrant(function (req, next) {
    next (null, req.body.allow === 'yes', {id: 'neigence'});
}));

app.get('/', app.oauth.authorise(), function(req, res) {
    var msg = nconf.get("system:version");
    res.send('hello! express！ this is a index ' + msg + " " + req.user.id);
});

https.createServer(options, app).listen(8888, function () {
    console.log('ready on port 8888');
})
