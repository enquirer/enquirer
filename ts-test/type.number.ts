import 'mocha'
import assert from 'assert'
import support from './support'
import { NumberPrompt, types } from '..'


const { immediate } = support(assert);

const reset = { name: 'g', ctrl: true };
const down = { name: 'down' };
const up = { name: 'up' };

class TestPrompt extends NumberPrompt {
  constructor(options: NumberPrompt.Question) {
    super({ ...options, show: false });
  }
}

describe('number prompt', function () {
  it('should be exposed under Enquirer and types', () => {
    assert.strictEqual(NumberPrompt, types.NumberPrompt);
  });

  describe('messages', () => {
    it('should allow using header/message/footer to config display', () => {
      new TestPrompt({
        header: '************************',
        message: 'Input the Numbers:',
        footer: '************************',
      })
    })
  })

  describe('options.min', () => {
    it('should set prompt.min with options.min', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        initial: 15,
        min: 10
      });

      assert.equal(prompt.min, 10);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 15);
        });
    });
  });

  describe('options.max', () => {
    it('should set prompt.max with options.max', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        max: 10,
        initial: 5
      });

      assert.equal(prompt.max, 10);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 5);
        });
    });
  });

  describe('options.float', () => {
    it('should allow floats when options.float is true', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        float: true,
        initial: 42.42
      });

      assert.equal(prompt.float, true);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 42.42);
        });
    });

    it('should round when options.float is false', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        float: false
      });

      assert.equal(prompt.float, false);

      prompt.once('run', async () => {
        await prompt.keypress('4');
        await assert.equal(prompt.input, '4');
        await prompt.keypress('2');
        await assert.equal(prompt.input, '42');
        await prompt.keypress('.');
        await assert.equal(prompt.input, '42.');
        await prompt.keypress('8');
        await assert.equal(prompt.input, '42.8');
        await prompt.keypress('2');
        await assert.equal(prompt.input, '42.82');
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(prompt.input, 42.82);
          assert.equal(prompt.value, 43);
          assert.equal(value, 43);
        });
    });
  });

  describe('options.minor', () => {
    it('should increment using options.minor', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        minor: 5
      });

      assert.equal(prompt.minor, 5);
      prompt.once('run', async () => {
        await prompt.keypress(null, up);
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 5);
        });
    });

    it('should return zero when submitted with no val and options.minor', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        minor: 5
      });

      assert.equal(prompt.minor, 5);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 0);
        });
    });

    it('should increment and decrement by options.step', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        initial: 37,
        minor: 5
      });

      assert.equal(prompt.minor, 5);

      prompt.once('run', async () => {
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, down));
        // TODO: fix type
        await immediate(() => prompt.submit() as any);
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47);
        });
    });

    it('should increment and decrement floats', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.2
      });

      assert.equal(prompt.minor, 5);

      prompt.once('run', async () => {
        await prompt.keypress(null, up);
        await prompt.keypress(null, up);
        await prompt.keypress(null, up);
        await prompt.keypress(null, down);
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47.2);
        });
    });

    it('should increment and decrement and round floats when disabled', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.6,
        float: false
      });

      assert.equal(prompt.minor, 5);

      prompt.once('run', async () => {
        await prompt.keypress(null, up);
        await prompt.keypress(null, up);
        await prompt.keypress(null, up);
        await prompt.keypress(null, down);
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 48);
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when 0', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        initial: 0
      });

      assert.equal(prompt.initial, 0);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 0);
        });
    });

    it('should use options.initial', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        initial: 42
      });

      assert.equal(prompt.initial, 42);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 42);
        });
    });
  });

  describe('prompt.reset', () => {
    it('should reset the prompt to options.initial', () => {
      const prompt = new TestPrompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.6
      });

      assert.equal(prompt.minor, 5);

      prompt.once('run', async () => {
        await prompt.keypress(null, up);
        await assert.equal(prompt.input, 42.6);
        await prompt.keypress(null, up);
        await assert.equal(prompt.input, 47.6);
        await prompt.keypress(null, up);
        await assert.equal(prompt.input, 52.6);
        await prompt.keypress(null, down);
        await assert.equal(prompt.input, 47.6);
        await prompt.keypress(null, reset);
        await assert.equal(prompt.input, '');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 37.6);
          assert.equal(prompt.value, 37.6);
        });
    });
  });

  describe('keypresses', () => {
    it('should alert when keypress is invalid', cb => {
      const prompt = new TestPrompt({
        message: 'number',
        initial: 100
      });

      prompt.once('alert', cb);

      prompt.once('run', async () => {
        await prompt.keypress('a');
      });

      prompt.run();
    });

    it('should support <next>', cb => {
      const prompt = new TestPrompt({
        message: 'number',
        initial: 100
      });

      prompt.once('alert', cb);

      prompt.once('run', async () => {
        await prompt.keypress(null, { name: 'tab' });
      });

      prompt.run()
        .then(value => {
          assert.equal(value, 100);
        });
    });
  });
});
