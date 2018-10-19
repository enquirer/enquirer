const Prompt = require('../lib/prompts/multiselect');
const { red, dim } = require('ansi-colors');

const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length];

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  choices: ['Foo', 'Bar', 'Baz'],
  symbols: {
    prefix: red.dim('❤')
  }
});

prompt.on('run', () => {
  (function heartbeat(ms, i) {
    prompt.state.lastBeat = setTimeout(() => {
      prompt.symbols.prefix = frame(rhythm, i)('❤');
      prompt.render();
      heartbeat(ms, i + 1);
    }, ms);
  })(250, 0);
});

prompt.once('close', () => clearTimeout(prompt.state.lastBeat));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
