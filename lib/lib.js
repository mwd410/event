'use strict';

/**
 * Each module is an express app, and so can be mounted with app.use
 */
module.exports = function(app) {

    // Users only have to create small applications which can be either npm install'd,
    // or they could be git modules. They could also fork this boilerplate.

    console.log('lib');
    app.use('/ping', require('./ping'));
};
