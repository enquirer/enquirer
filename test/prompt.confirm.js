'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { timeout } = support(assert);
const { Confirm } = require('../lib/prompts');
let prompt;

class Prompt extends Confirm {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('confirm', function() {
  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });
  });

  describe('hint', () => {
    it('should show the correct hint based on options.initial', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      assert.equal(prompt.hint, '(Y/n)');

      prompt = new Prompt({ message: 'foo', initial: false });
      assert.equal(prompt.hint, '(y/N)');
    });
  });

  describe('usage', () => {
    it('should confirm with an affirmative', () => {
      prompt = new Prompt({ message: 'Are you sure?' });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should confirm with a negative', () => {
      prompt = new Prompt({ message: 'Are you sure?' });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('n'));
        await timeout(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, false));
    });
  });
});
