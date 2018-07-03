'use strict';

require('mocha');
const assert = require('assert');
const ListPrompt = require('../prompts/list');
let prompt;

class Prompt extends ListPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-list', function() {
  describe('options.value', () => {
    it('should return early when options.value is defined', () => {
      prompt = new Prompt({
        message: 'prompt-list',
        initial: 'a, b, c',
        value: 'foo, bar, baz'
      });

      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, ['foo', 'bar', 'baz']);
        });
    });

    it('should use options.value when it is an empty string', () => {
      prompt = new Prompt({
        message: 'prompt-list',
        value: ''
      });

      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, []);
        })
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when no other value is entered', () => {
      prompt = new Prompt({ message: 'prompt-list', initial: 'a, b, c' });

      prompt.on('run', () => prompt.submit());
      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });

  describe('options.separator', () => {
    it('should use a custom separator', () => {
      prompt = new Prompt({
        message: 'prompt-list',
        separator: /\. */,
        value: 'a.b.c'
      });

      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });
});
