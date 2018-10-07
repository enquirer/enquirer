'use strict';

require('mocha');
const assert = require('assert');
const Prompt = require('../lib/prompts/input');
const { kepresses } = require('./support')(assert);
let prompt;

describe('Input Prompt', function() {
  describe('options.initial', () => {
    it('should use value defined on options.initial', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'blue',
        show: false
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(value => {
          assert.equal(value, 'blue');
        });
    });
  });

  describe('keypresses', () => {
    it('should take user input', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('l');
        await prompt.keypress('u');
        await prompt.keypress('e');
        await prompt.keypress('-');
        await prompt.keypress('y');
        await prompt.keypress('e');
        await prompt.keypress('l');
        await prompt.keypress('l');
        await prompt.keypress('o');
        await prompt.keypress('w');
        prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'blue-yellow');
        });
    });

    it('should support backspace', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('l');
        await prompt.keypress('u');
        await prompt.keypress('e');
        await prompt.keypress('-');
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress('y');
        await prompt.keypress('e');
        await prompt.keypress('l');
        await prompt.keypress('l');
        await prompt.keypress('o');
        await prompt.keypress('w');
        prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'yellow');
        });
    });

    it('should reset to initial value', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('l');
        await prompt.keypress('u');
        await prompt.keypress('e');
        await prompt.keypress('-');
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress('y');
        await prompt.keypress('e');
        await prompt.keypress('l');
        await prompt.keypress('l');
        await prompt.keypress('o');
        await prompt.keypress('w');
        await prompt.keypress('g', { ctrl: true }); //<= reset
        prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'green');
        });
    });
  });
});
