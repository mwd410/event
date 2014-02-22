'use strict';

var invalidNameRegex = /[^-_a-z]|^.$|^.{17,}$|^[^a-z]|[^a-z]$/;

module.exports = function isValidName(name) {
    return !invalidNameRegex.test(name);
};
