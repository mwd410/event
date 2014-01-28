'use strict';

var db = require('db');

exports.getAll = function() {

    return db.pool.getConnectionAsync().then(
        function(connection) {

            return connection.queryAsync('select * from namespace');
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
