'use strict';

var defineService = require('../defineService'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
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
            'name-space',
            '',
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
});

describe('The define module', function() {

    var define = localhost + '/define';

    describe('/', function() {

        var endpointRequest;
        beforeEach(function() {

            endpointRequest = request(define);
        });

        it('should be a standard API response', function(done) {

            endpointRequest.spread(
                function(res, body) {
                    return JSON.parse(body);
                }
            ).then(
                function(res) {

                    expect(res.success).toBe(true);
                    expect(res.data).toBeDefined();

                    done();
                }
            );
        });
    });

    describe('/:namespace', function() {

        it('should return false data if undefined', function(done) {

            request(define + '/sdlfkj').spread(
                function(res, body) {

                    expect(JSON.parse(body).data).toBe(false);
                    done();
                }
            );
        });

        it ('should give an array of eventName strings', function(done) {

            request(define + '/test').spread(
                function(res, body) {
                    var data = JSON.parse(body);

                    expect(data.data.eventNames instanceof Array).toBe(true);
                    expect(_.every(data.data.eventNames.map(_.isString)));
                    done();
                }
            );
        });
    });
});
