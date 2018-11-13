const Prompt = require('../../lib/prompts/multiselect');
const colors = require('ansi-colors');
const enable = (choices, fn) => choices.forEach(ch => (ch.enabled = fn(ch)));

const prompt = new Prompt({
  name: 'food',
  message: 'What are your favorite foods?',
  choices: [
    { name: 'all',
      message: colors.italic('All'),
      onChoice(state, choice, i) {
        if (state.index === i && choice.enabled) {
          enable(state.choices, ch => ch.name !== 'none');
        }
      }
    },
    { name: 'none',
      message: colors.italic('None'),
      onChoice(state, choice, i) {
        if (state.index === i) {
          if (choice.enabled) {
            enable(state.choices, ch => ch.name === 'none');
          }
        }
        if (state.keypress && state.keypress.name === 'a') choice.enabled = false;
        if (state.index !== i && state.choices[state.index].enabled === true) {
          choice.enabled = false;
        }
      }
    },
    { role: 'separator' },
    { name: 'lasagna', message: 'Lasagna' },
    { name: 'pizza', message: 'Pizza' },
    { name: 'chicken_curry', message: 'Chicken Curry' },
    { name: 'tacos', message: 'Tacos' }
  ],
  symbols: { indicator: '❤' },
  indicator(state, choice) {
    let style = choice.enabled ? colors.red : colors.dim.gray;
    return style(state.symbols.indicator);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
