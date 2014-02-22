'use strict';

var db = require('db'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    ApiError = require('utils').ApiError,
    isValidName = require('utils').isValidName;

exports.getAll = getAll;
exports.getNamespace = getNamespace;
exports.getEventName = getEventName;
exports.defineNamespace = defineNamespace;
exports.defineEventName = defineEventName;

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
        columns.push('ns.id as namespaceId');
        if (!eventName) {
            from += 'left ';
        }
        from += 'join eventName en on en.namespaceId = ns.id ';
        where = 'where ns.name = ? ';
        params.push(namespace);
        result.push(params);
    }

    if (eventName) {
        columns.push('en.id as eventNameId');
        where += 'and en.name = ? ';
        params.push(eventName);
    }

    var query = 'select ' + columns.join() + from + where;

    result.unshift(query);

    return result;
}

/**
 * Returns an array of currently defined namespaces.
 */
function getAll() {

    return queryFor()
        .spread(build);

    function build(namespaces) {
        return namespaces.reduce(function(result, namespace) {
            result.namespaces.push(namespace.namespace);
            return result;
        }, {namespaces : []});
    }
}

/**
 * Returns a namespace object if `namespace` exists, false if it doesn't.
 */
function getNamespace(namespace) {

    if (!isValidName(namespace)) {
        return Promise.reject(new ApiError('Invalid name.', {
            statusCode : 400
        }));
    }

    return queryFor(namespace)
        .spread(buildNs);

    function buildNs(rows, fields) {
        if (rows.length === 0) {
            return false;
        }

        return rows.reduce(function(result, row) {
            result.namespaceId = row.namespaceId;
            if (row.eventName) {
                result.eventNames.push(row.eventName);
            }
            return result;
        }, {
            namespace  : namespace,
            eventNames : []
        });
    }
}

/**
 * Returns an eventName object if it exists, false if it doesn't.
 */
function getEventName(namespace, eventName) {

    if (!_.every([namespace, eventName], isValidName)) {
        return Promise.reject(new ApiError('Invalid namespace or event name', {
            statusCode : 400
        }));
    }

    return queryFor(namespace, eventName)
        .spread(buildEn);

    function buildEn(rows, fields) {

        if (rows.length === 0) {
            return false;
        }

        return rows[0];
    }
}

/**
 * Will define a namespace or return an existing one.
 */
function defineNamespace(namespace) {

    return getNamespace(namespace)
        .then(returnOrCreateNs);

    function returnOrCreateNs(namespaceObject) {
        if (namespaceObject) {
            namespaceObject.isNew = false;
            return namespaceObject;
        } else {
            return doDefineNamespace(namespace);
        }
    }
}

function doDefineNamespace(namespace) {

    return db.execute(
            'insert ignore into namespace (name) values (?)',
            namespace
        ).spread(returnResult);

    function returnResult() {
        return getNamespace(namespace)
            .then(attachNewFlag);
    }
}

/**
 * Will define an eventName or return an existing one.
 */
function defineEventName(namespace, eventName) {

    var nsObject;

    return getNamespace(namespace)
        .then(assertNsDef)
        .then(returnOrCreateEn);

    function assertNsDef(ns) {

        if (ns) {
            nsObject = ns;
            return getEventName(namespace, eventName);
        }

        throw new ApiError('Undefined namespace ' + namespace, {
            statusCode : 400
        });
    }

    function returnOrCreateEn(eventNameObject) {

        if (eventNameObject) {
            eventNameObject.isNew = false;
            return eventNameObject;
        }

        return doDefineEventName(nsObject, eventName);
    }
}

function doDefineEventName(ns, eventName) {

    return db.execute(
        'insert ignore into eventName (namespaceId, name) values (?, ?)',
        [ns.namespaceId, eventName]
    ).spread(returnResult);

    function returnResult() {
        return getEventName(ns.namespace, eventName)
            .then(attachNewFlag);
    }
}

function attachNewFlag(result) {
    result.isNew = true;
    return result;
}
