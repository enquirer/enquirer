'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { timeout } = support(assert);
const Confirm = require('../lib/prompts/confirm');
let prompt;

class Prompt extends Confirm {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('confirm', () => {
  describe('options.initial', () => {
    it('should use options.initial=true when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', async () => await prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should use options.initial=false when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: false });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, false));
    });

    it('should use options.initial="yes" when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: 'yes' });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should use options.initial="no" when submitted without changes', () => {
      prompt = new Prompt({ message: 'foo', initial: 'no' });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, false));
    });
  });

  describe('options.hint', () => {
    it('should show the correct hint based on options.initial', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      assert.equal(prompt.default, '(Y/n)');

      prompt = new Prompt({ message: 'foo', initial: false });
      assert.equal(prompt.default, '(y/N)');
    });
  });

  describe('options.default', () => {
    it('should support a custom default value', () => {
      prompt = new Prompt({
        name: 'really',
        message: 'Wirklich?',
        initial: 'y',
        default: '[Y(es)|N(o)]'
      });

      prompt.once('run', async() => {
        assert(prompt.state.buffer.includes('[Y(es)|N(o)]'));
        await prompt.keypress('y');
        assert(prompt.state.buffer.includes('[Y(es)|N(o)]'));
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });
  });

  describe('options.isTrue and options.isFalse', () => {
    it('should support custom functions for true and false', () => {
      prompt = new Prompt({
        name: 'really',
        message: 'Wirklich?',
        initial: 'j',
        default: '(J/n)',
        isTrue(input) {
          return String(input).toLowerCase() === 'j';
        },
        isFalse(input) {
          return String(input).toLowerCase() === 'n';
        }
      });

      prompt.once('run', async() => await prompt.keypress('j'));

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });
  });

  describe('keypresses', () => {

    it('should confirm with a truthy value', () => {
      prompt = new Prompt({ message: 'Are you sure?' });

      prompt.once('run', () => prompt.keypress('y'));

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });

    it('should confirm with a falsey value', () => {
      prompt = new Prompt({ message: 'Are you sure?' });

      prompt.once('run', async() => {
        await timeout(async() => prompt.keypress('n'));
        await timeout(async() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, false));
    });
  });
});
