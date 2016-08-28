'use strict';

require('mocha');
var assert = require('assert');
var Enquirer = require('..');

describe('Enquirer', function() {
  it('should export a function', function() {
    assert.equal(typeof Enquirer, 'function');
  });

  it('should instantiate', function() {
    var enquirer = new Enquirer();
    assert(enquirer);
    assert.equal(typeof enquirer, 'object');
    assert(enquirer instanceof Enquirer);
  });
});
