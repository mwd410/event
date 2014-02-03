'use strict';

var db = require('db'),
    Promise = require('bluebird'),
    _ = require('lodash');

var invalidNameRegex = /[^-_a-z]|^.$|^.{17,}$|^[^a-z]|[^a-z]$/;

exports.isValidName = isValidName;
function isValidName(name) {
    return !invalidNameRegex.test(name);
}

function queryFor(namespace, eventName) {
    return db.query.apply(db, getQueryArgs.apply(null, arguments));
}

exports.getQueryArgs = getQueryArgs;
function getQueryArgs(namespace, eventName) {

    var columns = ['ns.name as namespace'];
    var from = ' from namespace ns ';
    var where = '';
    var params = [];
    var result = [];

    if (namespace) {
        columns.push('en.name as eventName');
        from += 'left join eventName en on en.namespaceId = ns.id ';
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

exports.getAll = getAll;
/**
 * Returns an array of currently defined namespaces.
 */
function getAll() {

    return queryFor().spread(
        function(namespaces) {
            return namespaces.reduce(function(result, namespace) {
                result.namespaces.push(namespace.namespace);
                return result;
            }, {namespaces : []});
        }
    );
}

exports.getNamespace = getNamespace;
/**
 * Returns a namespace object if `namespace` exists, false if it doesn't.
 */
function getNamespace(namespace) {

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
}

exports.getEventName = getEventName;
/**
 * Returns an eventName object if it exists, false if it doesn't.
 */
function getEventName(namespace, eventName) {

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
}

exports.defineNamespace = defineNamespace;
/**
 * Will define a namespace or return an existing one.
 */
function defineNamespace(namespace) {

    if (!isValidName(namespace)) {
        return Promise.reject('Invalid name.');
    }

    return getNamespace(namespace).then(
        function(namespaceObject) {
            if (namespaceObject) {
                namespaceObject.isNew = false;
                return namespaceObject;
            } else {
                return doDefineNamespace(namespace);
            }
        }
    );
}

function doDefineNamespace(namespace) {

    return db.query('insert ignore into namespace (name) values (?)', namespace).spread(
        function() {
            return getNamespace(namespace).then(function(result) {
                result.isNew = true;
                return result;
            });
        }
    );
}
