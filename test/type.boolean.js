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
  describe('options.initial', () => {
    it('should use options.initial when true', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert(answer === true));
    });

    it('should use options.initial when false', () => {
      prompt = new Prompt({ message: 'foo', initial: false });
      prompt.once('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert(answer === false);
        });
    });
  });
});
