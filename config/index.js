'use strict';

var _ = require('lodash');

function buildConfig(obj, config) {

    _.forEach(config, function(value, key) {

        if (_.isPlainObject(value)) {
            //allow recursive over riding
            obj[key] = {};
            buildConfig(obj[key], value);
        } else {

            obj[key] = value;
        }
    });
}

module.exports = function(env) {

    var result = {},
        config = require('./config'),
        all = config.all,
        prod = config.prod,
        dev = config.dev;

    buildConfig(result, all);

    if ('production' === env) {
        buildConfig(result, prod);
    } else {
        buildConfig(result, dev);
    }

    return result;
};
