'use strict';

require('mocha');
const assert = require('assert');
const colors = require('ansi-colors');
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

  describe('options.result', () => {
    it('should support options.result', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false,
        initial: 'blue',
        result(value) {
          return value.toUpperCase();
        }
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(value => {
          assert.equal(value, 'BLUE');
        });
    });
  });

  describe('options.hint', () => {
    it('should render a hint', () => {
      let buffer;
      prompt = new Prompt({
        message: 'Favorite color?',
        hint: 'Start typing',
        show: false
      });

      prompt.once('run', async () => {
        buffer = prompt.state.buffer;
        await prompt.submit();
      });

      return prompt.run()
        .then(() => {
          assert(/Start typing/.test(buffer));
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
        assert.equal(prompt.initial, 'green');
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
        await prompt.submit();
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

    it('should support <left>', () => {
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
        await prompt.keypress(null, { name: `left` });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
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
          assert.equal(value, 'yellowblue');
        });
    });

    it('should support <toggleCursor>', () => {
      let pos = [];
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('run', async() => {
        pos.push(prompt.state.cursor);
        await prompt.keypress('b');
        pos.push(prompt.state.cursor);
        await prompt.keypress('l');
        pos.push(prompt.state.cursor);
        await prompt.keypress('u');
        pos.push(prompt.state.cursor);
        await prompt.keypress('e');
        pos.push(prompt.state.cursor);
        await prompt.keypress('x', { ctrl: true });
        pos.push(prompt.state.cursor);
        await prompt.keypress('x', { ctrl: true });
        pos.push(prompt.state.cursor);
        await prompt.keypress('x', { ctrl: true });
        pos.push(prompt.state.cursor);
        await prompt.keypress('x', { ctrl: true });
        pos.push(prompt.state.cursor);
        prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.deepEqual(pos, [0, 1, 2, 3, 4, 0, 4, 0, 4]);
        });
    });

    it('should support <left>', () => {
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
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
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
          assert.equal(value, 'yellowblue');
        });
    });

    it('should support <right>', () => {
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
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('b', { ctrl: true });
        await prompt.keypress('f', { ctrl: true });
        await prompt.keypress('f', { ctrl: true });
        await prompt.keypress('f', { ctrl: true });
        await prompt.keypress('f', { ctrl: true });
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
          assert.equal(value, 'blueyellow');
        });
    });

    it('should alert when <left> is used and cursor is zero', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: `left` });
      });

      prompt.run();
    });

    it('should alert when <right> is used and cursor is at EOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: 'right' });
      });

      prompt.run();
    });

    it('should support <next>', () => {
      let input = [];
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'doowb',
        show: false
      });

      prompt.once('run', async() => {
        input.push(prompt.input);
        await prompt.keypress(null, { name: 'tab' });
        input.push(prompt.input);
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.deepEqual(input, ['', 'doowb']);
        });
    });

    it('should support <prev>', () => {
      let input = [];
      prompt = new Prompt({
        message: 'Favorite color?',
        initial: 'doowb',
        show: false
      });

      prompt.once('run', async() => {
        input.push(prompt.input);
        await prompt.keypress(null, { name: 'tab' });
        input.push(prompt.input);
        await prompt.keypress(null, { name: 'tab', shift: true });
        input.push(prompt.input);
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.deepEqual(input, ['', 'doowb', '']);
        });
    });

    it('should alert when <next> is used and cursor is at EOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: 'tab' });
      });

      prompt.run();
    });

    it('should alert when <prev> is used and cursor is at EOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: 'tab', shift: true });
      });

      prompt.run();
    });

    it('should alert when <backspace> is used and cursor is at BOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: 'backspace' });
      });

      prompt.run();
    });

    it('should support <deleteForward>', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'delete', fn: true });
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'ab');
        });
    });

    it('should alert when <deleteForward> is used and cursor is at BOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress(null, { name: 'delete', fn: true });
      });

      prompt.run();
    });

    it('should support <cutForward>', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress('d');
        await prompt.keypress('e');
        await prompt.keypress('f');
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress('k', { ctrl: true });
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'abc');
        });
    });

    it('should alert when <cutForward> is used at EOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress('k', { ctrl: true });
      });

      prompt.run();
    });

    it('should support <paste>', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress('d');
        await prompt.keypress('e');
        await prompt.keypress('f');
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress('k', { ctrl: true });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress('v', { ctrl: true });
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'defabc');
        });
    });

    it('should support <cutLeft>', () => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress('w', { ctrl: true });
        await prompt.keypress('d');
        await prompt.keypress('e');
        await prompt.keypress('f');
        await prompt.keypress('v', { ctrl: true });
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'defabc');
        });
    });

    it('should alert when <paste> is used and is empty', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress('v', { ctrl: true });
      });

      prompt.run();
    });

    it('should alert when <cutLeft> is used at BOS', cb => {
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('alert', async () => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress('w', { ctrl: true });
      });

      prompt.run();
    });

    it('should support <first>', () => {
      let pos;
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress('a', { ctrl: true });
        pos = prompt.state.cursor;
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(pos, 0);
        });
    });

    it('should support <last>', () => {
      let pos;
      prompt = new Prompt({
        message: 'Favorite color?',
        show: false
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress(null, { name: 'left' });
        await prompt.keypress('e', { ctrl: true });
        pos = prompt.state.cursor;
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(pos, 2);
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
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'green');
        });
    });
  });

  describe('options.multiline', () => {
    it('should allow return without submitting', () => {
      let buffer = [];

      prompt = new Prompt({ show: false, message: 'foo', multiline: true });
      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress(null, { name: 'return' });
        await prompt.keypress('b');
        await prompt.keypress(null, { name: 'return' });
        await prompt.keypress('c');
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'a\nb\nc');
        });
    });

    it('should submit when return is pressed twice in a row', () => {
      let buffer = [];

      prompt = new Prompt({ show: false, message: 'foo', multiline: true });
      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress(null, { name: 'return' });
        await prompt.keypress(null, { name: 'return' });
        await prompt.keypress('b');
        await prompt.keypress('c');
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'a\n');
        });
    });
  });
});
