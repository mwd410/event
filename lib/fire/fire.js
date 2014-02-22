'use strict';

var express = require('express'),
    fire = module.exports = express(),
    service = require('./fireService');

// Routes
fire.post('/:namespace/:eventName', fireEvent);

function fireEvent(req, res) {

    var namespace = req.route.params.namespace,
        eventName = req.route.params.eventName;

    console.log(req.body);

    var promise = service.fire(namespace, eventName, req.body);

    res.api.promise(promise);
}
