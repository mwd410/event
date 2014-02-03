'use strict';

var db = require('db'),
    Promise = require('bluebird'),
    _ = require('lodash');

var invalidNameRegex = /[^-_a-z]|^.$|^.{17,}$|^[^a-z]|[^a-z]$/;

function isValidName(name) {
    return !invalidNameRegex.test(name);
}

exports.isValidName = isValidName;

exports.getQueryArgs = getQueryArgs;

function queryFor(namespace, eventName) {
    return db.query.apply(db, getQueryArgs.apply(null, arguments));
}

function getQueryArgs(namespace, eventName) {

    var columns = ['ns.name as namespace'];
    var from = ' from namespace ns ';
    var where = '';
    var params = [];
    var result = [];

    if (namespace) {
        columns.push('en.name as eventName');
        from += 'join eventName en on en.namespaceId = ns.id ';
        where = 'where ns.name = ? ';
        params.push(namespace);
        result.push(params);
    }

    if (eventName) {
        where += 'and en.name = ? ';
        params.push(eventName);
    }

    var query = 'select ' + columns.join() + from + where;

    result.unshift(query);

    return result;
}

exports.getAll = function getAll() {

    return queryFor().spread(
        function(namespaces) {
            return namespaces.reduce(function(result, namespace) {
                result.namespaces.push(namespace.namespace);
                return result;
            }, {namespaces : []});
        }
    );
};

exports.getNamespace = function getNamespace(namespace) {

    if (!isValidName(namespace)) {
        return Promise.reject('Invalid name.');
    }

    return queryFor(namespace).spread(
        function(rows, fields) {
            if (rows.length === 0) {
                return false;
            }

            return rows.reduce(function(result, row) {
                result.namespace = row.namespace;
                if (row.eventName) {
                    result.eventNames.push(row.eventName);
                }
                return result;
            }, {eventNames : []});
        }
    );
};

exports.getEventName = function getEventName(namespace, eventName) {

    if (!_.every([namespace, eventName], isValidName)) {
        return Promise.reject('Invalid name.');
    }

    return queryFor(namespace, eventName).spread(
        function(rows, fields) {
            if (rows.length === 0) {
                return false;
            }

            return rows[0];
        }
    );
};
