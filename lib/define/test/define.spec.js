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

    describe('#isValidName()', function() {

        var goodNames = [
            'namespace',
            'name_space',
            'name-space'
        ];

        it('should return true for good names', function() {

            expect(_.every(goodNames, defineService.isValidName)).toBe(true);
        });

        var badNames = [
            '_namespace',
            'namespace_',
            'name.space',
            'n',
            'namespace1',
            'sdlkfjdslfkjdsflkjsdflkdsjffldksjf'
        ];

        it('should return false for bad names', function() {

            expect(_.filter(badNames, defineService.isValidName).length).toBe(0);
        });
    });

    describe('#getQueryArgs', function() {

        it('should just select * from namespace if no arguments passed', function() {

            var args = defineService.getQueryArgs();

            expect(args.length).toBe(1);
            expect(args[0]).toBe('select ns.name as namespace from namespace ns ');
        });

        it('should join on eventName if a namespace is passed', function() {
            var args = defineService.getQueryArgs('namespace');

            expect(args.length).toBe(2);
            expect(args[1]).toEqual(['namespace']);
            expect(args[0]).toBe('select ns.name as namespace,en.name as eventName ' +
                'from namespace ns left join eventName en on en.namespaceId = ns.id ' +
                'where ns.name = ? ');
        });

        it('should filter by eventName if passed', function() {

            var args = defineService.getQueryArgs('namespace', 'eventName');

            expect(args.length).toBe(2);
            expect(args[1]).toEqual(['namespace', 'eventName']);

            expect(args[0]).toBe('select ns.name as namespace,en.name as eventName ' +
                'from namespace ns left join eventName en on en.namespaceId = ns.id ' +
                'where ns.name = ? and en.name = ? ');
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
                    done();
                }
            );
        });
    });

    describe('GET /:namespace/:eventName', function() {

        it('should return false data if undefined', function(done) {

            request.getAsync(define + '/test/ing').then(parseBody).then(
                function(result) {
                    expect(result.data.namespace).toBe('test');
                    expect(result.data.eventName).toBe('ing');
                    expect(Object.keys(result.data)).toEqual(['namespace', 'eventName']);
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
                    expect(result.data.namespace).toBe('test');
                    expect(response.statusCode).toBe(200);
                    done();
                }
            );
        });
    });

    //TODO: Add case for new namespaces -- requires delete functionality.
});
