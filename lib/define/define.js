'use strict';

var express = require('express'),
    service = require('./defineService'),
    define = module.exports = express();

define.set('service', service);

// Routes
define.get('/:namespace?/:eventName?', isDefined);
define.post('/:namespace/:eventName?', create);

function isDefined(req, res) {

    var namespace = req.route.params.namespace,
        eventName = req.route.params.eventName,
        promise;

    if (!namespace) {
        promise = service.getAll();
    } else if (!eventName) {
        promise = service.getNamespace(namespace);
    } else {
        promise = service.getEventName(namespace, eventName);
    }

    promise = promise.then(function(result) {
        if (!result) {
            res.api.statusCode = 404;
        }
        return result;
    });

    res.api.promise(promise);
}

function create(req, res) {

    var namespace = req.route.params.namespace,
        eventName = req.route.params.eventName;

    var promise;

    if (!eventName) {
        promise = service.defineNamespace(namespace);
    } else {
        promise = service.defineEventName(namespace, eventName);
    }

    promise = promise.then(function(result) {
        if (!result) {
            res.api.statusCode = 404;
        } else if (result.isNew === true) {
            res.api.statusCode = 201;
        }
        return result;
    });

    res.api.promise(promise);
}
