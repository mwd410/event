'use strict';

var db = require('db'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    isValidName = require('utils').isValidName,
    defineService = require('define').get('service');

exports.fire = fire;

function fire(namespace, eventName, postData) {

    return defineService
        .getEventName(namespace, eventName)
        .then(assertEventNameExists);

    function assertEventNameExists(eventNameObject) {

        if (!eventNameObject) {
            throw new Error('Undefined event ' + [namespace, eventName].join(':'));
        }

        return postData;
    }
}
