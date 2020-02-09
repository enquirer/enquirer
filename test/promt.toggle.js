'use strict';

require('mocha');
const assert = require('assert');
const Toggle = require('../lib/prompts/toggle');
const support = require('./support');
let prompt;

const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
const down = { sequence: '\u001b[B', name: 'down', code: '[B' };
const right = { sequence: '\u001b[C', name: 'right', code: '[C' };
const left = { sequence: '\u001b[D', name: 'left', code: '[D' };

class Prompt extends Toggle {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('toggle', function() {
  describe('options.initial', () => {
    it('should use options.initial when submitted', () => {
      prompt = new Prompt({
        message: 'prompt-toggle',
        initial: true
      });

      prompt.once('run', async() => await prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });
  });

  describe('key handling', () => {
    it('should handle toggling with the `space` key', () => {
      prompt = new Prompt({
        message: 'prompt-toggle'
      });

      prompt.once('run', async() => {
        await prompt.keypress(' ');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });

    it('should handle enabling and disabling with arrow keys', () => {
      prompt = new Prompt({ message: 'prompt-toggle' });
      return new Promise((resolve, reject) => {
        prompt.once('run', async() => {
          try {
            assert.equal(prompt.value, false);

            await prompt.keypress(null, up);
            assert.equal(prompt.value, true);

            await prompt.keypress(null, down);
            assert.equal(prompt.value, false);

            await prompt.keypress(null, right);
            assert.equal(prompt.value, true);

            await prompt.keypress(null, left);
            assert.equal(prompt.value, false);

            await prompt.submit();
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
      prompt = new Prompt({message: 'prompt-toggle'});

      return new Promise((resolve, reject) => {
        prompt.once('run', async() => {
          try {
            assert.equal(prompt.value, false);

            await prompt.keypress('1');
            assert.equal(prompt.value, true);

            await prompt.keypress('0');
            assert.equal(prompt.value, false);

            await prompt.keypress('y');
            assert.equal(prompt.value, true);

            await prompt.keypress('n');
            assert.equal(prompt.value, false);

            await prompt.submit();
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
