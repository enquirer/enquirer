const Prompt = require('../../lib/prompts/multiselect');
const colors = require('ansi-colors');

const prompt = new Prompt({
  name: 'food',
  message: 'What are your favorite foods?',
  choices: [
    { name: 'lasagna', message: 'Lasagna' },
    { name: 'pizza', message: 'Pizza' },
    { name: 'chicken_curry', message: 'Chicken Curry' },
    { name: 'tacos', message: 'Tacos' }
  ],
  symbols: { indicator: '❤' },
  indicator(state, choice) {
    if (choice.enabled) {
      return colors.red(state.symbols.indicator);
    }
    return colors.dim.gray(state.symbols.indicator);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
