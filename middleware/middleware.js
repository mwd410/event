'use strict';

var express = require('express');

module.exports = function(app) {

    // Compress response data with gzip
    app.use(express.compress());

    // Parse request body, supporting POST w/ Content-Type: application/json
    app.use(express.bodyParser());

    // Parse the cookie header field into req.cookies
    app.use(express.cookieParser());

    // Authenticate the user
    app.use(require('./auth'));

    // Attach standardized API response convenience functions to req.api
    app.use(require('./apiResponse'));

    // Route request to appropriate end point
    app.use(app.router);
};
