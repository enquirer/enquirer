'use strict';

require('mocha');
const assert = require('assert');
const Prompt = require('../lib/types/string');
let prompt;

describe('string prompt', function() {
  describe('class', () => {
    it('should expose static method for getting Prompt class', () => {
      class Foo extends Prompt {}
      class Bar extends Foo {}
      class Baz extends Bar {}
      assert(Baz.Prompt === Prompt.Prompt);
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new Prompt({ show: false, message: 'foo', initial: 'true' });
      prompt.on('run', () => prompt.submit());
      return prompt.run()
        .then(value => {
          assert.equal(value, 'true');
        });
    });

    it('should cast options.initial to a string', () => {
      prompt = new Prompt({ show: false, message: 'foo', initial: false });

      prompt.on('run', () => {
        prompt.submit(String(prompt.options.initial));
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'false');
        });
    });
  });

  describe('cursor position', () => {
    it('should update cursor position when the user types input', () => {
    });

    it('should ignore invalid values', () => {
    });
  });
});
