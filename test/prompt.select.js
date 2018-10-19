'use strict';

require('mocha');
const assert = require('assert');
const { cyan, dim, gray } = require('ansi-colors');
const support = require('./support');
const { nextTick, expect, immediate } = support(assert);
const PromptSelect = require('../lib/prompts/select');
let prompt;

const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
const down = { sequence: '\u001b[B', name: 'down', code: '[B' };

class Prompt extends PromptSelect {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('select', function() {
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
          { name: 'a', message: 'A', enabled: true },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);

        assert.deepEqual(prompt.initial, 0);
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
        initial: 2,
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
        .then(async answer => {
          let expected = cyan(prompt.symbols.pointer) + ' ' + cyan.underline('A');
          assert.equal(await prompt.renderChoice(prompt.choices[0], 0), expected);
          assert.equal(await prompt.renderChoice(prompt.choices[1], 1), '  BB');
        });
    });

    it('should render a choice hint', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB', hint: '(this is a hint)' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        let { state, symbols } = prompt;
        let pointer = cyan(symbols.pointer);
        let hint = dim('(this is a hint)');
        let expected = `${pointer} ${cyan.underline('A')}\n  BB ${hint}\n  CCC\n  DDDD`;
        let actual = await prompt.renderChoices();
        assert.equal(actual, expected);
        prompt.submit();
      });

      return prompt.run();
    });

    it('should render disabled choices', () => {
      prompt = new Prompt({
        message: 'prompt-select',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB', disabled: true },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        let { state, symbols } = prompt;
        let pointer = cyan(symbols.pointer);
        let expected = `${pointer} ${cyan.underline('A')}\n  ${gray('BB')}\n  CCC\n  DDDD`;
        let actual = await prompt.renderChoices();
        assert.equal(actual, expected);
        prompt.submit();
      });

      return prompt.run();
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

      prompt.once('run', async() => {
        let { state, symbols } = prompt;
        let pointer = cyan(symbols.pointer);
        let expected = `${pointer} ${cyan.underline('A')}\n  BB\n  CCC\n  DDDD`;
        let actual = await prompt.renderChoices();
        assert.equal(actual, expected);
        prompt.submit();
      });

      return prompt.run();
    });
  });

  describe('keypress events', () => {
    it('should handle submitting with <enter>', () => {
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
        await immediate(() => prompt.keypress(null, down)); // down to 'b'
        await immediate(() => prompt.keypress(null, down)); // down to 'c'
        await immediate(() => prompt.keypress(null, up)); // back up to 'b'
        await immediate(() => prompt.submit());
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
        await immediate(() => prompt.keypress(0));
        await immediate(() => prompt.keypress(3));
        await immediate(() => prompt.keypress(4));
        await immediate(() => prompt.keypress(2));
        await immediate(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        });
    });
  });
});
