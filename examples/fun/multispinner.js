const { red } = require('ansi-colors');
const { MultiSelect } = require('../..');

/**
 * This examples shows how to use the `timers` option to
 * create multiple spinners, each with a different framerate.
 */

const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length];
let i = 0;

const prompt = new MultiSelect({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  choices: ['Foo', 'Bar', 'Baz'],
  timers: {
    separator: 250,
    prefix: 120
  },
  prefix(state) {
    return frame(rhythm, state.timer.tick)('❤');
  },
  separator(state) {
    return frame(rhythm, state.timer.tick)('❤');
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
