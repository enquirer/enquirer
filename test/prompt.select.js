'use strict';

require('mocha');
const assert = require('assert');
const { cyan } = require('ansi-colors');
const support = require('./support');
const { nextTick, expect } = support(assert);
const PromptSelect = require('../lib/prompts/select');
const symbols = require('../lib/style/symbols');
let prompt;

class Prompt extends PromptSelect {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-select', function() {
  describe('options.choices', () => {
    it('should set a list of choices', cb => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);

        assert.deepEqual(prompt.initial, []);
        assert.equal(prompt.longest, 4);
        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);
    });

    it.skip('should map choice.alias to prompt.aliases', cb => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A', alias: 'x' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD', alias: 'z' }
        ]
      });

      prompt.once('run', () => {
        assert.deepEqual(prompt.state.aliases, ['x', '', '', 'z']);
        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);
    });
  });

  describe('options.initial', () => {
    it('should use options.initial', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        selected: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        });
    });
  });

  describe('rendering', () => {
    it('should render a choice with the correct styles', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          const expected = cyan(symbols.pointer.on) + ' ' + cyan('A');
          assert.equal(prompt.renderChoice(prompt.choices[0], 0), expected);
          assert.equal(prompt.renderChoice(prompt.choices[1], 1), '  BB');
        });
    });

    it('should render a list of choices with the correct styles', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        const pointer = cyan(symbols.pointer.on);
        const expected = `\n${pointer} ${cyan('A')}\n  BB\n  CCC\n  DDDD`;
        const actual = prompt.renderChoices();
        assert.equal(actual, expected);
        prompt.submit();
      });

      return prompt.run();
    });
  });

  describe('key handling', () => {
    it('should handle submitting with the enter key', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ],
      });

      prompt.once('run', () => {
        prompt.keypress(null, { name: 'return' });
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'a');
        });
    });

    it('should handle moving up and down with the arrow keys', () => {
      const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
      const down = { sequence: '\u001b[B', name: 'down', code: '[B' };

      prompt = new Prompt({
        message: 'prompt-select',
        show: false,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, down)); // down to 'b'
        await nextTick(() => prompt.keypress(null, down)); // down to 'c'
        await nextTick(() => prompt.keypress(null, up)); // back up to 'b'
        await nextTick(() => prompt.submit());
      });

      return prompt.run().then(expect('b'));
    });

    it('should handle selecting using number keys', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        show: false,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(3));
        await nextTick(() => prompt.keypress(4));
        await nextTick(() => prompt.keypress(2));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        });
    });
  });
});
