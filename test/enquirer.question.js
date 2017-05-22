'use strict';

require('mocha');
var assert = require('assert');
var Enquirer = require('..');
var enquirer;

describe('enquirer.question', function() {
  beforeEach(function() {
    enquirer = new Enquirer();
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      enquirer.question(5);
    });
  });
});
