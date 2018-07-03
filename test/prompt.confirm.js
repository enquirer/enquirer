'use strict';

require('mocha');
const assert = require('assert');
const Confirm = require('../prompts/confirm');
let prompt;

class Prompt extends Confirm {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-confirm', function() {
  describe('options.value', () => {
    it('should not prompt when options.value is boolean true', () => {
      prompt = new Prompt({ message: 'foo', value: true });
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should not prompt when options.value is boolean false', () => {
      prompt = new Prompt({ message: 'foo', value: false });
      return prompt.run().then(answer => assert.equal(answer, false));
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should not use options.initial when options.value is defined', () => {
      prompt = new Prompt({ message: 'foo', initial: true, value: false });
      return prompt.run().then(answer => assert.equal(answer, false));
    });
  });

  describe('hint', () => {
    it('should show the correct hint based on options.initial', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      assert.equal(prompt.hint, 'Y/n');

      prompt = new Prompt({ message: 'foo', initial: false });
      assert.equal(prompt.hint, 'y/N');
    });
  });
});
