'use strict';

require('mocha');
const assert = require('assert');
const colors = require('ansi-colors');
const support = require('./support');
const { nextTick, expect } = support(assert);
const Radio = require('../recipes/radio');
const down = { sequence: '\u001b[B', name: 'down', code: '[B' };
const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
let prompt;

class Prompt extends Radio {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-radio', function() {
  describe('options.choices', () => {
    it('should set a list of choices', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.has(prompt.choices, [
        { name: 'a', message: 'A', enabled: false },
        { name: 'b', message: 'BB', enabled: false },
        { name: 'c', message: 'CCC', enabled: false },
        { name: 'd', message: 'DDDD', enabled: false }
      ]);

      assert.equal(prompt.initial, void 0);
    });

    it('should map aliases to prompt.aliases', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { name: 'a', alias: 'a', message: 'A' },
          { name: 'b', alias: 'b', message: 'BB' },
          { name: 'c', alias: 'c', message: 'CCC' },
          { name: 'd', alias: 'd', message: 'DDDD' }
        ]
      });

      assert(Array.isArray(prompt.choices));
      assert.deepEqual(prompt.aliases, ['a', 'b', 'c', 'd']);
    });
  });

  describe('options.initial', () => {
    it('should not use initial value when answer is given', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        initial: 2,
        value: 'b',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      return prompt.run().then(answer => assert.equal(answer, 'b'))
    });

    it('should use initial answer when answer is empty string', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        initial: 2,
        value: '',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      return prompt.run().then(answer => assert.equal(answer, 'c'));
    });

    it('should use initial answer when answer is undefined', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      process.nextTick(() => prompt.submit());

      return prompt.run().then(answer => assert.equal(answer, 'c'));
    });
  });

  describe('rendering', () => {
    it('should render an indicator with the correct styles', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.indicator(prompt.choices[0]), '◯ ');
      assert.equal(prompt.indicator(prompt.choices[1]), '◯ ');
    });

    it('should render a choice with the correct styles', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A', enabled: true },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      const pointer = colors.cyan(prompt.style.symbols.pointer) + colors.green('◉');
      assert.equal(prompt.renderChoice(prompt.choices[0], 0), `${pointer} A`);
      assert.equal(prompt.renderChoice(prompt.choices[1], 1), ' ◯ BB');
    });

    it('should render a list of choices with the correct styles', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A', enabled: true },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      const key = colors.cyan.underline('a');
      const pointer = colors.cyan(prompt.style.symbols.pointer) + colors.green('◉');
      const actual = prompt.renderChoices();
      assert.equal(actual, `\n${pointer} A\n ◯ BB\n ◯ CCC\n ◯ DDDD`);
    });
  });

  describe('key handling', () => {
    it('should handle toggling a selection with the `space` key', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
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
        await nextTick(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, 'b'));
    });

    it('should handle moving up and down with the arrow keys', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        // down to 'b'
        await nextTick(() => prompt.keypress(null, down));
        // down to 'c'
        await nextTick(() => prompt.keypress(null, down));
        // back up to 'b'
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(' '));
        await nextTick(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, 'b'));
    });

    it('should handle selecting using number keys', () => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(3));
        await nextTick(() => prompt.keypress(4));
        await nextTick(() => prompt.keypress(2));
        await nextTick(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, 'c'));
    });
  });
});
