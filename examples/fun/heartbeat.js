const { Select } = require('enquirer');
const { red } = require('ansi-colors');

/**
 * This examples shows how to use the `timers` option to
 * create a heartbeat effect with the prompt prefix
 */

const colors = [red.dim, red, red.dim, red, red.dim, red.dim];
const color = (arr, i) => arr[i % arr.length];

const prompt = new Select({
  name: 'fruit',
  message: 'Favorite fruit?',
  timers: { prefix: 250 },
  prefix: state => color(colors, state.timer.tick)(prompt.symbols.heart),
  choices: ['Apple', 'Cherry', 'Grape', 'Orange', 'Strawberry', 'Watermelon']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);

