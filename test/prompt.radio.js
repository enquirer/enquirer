'use strict';

require('mocha');
const assert = require('assert');
const colors = require('ansi-colors');
const { cyan, green } = colors;
const support = require('./support');
const { immediate } = support(assert);
const Radio = require('../lib/prompts/radio');
const down = { sequence: '\u001b[B', name: 'down', code: '[B' };
const up = { sequence: '\u001b[A', name: 'up', code: '[A' };
let prompt;

class Prompt extends Radio {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('radio', function() {
  describe('.renderChoice', () => {
    it('should support custom options.renderChoice function', cb => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      let renderChoice = prompt.renderChoice.bind(prompt);
      prompt.renderChoice = (choice, i) => {
        return renderChoice(choice, i) + ' ' + (choice.enabled ? 'foo' : 'bar');
      };

      prompt.once('run', async () => {
        const radio = cyan(prompt.symbols.pointer) + green('◉');
        const actual = await prompt.renderChoices();
        const expected = `\n${radio} A foo\n ◯ BB bar\n ◯ CCC bar\n ◯ DDDD bar`;
        assert.equal(actual, expected);
        cb();
      });

      prompt.run().catch(cb);;
    });
  });

  describe('options.choices', () => {
    it('should set a list of choices', cb => {
      prompt = new Prompt({
        message: 'prompt-radio',
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

        assert.equal(prompt.initial, 0);
        cb();
      });

      prompt.run().catch(cb);
    });
  });

  describe('options.initial', () => {
    it('should use options.initial', cb => {
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

      prompt.once('run', () => {
        assert.equal(prompt.initial, 2);
        cb();
      });

      prompt.run().then(answer => assert.equal(answer, 'c')).catch(cb);
    });
  });

  describe('rendering', () => {
    it('should render an indicator with the correct styles', cb => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.indicator(prompt.choices[0]), green(prompt.symbols.radio.on));
        assert.equal(prompt.indicator(prompt.choices[1]), prompt.symbols.radio.off);
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should render a choice with the correct styles', cb => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A', enabled: true },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        const pointer = cyan(prompt.symbols.pointer) + green(prompt.symbols.radio.on);
        assert.equal(prompt.renderChoice(prompt.choices[0], 0), `${pointer} A`);
        assert.equal(prompt.renderChoice(prompt.choices[1], 1), ' ◯ BB');
        cb();
      });

      prompt.run().catch(cb);;
    });

    it('should render a list of choices with the correct styles', cb => {
      prompt = new Prompt({
        message: 'prompt-radio',
        choices: [
          { value: 'a', message: 'A', enabled: true },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        const pointer = cyan(prompt.symbols.pointer) + green('◉');
        const actual = await prompt.renderChoices();
        assert.equal(actual, `\n${pointer} A\n ◯ BB\n ◯ CCC\n ◯ DDDD`);
        cb();
      });

      prompt.run().catch(cb);;
    });
  });

  describe('keypresses', () => {
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

      prompt.once('run', async() => {
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
        await prompt.submit();
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

      prompt.once('run', async() => {
        // down to 'b'
        await immediate(() => prompt.keypress(null, down));
        // down to 'c'
        await immediate(() => prompt.keypress(null, down));
        // back up to 'b'
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(' '));
        await immediate(() => prompt.submit());
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

      prompt.once('run', async() => {
        await immediate(() => prompt.keypress(3));
        await immediate(() => prompt.keypress(4));
        await immediate(() => prompt.keypress(2));
        await immediate(() => prompt.submit());
      });

      return prompt.run().then(answer => assert.equal(answer, 'c'));
    });
  });
});
