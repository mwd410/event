'use strict';

var config = require('config')().db,
    mysql = require('mysql'),
    Promise = require('bluebird');

var db = module.exports = {};

db.pool = Promise.promisifyAll(mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
}));

var originalGetConnectionAsync = db.pool.getConnectionAsync;
db.pool.getConnectionAsync = function() {
    return originalGetConnectionAsync.apply(db.pool, arguments).then(
        function(connection) {
            return Promise.promisifyAll(connection);
        }
    );
};
