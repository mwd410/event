'use strict';

var isValidName = require('utils').isValidName,
    _ = require('lodash');

describe('#isValidName()', function() {

    var goodNames = [
        'namespace',
        'name_space',
        'name-space'
    ];

    it('should return true for good names', function() {

        expect(_.every(goodNames, isValidName)).toBe(true);
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

        expect(_.filter(badNames, isValidName).length).toBe(0);
    });
});
