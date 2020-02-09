'use strict';

require('mocha');
const colors = require('ansi-colors');
const assert = require('assert');
const BooleanPrompt = require('../lib/types/boolean');
let prompt;

class Prompt extends BooleanPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('boolean prompt', function() {
  describe('options.initial', () => {
    it('should use options.initial when true', () => {
      prompt = new Prompt({ message: 'foo', initial: true });
      prompt.once('run', () => prompt.submit());
      return prompt.run().then(answer => assert.equal(answer, true));
    });

    it('should use options.initial when false', () => {
      prompt = new Prompt({ message: 'foo', initial: false });
      prompt.once('run', () => prompt.submit());
      return prompt.run()
        .then(answer => {
          assert.equal(answer, false);
        });
    });

    it('should call options.initial when a function', () => {
      prompt = new Prompt({
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
      prompt = new Prompt({
        message: 'foo',
        async initial() {
          return new Promise(resolve => {
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
      let buffer;

      prompt = new Prompt({
        message: 'boolean',
        hint: 'This is a hint'
      });

      prompt.once('run', async() => {
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
      let buffer;

      prompt = new Prompt({
        message: 'This is a hint',
        hint: 'This is a hint'
      });

      prompt.once('run', async() => {
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
      let buffer;

      prompt = new Prompt({
        message: 'boolean',
        hint
      });

      prompt.once('run', async() => {
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
      prompt = new Prompt({
        message: 'boolean'
      });

      prompt.once('alert', cb);

      prompt.once('run', async() => {
        await prompt.keypress('a');
      });

      prompt.run();
    });
  });
});
