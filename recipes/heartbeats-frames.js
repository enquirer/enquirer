const spinners = require('cli-spinners');
const Prompt = require('../lib/prompts/multiselect');
const { red, dim, cyan, yellow } = require('ansi-colors');

const frames = [red.dim, red, red.dim, red, red.dim, red.dim].map(c => c('❤'));
const frame = (arr, i) => arr[i % arr.length];
const render = state => frame(state.timer.frames, state.timer.tick);
let pointer;

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  timers: {
    separator: spinners.dots,
    prefix: { interval: 120, frames },
    pointer: { interval: 300, frames }
  },
  separator(state, choice, i) {
    return !state.submitted ? yellow(render(state)) : state.symbols.separator.submitted;
  },
  prefix(state, choice, i) {
    let str = state.symbols.prefix.submitted;
    let col = state.cancelled ? state.styles.cancelled : state.styles.submitted;
    return !state.submitted ? render(state) : col(str);
  },
  pointer(state, choice, i) {
    return state.index === i ? render(state) + ' ' : '  ';
  },
  choices: ['Foo', 'Bar', 'Baz']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
