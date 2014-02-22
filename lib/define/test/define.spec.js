'use strict';

var defineService = require('../defineService'),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    config = require('config')('test'),
    _ = require('lodash'),
    localhost = 'http://localhost:' + config.app.port;

describe('The define service', function() {

    describe('#getAll()', function() {

        var result = defineService.getAll();

        it('should return a promise', function() {

            expect(result instanceof Promise).toBe(true);
        });

        it('should contain an array of namespace strings', function(done) {

            result.then(function(data) {
                expect(data.namespaces instanceof Array).toBe(true);
                expect(_.every(data.namespaces.map(_.isString))).toBe(true);
                done();
            });
        });
    });

});

describe('The define module', function() {

    var define = localhost + '/define';

    function parseBody(res, body) {
        if (arguments.length === 1) {
            body = res[1];
        }

        body = JSON.parse(body);

        return body;
    }

    describe('GET /', function() {

        var endpointRequest;
        beforeEach(function() {

            endpointRequest = request.getAsync(define);
        });

        it('should be a standard API response', function(done) {

            endpointRequest.then(parseBody).then(
                function(res) {

                    expect(res.success).toBe(true);
                    expect(res.data).toBeDefined();

                    done();
                }
            );
        });
    });

    describe('GET /:namespace', function() {

        it('should return false data if undefined', function(done) {

            request.getAsync(define + '/sdlfkj').then(parseBody).then(
                function(result) {

                    expect(result.data).toBe(false);
                    done();
                }
            );
        });

        it ('should give an array of eventName strings', function(done) {

            request.getAsync(define + '/test').then(parseBody).then(
                function(data) {
                    expect(data.data.eventNames instanceof Array).toBe(true);
                    expect(_.every(data.data.eventNames.map(_.isString)));
                    expect(Object.keys(data.data)).toEqual(
                        ['namespace', 'eventNames', 'namespaceId']
                    );
                    done();
                }
            );
        });
    });

    describe('GET /:namespace/:eventName', function() {

        it('should return false data if undefined', function(done) {

            request.getAsync(define + '/test/ing')
                .then(parseBody)
                .then(function(result) {
                    expect(result.data.namespace).toBe('test');
                    expect(result.data.eventName).toBe('ing');
                    expect(Object.keys(result.data)).toEqual(
                        ['namespace', 'eventName', 'namespaceId', 'eventNameId']);
                    done();
                }
            );
        });
    });

    describe('POST /:namespace', function() {

        it('should return existing namespace', function(done) {

            request.postAsync(define + '/test').spread(
                function(response, result) {
                    result = JSON.parse(result);
                    expect(result.data).not.toBe(false);
                    expect(result.data.namespace).toBe('test');
                    expect(response.statusCode).toBe(200);
                    done();
                }
            );
        });
    });

    describe('POST /:namespace/:eventName', function() {

        it('should return existing event name', function(done) {

            request.postAsync(define + '/test/ing').spread(
                function(response, result) {
                    result = JSON.parse(result);
                    expect(result.data).not.toBe(false);
                    done();
                }
            );
        });
    });

    //TODO: Add case for new namespaces -- requires delete functionality.
});
