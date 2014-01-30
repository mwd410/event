'use strict';

var fs = require('fs');

var walkSync = module.exports = function(dir, fn) {

    if (typeof fn !== 'function') {
        fn = function() {};
    }

    return fs.readdirSync(dir).reduce(
        function(total, file) {
            var path = dir + '/' + file;

            var stat = fs.statSync(path);

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
                total[file] = walkSync(path, fn);
            }

            return total;
        },
        {}
    );
};
