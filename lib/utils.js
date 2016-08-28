'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('clone-deep', 'clone');
require('co');
require('collection-visit', 'visit');
require('enquirer-question', 'Question');
require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('promise-reduce', 'reduce');
require('readline-ui', 'UI');
require = fn;

function* generator() {
  yield null;
}

utils.isGeneratorFunction = function(obj) {
  return obj && obj.constructor === generator.constructor;
};

/**
 * Normalize functions to generators.
 * @param {Function} `fn`
 * @returns {Function} Run `fn` and return a promise.
 */

utils.wrap = function(fn) {
  if (utils.isGeneratorFunction(fn)) {
    return co.wrap(fn);
  } else {
    return co.wrap(function* () {
      return yield Promise.resolve(fn.apply(this, arguments));
    });
  }
};

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
