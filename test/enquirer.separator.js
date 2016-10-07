'use strict';

require('mocha');
var assert = require('assert');
var stripColor = require('strip-color');
var Enquirer = require('..');
var enquirer;

describe('Separator', function() {
  beforeEach(function() {
    enquirer = new Enquirer();
  });

  it('should set a default', function() {
    var sep = enquirer.separator();
    assert.equal(stripColor(sep.toString()), '────────');
  });

  it('should set user input as separator', function() {
    var sep = enquirer.separator('foo bar');
    assert.equal(stripColor(sep.toString()), 'foo bar');
  });

  it('instances should be stringified when appended to a string', function() {
    var sep = enquirer.separator('foo bar');
    assert.equal(stripColor(String(sep)), 'foo bar');
  });

  it('should expose a helper function to check for separator', function() {
    assert(Enquirer.Separator.exclude({}));
    assert(!Enquirer.Separator.exclude(enquirer.separator()));
  });

  it('give the type \'separator\' to its object', function() {
    var sep = enquirer.separator();
    assert.equal(sep.type, 'separator');
  });
});
