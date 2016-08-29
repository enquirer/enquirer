'use strict';

require('mocha');
var assert = require('assert');
var Enquirer = require('..');
var enquirer;

describe('enquirer.question', function() {
  beforeEach(function() {
    enquirer = new Enquirer();
  });

  it.skip('should throw an error when invalid args are passed', function(cb) {
    try {
      enquirer.question(5);
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
