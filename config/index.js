'use strict';

var _ = require('lodash'),
    walkSync = require('utils').walkSync,
    path = require('path');

function buildConfig(obj, config) {

    _.forEach(config, function(value, key) {

        if (_.isPlainObject(value)) {
            //allow recursive over riding
            obj[key] = obj[key] || {};
            buildConfig(obj[key], value);
        } else {

            obj[key] = value;
        }
    });
}

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

    _.forEach(walkResult, function(fn, file) {
        if (typeof fn !== 'function') {
            return;
        }
        config[file.match(fileNameRegex)[1]] = fn(true);
    });

    return config;
};

module.exports.buildConfig = buildConfig;
