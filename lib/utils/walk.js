'use strict';

var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

var walk = module.exports = function(dir, fn) {

    if (typeof fn !== 'function') {
        fn = function() {};
    }

    return fs.readdirAsync(dir).reduce(
        function(total, file) {
            var path = dir + '/' + file;

            return fs.statAsync(path).then(function(stat) {

                var result = fn(null, path, stat);

                if (!stat.isDirectory() && result !== false) {
                    total[file] = function(toRequire) {
                        if (toRequire) {
                            return require(path);
                        } else {
                            return fs.readFileSync(path);
                        }
                    };
                } else if (result !== false) {

                    return walk(path, fn).then(function (walkResult) {
                        total[file] = walkResult;
                        return total;
                    });
                }

                return total;
            });
        }, {}).catch(fn);
};
