'use strict';

require('mocha');
const fs = require('fs');
const assert = require('assert');
const colors = require('ansi-colors');
const support = require('./support');
const { timeout, nextTick, expect } = support(assert);
const MultiSelect = require('../lib/prompts/multiselect');
let prompt;

class Prompt extends MultiSelect {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('multiselect prompt', function() {
  describe('options.choices', () => {
    it('should set a list of choices', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);
        cb();
      });

      prompt.run().catch(cb);
    });
  });

  describe('options.initial', () => {
    it('should support optoins.initial', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', () => {
        assert.equal(prompt.initial, 2);
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should use options.initial by default', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['c']);
        });
    });

    it('should use initial answer when answer is undefined', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['c']);
        });
    });
  });

  describe('rendering', () => {
    it('should render a choice with the correct styles', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'foo' },
          { value: 'b', message: 'bar' },
          { value: 'c', message: 'baz' },
          { value: 'd', message: 'qux' }
        ]
      });

      prompt.on('run', () => {
        assert(Array.isArray(prompt.choices));
        const key = colors.cyan.underline('foo');
        const pointer = colors.dim.gray(prompt.symbols.check);
        assert.equal(prompt.renderChoice(prompt.choices[0], 0), `${pointer} ${key}`);
        assert.equal(prompt.renderChoice(prompt.choices[1], 1), `${pointer} bar`);
        cb();
      });

      prompt.run().catch(cb);
    });
  });

  describe('key handling', () => {
    const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
    const down = { sequence: '\u001b[B', name: 'down', code: '[B' };

    it('should handle toggling a selection with the `space` key', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, down));
        await nextTick(() => prompt.keypress(' '));
        await nextTick(() => prompt.keypress(null, down));
        await nextTick(() => prompt.keypress(' '));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['b', 'c']);
        });
    });

    it('should handle moving up and down with the arrow keys', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        // unselect 'a' TODO: figure out if initial should be 0 by default or not
        await nextTick(() => prompt.keypress(' '));

        // down to 'b'
        await nextTick(() => prompt.keypress(null, down));
        // down to 'c'
        await nextTick(() => prompt.keypress(null, down));
        // back up to 'b'
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(' '));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b']);
        });
    });

    it('should handle selecting using number keys', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 1,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(2));
        await nextTick(() => prompt.keypress(3));
        await nextTick(() => prompt.keypress(1));
        await nextTick(() => prompt.keypress(1));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['b', 'c', 'd']);
        });
    });

    it('should handle selecting all using <a>', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress('a'));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b', 'c', 'd']);
        });
    });

    it('should handle inverting the selection using <i>', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(0));
        await nextTick(() => prompt.keypress(1));
        await nextTick(() => prompt.keypress(3));
        await nextTick(() => prompt.keypress('i'));
        await nextTick(() => prompt.submit());
      });

      return prompt.run().then(expect(['c']));
    });
  });
});
