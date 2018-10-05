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
  describe('options.initial', () => {
    it('should use options.initial without typing', () => {
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

    it('should use options.initial after typing', () => {
      prompt = new Prompt({
        message: 'prompt-invisible',
        initial: 'woohooo!'
      });

      let backspace = { name: 'backspace' };

      prompt.on('run', async() => {
        await nextTick(async() => prompt.keypress('f'));
        await nextTick(async() => prompt.keypress('o'));
        await nextTick(async() => prompt.keypress('o'));
        await nextTick(async() => prompt.keypress(null, backspace));
        await nextTick(async() => prompt.keypress(null, backspace));
        await nextTick(async() => prompt.keypress(null, backspace));
        await nextTick(async() => prompt.submit());
      });

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
        await nextTick(async() => prompt.keypress('f'));
        await nextTick(async() => prompt.keypress('o'));
        await nextTick(async() => prompt.keypress('o'));
        await nextTick(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'foo');
        });
    });
  });
});
