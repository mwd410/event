'use strict';

var config = require('config')().db,
    mysql = require('mysql'),
    Promise = require('bluebird');

var log = require('bunyan').createLogger({
    name : 'db'
});

var db = module.exports;

var pool = db.pool = Promise.promisifyAll(mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
}));

/**
 * This is executed anytime a new connection is created in the pool.
 * Use this to extend the functionality of connections or to hook into their
 * events.
 */
pool.on('connection', function(connection) {

    /**
     * Creates new functions for each function on the object. For any function
     * named xxx, this creates xxxAsync which returns a promise version of
     * the original node-style callback function.
     */
    connection = Promise.promisifyAll(connection);

    /**
     * Intended for use in .then() -- will release the connection and return
     * the query result.
     */
    connection.thenRelease = function(result) {
        connection.release();
        return result;
    };

    /**
     * Convenience method -- automatically releases the connection back to the
     * pool.
     */
    connection.queryOnce = function() {
        return connection.queryAsync.apply(connection, arguments)
            .then(connection.thenRelease);
    };

    connection.on('error', function(err) {
        log.error(err);
    });
});

/**
 * Convenience method. Returns a promise which is resolved after the query
 * returns and the connection is released back to the pool.
 */
exports.query = function query() {

    var args = arguments;
    return pool.getConnectionAsync().then(function(connection) {

        return connection.queryOnce.apply(connection, args);
    });
};

/**
 * Alias. We should use this any time we are doing a write so we can hook into
 * those queries later if need be.
 */
exports.execute = exports.query;

/**
 * Returns a promise containing the connection -- use if you want to query the
 * database multiple times in a row without releasing your connection.
 *
 * NOTE: You MUST call connection.release() after you're done if you use this!
 */
exports.getConnection = function getConnection() {

    return pool.getConnectionAsync();
};
