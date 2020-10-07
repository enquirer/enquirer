import * as assert from 'assert';
import nodeShims from '../lib/shims/node.js';
import createStringPrompt from '../lib/types/string.js';

let prompt;

const StringPrompt = createStringPrompt(nodeShims);

describe('string prompt', function() {
  describe('class', () => {
    it('should expose static method for getting Prompt class', () => {
      class Foo extends StringPrompt {}

      class Bar extends Foo {}

      class Baz extends Bar {}

      assert.ok(Baz.Prompt === StringPrompt.Prompt);
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when submitted without changes', () => {
      prompt = new StringPrompt({ show: false, message: 'foo', initial: 'true' });
      prompt.on('run', () => prompt.submit());
      return prompt.run()
        .then(value => {
          assert.equal(value, 'true');
        });
    });

    it('should cast options.initial to a string', () => {
      prompt = new StringPrompt({ show: false, message: 'foo', initial: false });

      prompt.on('run', () => {
        prompt.submit(String(prompt.options.initial));
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, 'false');
        });
    });

    it('should not convert empty string to `undefined`', () => {
      prompt = new StringPrompt({ show: false, message: 'foo', initial: '' });

      prompt.on('run', () => {
        prompt.submit(prompt.options.initial);
      });

      return prompt.run()
        .then(value => {
          assert.equal(value, '');
        });
    });
  });

  describe('cursor position', () => {
    it('should update cursor position when the user types input', () => {
      let cursor = [];
      prompt = new StringPrompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('run', async() => {
        assert.equal(prompt.initial, 'green');
        await prompt.keypress('b');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('l');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('u');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('e');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('-');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('y');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('e');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('l');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('l');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('o');
        cursor.push(prompt.state.cursor);
        await prompt.keypress('w');
        cursor.push(prompt.state.cursor);
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.deepEqual(cursor, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          assert.equal(value, 'blue-yellow');
        });
    });

    it('should alert when invalid key combos are given', cb => {
      prompt = new StringPrompt({
        message: 'Favorite color?',
        initial: 'green',
        show: false
      });

      prompt.once('alert', async() => {
        await prompt.submit();
        cb();
      });

      prompt.once('run', async() => {
        await prompt.keypress('o', { ctrl: true });
      });

      prompt.run();
    });
  });
});
