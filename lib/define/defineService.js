'use strict';

var db = require('db'),
    Promise = require('bluebird');

var invalidNameRegex = /[^-_a-z]|^.$|^.{17,}$|^[^a-z]|[^a-z]$/;

function isValidName(name) {
    return !invalidNameRegex.test(name);
}

exports.getAll = function() {

    return db.pool.getConnectionAsync().then(
        function(connection) {

            return connection.queryOnce('select * from namespace');
        }
    ).spread(
        function(namespaces) {
            return namespaces.reduce(function(result, namespace) {
                result.namespaces.push(namespace.name);
                return result;
            }, {namespaces : []});
        }
    );
};

exports.getNamespace = function(namespace) {

    if (!isValidName(namespace)) {
        return Promise.reject('Invalid name.');
    }

    return db.pool.getConnectionAsync().then(
        function(connection) {
            return connection.queryOnce(
                'select ns.name, ' +
                'en.name as eventName from namespace ns ' +
                'join eventName en ' +
                'on en.namespaceId = ns.id ' +
                'where ns.name = ?', namespace
            );
        }
    ).spread(
        function(rows, fields) {
            if (rows.length === 0) {
                return false;
            }

            return rows.reduce(function(result, row) {
                result.namespace = row.name;
                if (row.eventName) {
                    result.eventNames.push(row.eventName);
                }
                return result;
            }, {eventNames : []});
        }
    );
};
