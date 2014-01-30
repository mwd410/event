'use strict';

var _ = require('lodash');

function deepApply(obj, config) {

    _.forEach(config, function(value, key) {

        if (_.isPlainObject(value)) {
            //allow recursive over riding
            obj[key] = obj[key] || {};
            deepApply(obj[key], value);
        } else {

            obj[key] = value;
        }
    });

    return obj;
}

module.exports = deepApply;
