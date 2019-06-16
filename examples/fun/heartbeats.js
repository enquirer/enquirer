const { red } = require('ansi-colors');
const { MultiSelect } = require('enquirer');

/**
 * This examples shows how to use the `timers` option to
 * create multiple heartbeat effects in different positions.
 */

const colors = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length]('❤');

const prompt = new MultiSelect({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  timers: { separator: 250, prefix: 120, pointer: 300 },
  prefix: state => frame(colors, state.timers.prefix.tick),
  separator: state => frame(colors, state.timers.separator.tick),
  pointer(state, choice, i) {
    return state.index === i ? frame(colors, state.timers.pointer.tick) + ' ' : '  ';
  },
  choices: ['Foo', 'Bar', 'Baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
