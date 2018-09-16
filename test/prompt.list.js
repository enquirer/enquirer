'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { timeout, press } = support(assert);
const SplitPrompt = require('../lib/prompts/list');
let prompt;

class Prompt extends SplitPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-list', function() {
  describe('options.value', () => {
    it('should return early when options.value is defined', () => {
      prompt = new Prompt({
        message: 'Enter a list of words',
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
        message: 'Enter a list of words',
        value: ''
      });

      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, []);
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when no other value is entered', () => {
      prompt = new Prompt({ message: 'Enter comma-separated values', initial: 'a, b, c' });

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
        message: 'Enter dot-separated values',
        separator: /\. */,
        value: 'a.b.c'
      });

      return prompt.run()
        .then(function(answer) {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });

  describe('usage', () => {
    it('should get a list of keywords', () => {
      prompt = new Prompt({ message: 'Enter a list of comma separated keywords:' });
      prompt.once('run', async() => {
        await press(prompt, 'prompt, cli, enquirer, commandline');
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['prompt', 'cli', 'enquirer', 'commandline']);
        });
    });

    it('should get a list of email address', () => {
      prompt = new Prompt({
        message: 'Enter email address either separated by a comma (,) or semicolon (;):',
        separator: /[,;]/,
        format(value) {
          return value.filter(Boolean);
        }
      });

      prompt.once('run', async() => {
        await press(prompt, 'brian.woodward@gmail.com;doowb@example.com,jon@example.com;');
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['brian.woodward@gmail.com', 'doowb@example.com', 'jon@example.com']);
        });
    });
  });
});
