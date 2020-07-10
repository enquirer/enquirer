import colors from 'ansi-colors'
import assert from 'assert'
import 'mocha'
import { MultiSelect } from '..'
import support from './support'

const { expect } = support(assert);
let prompt: Prompt;

const up = { name: 'up' };
const down = { name: 'down' };

class Prompt extends MultiSelect {
  constructor(options: ConstructorParameters<typeof MultiSelect>[0]) {
    super({ show: false, ...options });
  }
}

describe('multiselect', function () {
  describe('options.choices', () => {
    it('should support choices as an array', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should allow choice.value to be an type', () => {
      prompt = new Prompt({
        name: 'example',
        message: 'Take your pick',
        choices: [
          { name: 'foo', value: true },
          { name: 'bar', value: false },
          { name: 'baz', value: 42 }
        ],
        result(names: string[]) {
          return this.map(names);
        }
      });

      prompt.once('run', async () => {
        await prompt.keypress('a');
        await prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.deepEqual(value, {
            bar: false,
            baz: 42,
            foo: true
          });
        });
    });
  });

  describe('options.initial', () => {
    it('should support options.initial', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', () => {
        assert.equal(prompt.initial, 2);
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should not render the initial value on the prompt line', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 'd',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', async () => {
        let init = colors.unstyle([prompt.symbols.pointer, prompt.options.initial].join(' '));
        await prompt.render();
        try {
          let buf = colors.unstyle(prompt.state.buffer);
          assert(!buf.includes(init));
          prompt.submit();
          cb();
        } catch (err) {
          cb(err);
        }
      });

      prompt.run();
    });

    it('should use options.initial by default', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(value => {
          assert.deepEqual(value, ['c']);
        });
    });

    it('should use initial answer when answer is undefined', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['c']);
        });
    });
  });

  describe('options.maxSelected', () => {
    it('should alert when attempting to enable more than the max allowed choices', () => {
      let down = { name: 'down' };
      let alerted = false;
      let keys: string[] = [];

      prompt = new Prompt({
        message: 'Pick lots of choices',
        maxSelected: 2,
        choices: ['a', 'b', 'c', 'd', 'e']
      });

      prompt.on('keypress', (char, key) => {
        keys.push(key.name);
      });

      prompt.once('alert', async () => {
        alerted = true;
        await prompt.submit();
      });

      prompt.once('run', async () => {
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
      });

      return prompt.run()
        .then(() => {
          assert(alerted);
          assert.deepEqual(keys, ['down', 'space', 'down', 'space', 'down', 'space']);
        })
    });
  });

  describe('rendering', () => {
    it('should render a choice with the correct styles', cb => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'foo' },
          { value: 'b', message: 'bar' },
          { value: 'c', message: 'baz' },
          { value: 'd', message: 'qux' }
        ]
      });

      prompt.on('run', async () => {
        assert(Array.isArray(prompt.choices));
        const key = colors.cyan.underline('foo');
        const pointer = colors.dim.gray(prompt.symbols.check);
        assert.equal(await prompt.renderChoice(prompt.choices[0], 0), `${pointer} ${key}`);
        assert.equal(await prompt.renderChoice(prompt.choices[1], 1), `${pointer} bar`);
        prompt.submit();
      });

      prompt.run()
        .then(() => cb())
        .catch(cb);
    });

    it('should render a message when no choices are selected', () => {
      let called = 0;

      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'foo' },
          { value: 'b', message: 'bar' },
          { value: 'c', message: 'baz' },
          { value: 'd', message: 'qux' }
        ]
      });

      prompt.on('run', async () => {
        assert(Array.isArray(prompt.choices));
        const key = colors.cyan.underline('foo');
        const pointer = colors.dim.gray(prompt.symbols.check);
        assert.equal(await prompt.renderChoice(prompt.choices[0], 0), `${pointer} ${key}`);
        assert.equal(await prompt.renderChoice(prompt.choices[1], 1), `${pointer} bar`);
        called++;
        prompt.submit();
      });

      return prompt.run()
        .then(value => {
          assert.equal(called, 1);
        })
    });
  });

  describe('key handling', () => {
    it('should handle toggling a selection with the `space` key', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async () => {
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
        await prompt.keypress(null, down);
        await prompt.keypress(' ');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['b', 'c']);
        });
    });

    it('should handle moving up and down with the arrow keys', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async () => {
        // unselect 'a' TODO: figure out if initial should be 0 by default or not
        await prompt.keypress(' ');
        // down to 'b'
        await prompt.keypress(null, down);
        // down to 'c'
        await prompt.keypress(null, down);
        // back up to 'b'
        await prompt.keypress(null, up);
        await prompt.keypress(' ');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b']);
        });
    });

    it('should handle selecting using number keys', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        initial: 1,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async () => {
        await prompt.keypress(2);
        await prompt.keypress(3);
        await prompt.keypress(1);
        await prompt.keypress(1);
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['b', 'c', 'd']);
        });
    });

    it('should handle selecting all using <a>', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async () => {
        await prompt.keypress('a');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(answer, ['a', 'b', 'c', 'd']);
        });
    });

    it('should handle inverting the selection using <i>', () => {
      prompt = new Prompt({
        message: 'prompt-multiselect',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', async () => {
        await prompt.keypress(0);
        await prompt.keypress(1);
        await prompt.keypress(3);
        await prompt.keypress('i');
        await prompt.submit();
      });

      return prompt.run().then(expect(['c']));
    });
  });
});
