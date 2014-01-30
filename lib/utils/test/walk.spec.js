'use strict';

var walk = require('utils').walk,
    path = require('path');

describe('Utils#walk', function() {

    var testDir = __dirname + '/walk_test_do_not_change';

    it('should walk each directory recursively', function(done) {

        var files = [],
            dirs = [];

        walk(testDir, function(err, filePath, stat) {

            if (!stat.isDirectory()) {
                files.push(filePath);
            } else {
                dirs.push(filePath);
            }
        }).then(function(walkResult) {
                expect(files.map(path.basename)).toEqual(
                    ['a.txt', 'b.txt', 'd.txt', 'f.txt']);
                expect(dirs.map(path.basename)).toEqual(['c', 'e']);
                done();
            });
    });

    it('should not walk into directories when the callback returns false', function(done) {

        walk(testDir, function(err, filePath, stat) {

            if (path.basename(filePath) === 'c') {
                return false;
            }
        }).then(function(walkResult) {
                expect(walkResult.c).toBeUndefined();
                done();
            });
    });
});
