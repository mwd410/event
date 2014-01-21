'use strict';

var configModule = require('config');

describe('The config module', function() {

    describe('#buildConfig', function() {

        var buildConfig = configModule.buildConfig;

        it('should apply all secondary settings to the base object', function() {

            var base = {
                foo : 'bar',
                baz : 'hello'
            };
            var secondary = {
                foo : 3,
                etc : true
            };

            buildConfig(base, secondary);

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

            buildConfig(base, secondary);

            expect(base.foo.bar).toBe(true);
            expect(base.foo.baz).toBe(1);
            expect(base.foo.hello).toBe('world');
            expect(base.foo.etc.attr).toBe('val');
            expect(base.other.object).toBe('literal');
            expect(base.foo.goodbye.cruel).toBe('world');
        });
    });
});
