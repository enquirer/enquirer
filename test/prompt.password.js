import * as assert from 'assert';
import { nextTick } from './support/index.js';
import PasswordPrompt from '../lib/prompts/password.js';

let prompt;

class Prompt extends PasswordPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('password', function() {
  describe('options.initial', () => {
    it('should not print password when answer is submitted', cb => {
      prompt = new Prompt({
        message: 'What is your password?',
        initial: 'foobar'
      });

      prompt.once('run', () => prompt.submit());
      prompt.once('submit', () => {
        assert.ok(!/foobar/.test(prompt.state.buffer));
        assert.ok(!/[*]{6}/.test(prompt.state.buffer));
        assert.equal(prompt.value, 'foobar');
        cb();
      });

      prompt.run();
    });

    it('should use options.initial', () => {
      prompt = new Prompt({
        message: 'What is your password?',
        initial: 'woohooo!'
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'woohooo!');
        });
    });
  });

  describe('prompt.value', () => {
    it('should output the un-modified value', () => {
      prompt = new Prompt({ message: 'Enter your password', name: 'pw' });

      prompt.once('run', async() => {
        await nextTick(() => prompt.keypress('f'));
        await nextTick(() => prompt.keypress('o'));
        await nextTick(() => prompt.keypress('o'));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'foo');
        });
    });
  });
});
