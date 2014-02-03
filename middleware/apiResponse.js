'use strict';

module.exports = function(req, res, next) {

    var api = res.api = {};

    api.statusCode = 200;

    api.success = function(data) {
        res.send(api.statusCode, {
            success : true,
            data    : data
        });
    };

    api.error = function(error) {
        if (api.statusCode === 200) {
            api.statusCode = 500;
        }
        res.send(api.statusCode, {
            success : false,
            error   : error
        });
    };

    api.promise = function(promise) {
        promise.then(api.success, api.error);
    };

    api.send = api.success;

    next();
};
