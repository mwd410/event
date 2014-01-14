'use strict';

exports.appFiles = {
    js     : [ 'lib/**/*.js', 'config/**/*.js', '!**/*spec.js' ],
    jsunit : [ 'lib/**/test/*.spec.js', 'test/**/*.spec.js' ],
    jsall  : [ '<%= appFiles.js %>', '<%= appFiles.jsunit %>' ]
};


