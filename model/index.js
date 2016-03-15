'use strict';

var fs = require('fs');
var moduleName = module.id.replace(/^.*[\\\/]/, '');

fs.readdirSync(__dirname).forEach(function(file){
    if (file !== moduleName && file.match('^[A-Za-z0-9]+\.js$')) {
        var flname = file.substr(0, file.lastIndexOf('.'));
        exports[flname] = require('./' + flname);
    }
});

