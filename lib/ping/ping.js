'use strict';

var express = require('express'),
    ping = module.exports = express();

ping.get('/', function(req, res) {
    res.send('pong');
});
