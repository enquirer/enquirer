import assert from 'assert'
import { ArrayPrompt, types } from '..'
import support from './support'

const { timeout } = support(assert);

let prompt: ArrayPrompt;

class TestPrompt<T extends types.Answer> extends ArrayPrompt<T> {
  constructor(options: ArrayPrompt.Question<T>) {
    super({ ...options, show: false });
  }
  // override the render method to mute output
  render() { }
}

describe('array prompt', function () {
  describe('options.choices', () => {
    it('should support choices as objects', cb => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        multiple: true,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);
        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should support choices as strings', cb => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        choices: [
          'a',
          'b',
          'c',
          'd'
        ]
      });

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'a', enabled: false },
          { name: 'b', message: 'b', enabled: false },
          { name: 'c', message: 'c', enabled: false },
          { name: 'd', message: 'd', enabled: false }
        ]);

        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);;
    });

    it('should support choices as functions', cb => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        choices: [
          (() => 'a'),
          (() => 'b'),
          (() => 'c'),
          (() => 'd')
        ]
      });

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'a', enabled: false },
          { name: 'b', message: 'b', enabled: false },
          { name: 'c', message: 'c', enabled: false },
          { name: 'd', message: 'd', enabled: false }
        ]);

        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);;
    });

    it('should support choices as _async_ functions', cb => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        choices: [
          (timeout(async () => 'a', 5)),
          (timeout(async () => 'b', 5)),
          (timeout(async () => 'c', 5)),
          (timeout(async () => 'd', 5))
        ]
      });
      const x = (timeout(async () => 'a', 5))

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'a', enabled: false },
          { name: 'b', message: 'b', enabled: false },
          { name: 'c', message: 'c', enabled: false },
          { name: 'd', message: 'd', enabled: false }
        ]);

        prompt.submit();
        cb();
      });

      prompt.run().catch(cb);;
    });
  });

  describe('options.initial', () => {
    it('should take a number on options.initial', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        initial: 3,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 3);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'd');
        });
    });

    it('should take a string on options.initial', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        initial: 'c',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 2);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        });
    });

    it('should support options.initial as an array', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        initial: ['a', 'b', 'c'],
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 0);
        prompt.submit();
      });

      return prompt.run()
        .then(_ => {
          assert.deepEqual(prompt.enabled.map(ch => ch.value), ['A', 'BB', 'CCC']);
        });
    });

    it('should', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        initial: [1, 2],
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 0);
        prompt.submit();
      });

      return prompt.run()
        .then(_ => {
          assert.deepEqual(prompt.enabled.map(ch => ch.value), ['BB', 'CCC']);
        });
    })


    it('should support options.initial as an object', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        initial: { a: {}, b: {}, c: {} },
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 0);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(prompt.enabled.map(ch => ch.value), ['A', 'BB', 'CCC']);
        });
    });
  });

  describe('options.autofocus', () => {
    it('should take a number on options.autofocus', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        autofocus: 3,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 3);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'd');
        });
    });

    it('should take a string on options.autofocus', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        autofocus: 'b',
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'b');
        });
    });

    it('should use options.autofocus for index over options.initial', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        autofocus: 3,
        initial: 2,
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 3);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'd');
        });
    });

    it('should use options.autofocus when options.initial is an array', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        autofocus: 3,
        initial: ['a', 'b', 'c'],
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 3);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(prompt.enabled.map(ch => ch.value), ['A', 'BB', 'CCC']);
          assert.equal(answer, 'd');
        });
    });
  });

  describe('options.multiple', () => {
    it('should return an array when options.multiple is true', () => {
      prompt = new TestPrompt({
        message: 'prompt-array',
        autofocus: 3,
        multiple: true,
        initial: ['a', 'b', 'c'],
        choices: [
          { name: 'a', value: 'A' },
          { name: 'b', value: 'BB' },
          { name: 'c', value: 'CCC' },
          { name: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.index, 3);
        prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b', 'c']);
        });
    });
  });

  describe('keypresses', () => {
    const create = (
      options: { multiple?: boolean, limit?: number },
      onRun: (prompt: ArrayPrompt) => any) => {
      prompt = new TestPrompt({
        message: 'array prompt',
        autofocus: 3,
        multiple: true,
        initial: ['a', 'b'],
        choices: ['a', 'b', 'c', 'd'],
        ...options
      });

      prompt.once('run', async () => {
        onRun && await onRun(prompt);
        await prompt.submit();
      });

      return prompt.run();
    };

    describe('keypress > space', () => {
      it('should emit "alert" when options.multiple is not true', () => {
        let called = 0;
        return create({ multiple: false }, async prompt => {
          prompt.on('alert', () => (called++));
          await prompt.dispatch();
        })
          .then(answer => {
            assert.deepStrictEqual(called, 1);
            assert.deepStrictEqual(answer, 'd');
          });
      });
    });

    describe('keypress > number', () => {
      it('should select the number pressed', () => {
        return create({}, async prompt => {
          await prompt.a();
          await prompt.a();
          await prompt.number(3);
        })
          .then(answer => {
            assert.deepStrictEqual(answer, ['d']);
          });
      });

      it('should be a string when options.multiple is false', () => {
        return create({ multiple: false }, async prompt => {
          await prompt.a();
          await prompt.a();
          await prompt.number(3);
        })
          .then(answer => {
            assert.deepStrictEqual(answer, 'd');
          });
      });

      it('should select the _last_ number pressed when options.multiple is false', () => {
        return create({ multiple: false }, async prompt => {
          await prompt.a();
          await prompt.a();
          await prompt.number(3);
          await prompt.number(2);
        })
          .then(answer => {
            assert.deepStrictEqual(answer, 'c');
          });
      });

      it('should select the _all_ numbers pressed when options.multiple is true', () => {
        return create({ multiple: true }, async prompt => {
          await prompt.a();
          await prompt.a();
          await prompt.number(3);
          await prompt.number(1);
          await prompt.number(2);
        })
          .then(answer => {
            assert.deepStrictEqual(answer, ['b', 'c', 'd']);
          });
      });

      it('should select numbers that are not visible', () => {
        return create({ multiple: true, limit: 1 }, async prompt => {
          await prompt.a();
          await prompt.a();
          await prompt.number(3);
          await prompt.number(1);
          await prompt.number(2);
        })
          .then(answer => {
            assert.deepStrictEqual(answer, ['b', 'c', 'd']);
          });
      });
    });

    describe('keypress > space', () => {
      it('should emit "alert" when options.multiple is not true', () => {
        let called = 0;
        return create({ multiple: false }, prompt => {
          prompt.on('alert', () => (called++));
          prompt.space();
        })
          .then(answer => {
            assert.deepStrictEqual(called, 1);
            assert.deepStrictEqual(answer, 'd');
          });
      });

      it('should not emit "alert" when options.multiple is not true', () => {
        let called = 0;
        return create({ multiple: true }, prompt => {
          prompt.on('alert', () => (called++));
          prompt.space();
        })
          .then(answer => {
            assert.deepStrictEqual(called, 0);
            assert.deepStrictEqual(answer, ['a', 'b', 'd']);
          });
      });

      it.skip('should select the choice at the current index', () => {
        return create({}, async prompt => {
          await prompt.number(0);
          await prompt.number(1);
          prompt.index = 3;
          await prompt.space();
        })
          .then(answer => {
            assert.deepStrictEqual(answer, ['d']);
          });
      });
    });
  });
});
