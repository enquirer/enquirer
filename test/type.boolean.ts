import 'mocha'
import assert from 'assert'
import colors from 'ansi-colors'
import { types, Question } from '..'

require('mocha');
let prompt: TestPrompt;

class TestPrompt extends types.BooleanPrompt {
  constructor(options: Question<boolean>) {
    super({ ...options, show: false });
  }
}

describe('boolean prompt', function () {
  describe('options.initial', () => {
    it('should use options.initial when true', () => {
      prompt = new TestPrompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should use options.initial when false', () => {
      prompt = new TestPrompt({ message: 'foo', initial: false });
      prompt.once('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert.equal(answer, false);
        });
    });

    it('should call options.initial when a function', () => {
      prompt = new TestPrompt({
        message: 'foo',
        initial: () => true
      });

      prompt.once('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });

    it('should call options.initial when a async function', () => {
      prompt = new TestPrompt({
        message: 'foo',
        async initial() {
          return new Promise<boolean>(resolve => {
            setTimeout(() => resolve(true), 10);
          });
        }
      });
      prompt.once('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert.equal(answer, true);
        });
    });
  });

  describe('options.hint', () => {
    it('should render a hint', () => {
      let buffer: string;

      prompt = new TestPrompt({
        message: 'boolean',
        hint: 'This is a hint'
      });

      prompt.once('run', async () => {
        await prompt.render();
        buffer = prompt.state.buffer;
        await prompt.submit();
      });

      return prompt.run()
        .then(() => {
          assert(/This is a hint/.test(buffer));
        })
    });

    it('should not duplicate hint', () => {
      let buffer: string;

      prompt = new TestPrompt({
        message: 'This is a hint',
        hint: 'This is a hint'
      });

      prompt.once('run', async () => {
        await prompt.render();
        buffer = prompt.state.buffer;
        await prompt.submit();
      });

      return prompt.run()
        .then(() => {
          assert(/This is a hint/.test(buffer));
        })
    });

    it('should not recolor hint', () => {
      let hint = colors.yellow('This is a hint');
      let buffer: string;

      prompt = new TestPrompt({
        message: 'boolean',
        hint
      });

      prompt.once('run', async () => {
        await prompt.render();
        buffer = prompt.state.buffer;
        await prompt.submit();
      });

      return prompt.run()
        .then(() => {
          assert(buffer.includes(hint));
        })
    });
  });

  describe('keypresses', () => {
    it('should alert when keypress is invalid', cb => {
      prompt = new TestPrompt({
        message: 'boolean'
      });

      prompt.once('alert', cb);

      prompt.once('run', async () => {
        await prompt.keypress('a');
      });

      prompt.run();
    });
  });
});
