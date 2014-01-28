'use strict';

var express = require('express'),
    service = require('./defineService'),
    define = module.exports = express();

// Routes
define.get('/:_namespace?/:_identifier?', isDefined);
define.post('/:_namespace/:_identifier?', create);

function isDefined(req, res) {

    var namespace = req.route.params._namespace,
        identifier = req.route.params._identifier,
        promise;

    if (!namespace) {
        promise = service.getAll();
    } else if (!identifier) {
        promise = service.getNamespace(namespace);
    } else {
        promise = service.getIdentifier(namespace, identifier);
    }

    res.api.promise(promise);
}

function create(req, res) {

    var namespace = req.route.params._namespace,
        identifier = req.route.params._identifier,
        promise;

    if (!identifier) {
        promise = service.defineNamespace(namespace);
    } else {
        promise = service.defineIdentifier(namespace, identifier);
    }

    res.promise(promise);
}
