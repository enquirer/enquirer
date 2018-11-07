const colors = require('ansi-colors');
const spinners = require('cli-spinners');
const Prompt = require('../lib/prompts/multiselect');

const { red, dim } = require('ansi-colors');
const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length];
let i = 0;

const prompt = new Prompt({
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
