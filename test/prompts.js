'use strict';

require('mocha');
const assert = require('assert');
const prompts = require('../lib/prompts');
const types = require('../lib/types');

describe('prompts', function() {
  it('should export prompts', () => {
    assert.equal(typeof prompts.AutoComplete, 'function');
    assert.equal(typeof prompts.Confirm, 'function');
    assert.equal(typeof prompts.Input, 'function');
    assert.equal(typeof prompts.Invisible, 'function');
    assert.equal(typeof prompts.List, 'function');
    assert.equal(typeof prompts.MultiSelect, 'function');
    assert.equal(typeof prompts.Number, 'function');
    assert.equal(typeof prompts.Password, 'function');
    assert.equal(typeof prompts.Select, 'function');
    assert.equal(typeof prompts.Text, 'function');
  });

  it('should export types', () => {
    assert.equal(typeof types.ArrayPrompt, 'function');
    assert.equal(typeof types.BooleanPrompt, 'function');
    assert.equal(typeof types.DatePrompt, 'function');
    assert.equal(typeof types.NumberPrompt, 'function');
    assert.equal(typeof types.StringPrompt, 'function');
  });
});
