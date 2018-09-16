'use strict';

require('mocha');
const assert = require('assert');
const BooleanPrompt = require('../lib/types/boolean');
let prompt;

class Prompt extends BooleanPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('boolean prompt', function() {
  describe('options.value', () => {
    it('should not prompt when options.value is boolean true', () => {
      prompt = new Prompt({ message: 'foo', value: true });
      return prompt.run().then(answer => assert(answer === true));
    });

    it('should not prompt when options.value is boolean false', () => {
      prompt = new Prompt({ message: 'foo', value: false });
      return prompt.run().then(answer => assert(answer === false));
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert(answer === true));
    });

    it('should not use options.initial when options.value is defined', () => {
      prompt = new Prompt({ message: 'foo', initial: true, value: false });
      return prompt.run().then(answer => assert(answer === false));
    });
  });
});
