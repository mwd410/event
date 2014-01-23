'use strict';

var express = require('express'),
    define = module.exports = express();

define.get('/:_namespace/:_identifier', isDefined);

function isDefined(req, res) {

}
