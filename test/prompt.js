'use strict';

require('mocha');
const colors = require('ansi-colors');
const assert = require('assert');
const PromptBase = require('../lib/prompt');
const { timeout } = require('./support')(assert);
let prompt;

class Prompt extends PromptBase {
  constructor(options = {}) {
    super({ ...options, show: false });
    this.value = this.options.value || this.options.initial;
  }
  render() {}
  skip() {
    if (this.options.value !== void 0) {
      this.value = this.options.value;
      return true;
    }
  }
}

describe('prompt-base', function() {
  describe('.keypress()', () => {
    it('should alert when an unrecognized keypress is entered', cb => {
      prompt = new Prompt({ message: 'Example prompt' });

      prompt.on('run', () => prompt.keypress('/'));
      prompt.on('alert', keypress => {
        assert.equal(keypress.action, null);
        cb();
      });

      prompt.run()
        .then(answer => {
          assert.equal(answer, 'CHOCOLATE');
        });
    });

    it('should emit a keypress for each character', cb => {
      prompt = new Prompt({ message: 'Example prompt' });
      const keypresses = [];

      prompt.on('keypress', (ch, key) => {
        keypresses.push(key.raw);
      });

      prompt.on('submit', () => {
        assert.deepEqual(keypresses, [1, 2, 3, 'a', 'b', 'c']);
        cb();
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress(1));
        await timeout(() => prompt.keypress(2));
        await timeout(() => prompt.keypress(3));
        await timeout(() => prompt.keypress('abc'));
        await timeout(() => prompt.submit());
      });

      prompt.run();
    });
  });

  describe('options.value', () => {
    it('should submit early when options.value is defined', () => {
      prompt = new Prompt({
        message: 'prompt',
        initial: 'woohooo!',
        value: 'foo'
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'foo');
        });
    });

    it('should use options.value when it is an empty string', () => {
      prompt = new Prompt({
        message: 'prompt',
        initial: 'woohooo!',
        value: ''
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, '');
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial', () => {
      prompt = new Prompt({
        message: 'prompt',
        initial: 'woohooo!'
      });

      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'woohooo!');
        });
    });
  });

  describe('options.message', () => {
    it('should set the `message` to use', () => {
      prompt = new Prompt({ message: 'Enter something' });
      assert.equal(prompt.options.message, 'Enter something');
    });
  });

  describe('options.validate', () => {
    it('should use a custom `validate` function', () => {
      let count = 0;

      prompt = new Prompt({
        message: 'prompt',
        value: 'foo',
        validate(value) {
          assert.equal(value, 'foo');
          count++;
          return true;
        }
      });

      return prompt.run().then(() => assert.equal(count, 1));
    });
  });

  describe('options.symbols', () => {
    it('should use custom symbols', () => {
      prompt = new Prompt({
        message: 'prompt',
        symbols: {
          indicator: 'X',
          check: 'ok',
          prefix: '?',
          separator: '|>'
        }
      });

      assert.equal(colors.unstyle(prompt.symbols.separator), '|>');
      assert.equal(colors.unstyle(prompt.symbols.indicator), 'X');
      assert.equal(colors.unstyle(prompt.symbols.prefix), '?');
    });
  });
});
