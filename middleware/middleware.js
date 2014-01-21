'use strict';

module.exports = function(app) {

    // Route every request through the authentication module
    app.use(require('./auth'));
    app.use(app.router);
};
