'use strict';

var deepApply = require('utils').deepApply;

describe('Utils#deepApply', function() {

    it('should apply all secondary settings to the base object', function() {

        var base = {
            foo : 'bar',
            baz : 'hello'
        };
        var secondary = {
            foo : 3,
            etc : true
        };

        deepApply(base, secondary);

        expect(base.foo).toBe(3);
        expect(base.baz).toBe('hello');
        expect(base.etc).toBe(true);
    });

    it('should deep-override settings, leaving others in-tact', function() {

        var base = {
            foo : {
                bar : 0,
                baz : 1,
                etc : {
                    attr : 'val'
                }
            }
        };
        var secondary = {
            foo   : {
                bar     : true,
                hello   : 'world',
                goodbye : {
                    cruel : 'world'
                }
            },
            other : {
                object : 'literal'
            }
        };

        deepApply(base, secondary);

        expect(base.foo.bar).toBe(true);
        expect(base.foo.baz).toBe(1);
        expect(base.foo.hello).toBe('world');
        expect(base.foo.etc.attr).toBe('val');
        expect(base.other.object).toBe('literal');
        expect(base.foo.goodbye.cruel).toBe('world');
    });
});
