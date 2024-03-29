'use strict';

process.env.NODE_PATH += ':app:.';

var express = require('express'),
    app = module.exports = express();

var log = require('bunyan').createLogger({
    name : 'app'
});

// Define configuration.
var config = require('./config')(app.get('env'));

app.set('config', config);

// Define middleware
require('middleware')(app);

// Bootstrap application
require('lib')(app);

// Listen to our configured port
app.listen(app.get('config').app.port);

log.info('Application started on port ' + app.get('config').app.port);

