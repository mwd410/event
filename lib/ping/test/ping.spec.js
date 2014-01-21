'use strict';

var request = require('request'),
    ping = require('ping'),
    config = require('config')('test');

describe('The ping module', function() {

    it('should pong', function(done) {

        request('http://localhost:' + config.port + '/ping', function(err, res, body) {
            expect(body).toBe('pong');
            done();
        });
    });
});
