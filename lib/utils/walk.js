'use strict';

var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

var walk = module.exports = function(dir, fn) {

    if (typeof fn !== 'function') {
        return Promise.reject('You must supply a callback function.');
    }

    return fs.readdirAsync(dir).reduce(
        function(total, file) {
            var path = dir + '/' + file;

            return fs.statAsync(path).then(function(stat) {

                var result = fn(null, path, stat);

                if (!stat.isDirectory()) {
                    total['.'].push(file);
                } else if (result !== false) {

                    return walk(path, fn).then(function (walkResult) {
                        total[file] = walkResult;
                        return total;
                    });
                }

                return total;
            });
        }, {'.' : []}).catch(fn);
};
