'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { timeout, keypresses } = support(assert);
const ListPrompt = require('../lib/prompts/list');
let prompt;

class Prompt extends ListPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('list', function() {
  describe('options.value', () => {
    it('should return early when options.value is defined', () => {
      prompt = new Prompt({
        message: 'Enter a list of words',
        initial: 'a, b, c',
        value: 'foo, bar, baz'
      });

      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['foo', 'bar', 'baz']);
        });
    });

    it('should use options.value when it is an empty string', () => {
      prompt = new Prompt({
        message: 'Enter a list of words',
        initial: ''
      });

      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, []);
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when no other value is entered', () => {
      prompt = new Prompt({ message: 'Enter comma-separated values', initial: 'a, b, c' });

      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });

  describe('options.separator', () => {
    it('should use a custom separator', () => {
      prompt = new Prompt({
        message: 'Enter dot-separated values',
        separator: /\. */,
        initial: 'a.b.c'
      });

      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });

  describe('usage', () => {
    it('should get a list of keywords', () => {
      prompt = new Prompt({ message: 'Enter a list of comma separated keywords:' });
      prompt.once('run', async() => {
        await keypresses(prompt, 'foo, bar, baz, qux');
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['foo', 'bar', 'baz', 'qux']);
        });
    });

    it('should get a list of email address', () => {
      prompt = new Prompt({
        message: 'Enter email address either separated by a comma (,) or semicolon (;):',
        separator: /[,;]/,
        result(list) {
          return list.filter(Boolean);
        }
      });

      prompt.once('run', async() => {
        prompt.state.input = 'brian.woodward@gmail.com;doowb@example.com,jon@example.com;';
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['brian.woodward@gmail.com', 'doowb@example.com', 'jon@example.com']);
        });
    });
  });
});
