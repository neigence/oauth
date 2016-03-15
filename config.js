'use strict';

var conf = require('nconf')

conf.use('file', {file: './config/system.json'});
conf.load();

console.log("config load success");
