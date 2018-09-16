'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { nextTick } = support(assert);
const Invisible = require('../lib/prompts/invisible');
let prompt;

class Prompt extends Invisible {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('invisible prompt', function() {
  describe('options.value', () => {
    it('should use options.value without prompting', () => {
      prompt = new Prompt({
        message: 'prompt-invisible',
        value: 'woohooo!'
      });

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, 'woohooo!');
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without typing', () => {
      prompt = new Prompt({
        message: 'prompt-invisible',
        initial: 'woohooo!'
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, 'woohooo!');
        });
    });
  });

  describe('prompt.value', () => {
    it('should output the un-modified value', () => {
      prompt = new Prompt({ message: 'Enter some invisible text' });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress('f'));
        await nextTick(() => prompt.keypress('o'));
        await nextTick(() => prompt.keypress('o'));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'foo');
        });
    });
  });
});
