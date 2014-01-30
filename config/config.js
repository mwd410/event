'use strict';

var _ = require('lodash'),
    walkSync = require('utils').walkSync,
    deepApply = require('utils').deepApply,
    path = require('path');



module.exports = function(env) {

    var config = {},
        fileNameRegex = /^(\w+)\.js$/;

    var walkResult = walkSync(__dirname, function(err, filePath, stat) {

        if (stat.isDirectory() && env !== path.basename(filePath) ||
            !stat.isDirectory() && filePath === __filename ||
            !fileNameRegex.test(path.basename(filePath))) {

            return false;
        }
    });

    function applyConfig(fn, file) {
        if (typeof fn !== 'function') {
            return;
        }
        var section = file.match(fileNameRegex)[1];
        config[section] = deepApply(config[section] || {}, fn(true));
    }

    _.forEach(walkResult, applyConfig);
    if (walkResult[env]) {
        _.forEach(walkResult[env], applyConfig);
    }

    return config;
};
