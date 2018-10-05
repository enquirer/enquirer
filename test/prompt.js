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
  }
  render() {}
}

describe('Prompt', function() {
  describe('.keypress()', () => {
    it('should emit alert when an unrecognized keypress is entered', cb => {
      prompt = new Prompt({ message: 'Example prompt' });

      prompt.once('run', () => prompt.keypress('/'));
      prompt.once('alert', keypress => {
        assert.equal(keypress.action, void 0);
        cb();
      });

      prompt.once('run', () => prompt.submit());

      prompt.run()
        .then(answer => {
          assert.equal(answer, void 0);
        });
    });

    it('should emit a keypress for each character', cb => {
      prompt = new Prompt({ message: 'Example prompt' });
      const keypresses = [];
      prompt.keypress =  async(str, key) => {
        if (str && str.length > 1) {
          return [...str].forEach(async ch => await prompt.keypress(ch, key));
        }
        Prompt.prototype.keypress.call(prompt, str, key);
      };

      const keypress = (ch, key) => {
        keypresses.push(key.raw);
      };

      prompt.on('keypress', keypress);

      prompt.once('submit', () => {
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

      prompt.run()
    });
  });

  describe('options.initial', () => {
    it('should use options.initial', () => {
      prompt = new Prompt({
        message: 'prompt',
        initial: 'woohooo!'
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'woohooo!');
        });
    });

    it('should submit from listener when options.initial is defined', () => {
      prompt = new Prompt({
        message: 'prompt',
        initial: 'woohooo!'
      });

      prompt.once('run', () => {
        prompt.submit(prompt.options.value);
      })

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

  describe('options.format', () => {
    it('should format the rendered value using a custom function', () => {
      let count = 0;
      let actual;

      prompt = new Prompt({
        message: 'prompt',
        value: 2,
        format(value) {
          if (typeof value === 'number') {
            return '$' + value.toFixed(2);
          }
          return value;
        }
      });

      let value = prompt.format(prompt.value);
      assert.equal(value, '$2.00');
    });
  });

  describe('options.transform', () => {
    it('should transform the returned value using a custom function', () => {
      let count = 0;

      prompt = new Prompt({
        message: 'prompt',
        value: 'foo',
        format(value) {
          return '1' + value + '2';
        }
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run().then(answer => {
        assert.equal(answer, '1foo2');
      });
    });
  });

  describe('options.validate', () => {
    it('should use a custom `validate` function', () => {
      let count = 0;

      prompt = new Prompt({
        message: 'prompt',
        value: 'bar',
        validate(value) {
          assert.equal(value, 'bar');
          count++;
          return true;
        }
      });

      prompt.once('run', () => prompt.submit());

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
