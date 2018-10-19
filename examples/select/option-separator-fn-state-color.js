const { symbols, dim, red } = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');

const prompt = new Prompt({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  hint: 'Use arrow-keys, <return> to submit',
  separator(state) {
    return state.color(symbols.bullet);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(err => console.error('TERMINATED'));
