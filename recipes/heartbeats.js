const Prompt = require('../lib/prompts/multiselect');
const { red, dim } = require('ansi-colors');

const colors = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length]('❤');

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  timers: { separator: 250, prefix: 120, pointer: 300 },
  prefix: state => frame(colors, state.timer.tick),
  separator: state => frame(colors, state.timer.tick),
  pointer: (state, choice, i) => {
    return state.index === i ? frame(colors, state.timer.tick) + ' ' : '  ';
  },
  choices: ['Foo', 'Bar', 'Baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
