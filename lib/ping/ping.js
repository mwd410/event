'use strict';

var express = require('express'),
    ping = module.exports = express();

ping.get('/', function(req, res) {
    console.log('pong');
    res.send('pong');
});
