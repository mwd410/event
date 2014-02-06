'use strict';

var _ = require('lodash');

function ApiError(message, data) {

    if (!(this instanceof ApiError)) {
        return new ApiError(message, data);
    }

    Error.call(this, message);

    this.message = message;
    _.each(data, function(value, key) {
        this[key] = value;
    }, this);
}

ApiError.prototype = new Error();

module.exports = ApiError;
