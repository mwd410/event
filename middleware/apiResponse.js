'use strict';

module.exports = function(req, res, next) {

    var api = res.api = {};

    api.success = function(data) {
        res.send({
            success : true,
            data    : data
        });
    };

    api.error = function(error) {
        res.send({
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
