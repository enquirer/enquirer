const Prompt = require('../lib/prompts/multiselect');
const { red, dim } = require('ansi-colors');

const colors = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length]('❤ ');
let framerate = 250;

const prompt = new Prompt({
  name: 'fruit',
  message: 'Favorite fruit?',
  timers: { prefix: framerate },
  prefix: state => frame(colors, state.timer.tick),
  choices: ['Watermelon', 'Apple', 'Orange']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);

