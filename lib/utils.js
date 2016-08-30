'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('choices-separator', 'Separator');
require('clone-deep', 'clone');
require('collection-visit', 'visit');
require('prompt-question', 'Question');
require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('promise-reduce', 'reduce');
require('readline-ui', 'UI');
require = fn;

/**
 * Return the given value unchanged
 */

utils.identity = function(val) {
  return val;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
