'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { nextTick, expect } = support(assert);
const { Toggle } = require('../lib/prompts');
let prompt;

class Prompt extends Toggle {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe.skip('prompt-toggle', function() {
  describe.skip('options.value', () => {
    it('should return early when options.value is defined', () => {
      prompt = new Prompt({
        message: 'prompt-toggle',
        value: false
      });

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, false);
        });
    });
  });

  describe.skip('options.initial', () => {
    it('should use options.initial when submitted', () => {
      prompt = new Prompt({
        message: 'prompt-toggle',
        initial: true
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, true);
        })
    });
  });

  describe.skip('key handling', () => {
    it('should handle toggling with the `space` key', () => {
      prompt = new Prompt({
        message: 'prompt-toggle'
      });

      prompt.once('run', async() => {
        await nextTick(() => prompt.keypress(' '));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });

    it('should handle enabling and disabling with the arrow keys with the arrow keys', () => {
      const up = { sequence: '\u001b[A', name: 'up', ctrl: false, meta: false, shift: false, code: '[A' };
      const down = { sequence: '\u001b[B', name: 'down', ctrl: false, meta: false, shift: false, code: '[B' };
      const right = { sequence: '\u001b[C', name: 'right', ctrl: false, meta: false, shift: false, code: '[C' };
      const left = { sequence: '\u001b[D', name: 'left', ctrl: false, meta: false, shift: false, code: '[D' };

      prompt = new Prompt({
        message: 'prompt-toggle'
      });

      return new Promise((resolve, reject) => {
        prompt.once('run', async() => {
          try {
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.keypress(null, up));
            assert.equal(prompt.value, true);

            await nextTick(() => prompt.keypress(null, down));
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.keypress(null, right));
            assert.equal(prompt.value, true);

            await nextTick(() => prompt.keypress(null, left));
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.submit());
          } catch (err) {
            reject(err);
          }
        });

        prompt.run()
          .then(answer => {
            assert.equal(answer, false);
            resolve();
          })
          .catch(reject);
      });
    });

    it('should handle toggling with special keys (0, 1, y, n)', () => {
      prompt = new Prompt({
        message: 'prompt-toggle'
      });

      return new Promise((resolve, reject) => {
        prompt.once('run', async() => {
          try {
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.keypress('1'));
            assert.equal(prompt.value, true);

            await nextTick(() => prompt.keypress('0'));
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.keypress('y'));
            assert.equal(prompt.value, true);

            await nextTick(() => prompt.keypress('n'));
            assert.equal(prompt.value, false);

            await nextTick(() => prompt.submit());
          } catch (err) {
            reject(err);
          }
        });

        prompt.run()
          .then(answer => {
            assert.equal(answer, false);
            resolve();
          })
          .catch(reject);
      });
    });
  });
});
