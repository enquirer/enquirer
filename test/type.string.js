'use strict';

require('mocha');
const assert = require('assert');
const StringPrompt = require('../lib/types/string');
let prompt;

class Prompt extends StringPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
  validate() {
    const isValid = typeof this.state.value === 'string';
    if (!isValid && this.options.show === false) {
      return this.cancel(new Error('invalid initial value'));
    }
    return isValid;
  }
}

describe('string prompt', function() {
  describe('class', () => {
    it('should expose static method for getting StringPrompt class', () => {
      class Foo extends StringPrompt {}
      class Bar extends Foo {}
      class Baz extends Bar {}
      assert(Baz.StringPrompt === StringPrompt.StringPrompt);
    });
  });

  describe('options.validate', () => {
    it('should not prompt when options.value is a string', () => {
      prompt = new Prompt({ message: 'foo', value: 'true' });
      prompt.on('run', () => {
        prompt.submit(String(prompt.options.value));
      });
      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'true');
        });
    });

    it('should cast options.value to a string', () => {
      prompt = new Prompt({ message: 'foo', value: false });
      prompt.on('run', () => {
        prompt.submit(String(prompt.options.value));
      });
      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'false');
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: 'true' });
      prompt.on('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'true');
        });
    });

    it('should not use options.initial when options.value is defined', () => {
      prompt = new Prompt({ message: 'foo', initial: true, value: 'false' });
      prompt.on('run', () => {
        prompt.submit(String(prompt.options.value));
      });
      return prompt.run().then(answer => assert.equal(answer, 'false'));
    });
  });
});
