'use strict';

process.env.NODE_PATH += ':app:.';

var express = require('express'),
    app = module.exports = express();

// Define configuration.
app.set('config', require('./config')(app.get('env')));

// Define middleware
require('middleware')(app);

// Bootstrap application
require('lib')(app);

// Listen to our configured port
app.listen(app.get('config').port);

console.log('Application started on port ' + config.port);
