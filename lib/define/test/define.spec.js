'use strict';

var defineService = require('../defineService'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
    config = require('config')('test'),
    _ = require('lodash');

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

    describe('/', function() {

        var endpointRequest;
        beforeEach(function() {

            endpointRequest = request('http://localhost:' + config.app.port + '/define');
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
});
