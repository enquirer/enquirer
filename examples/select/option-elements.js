'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Trick or treat! Take your pick',
  choices: ['candy', 'apple', 'toothbrush', 'insult'],
  styles: { primary: colors.yellow },
  separator(state) {
    let { middot, ellipsis } = prompt.symbols;
    return colors.dim(state.status === 'submitted' ? middot : ellipsis);
  },
  pointer(state, choice, i) {
    return state.index === i ? ['🍬', '🍎', '👄', '🖕'][i] : '  ';
  },
  prefix(state) {
    switch (state.status) {
      case 'pending': return '🎃';
      case 'cancelled': return '⚰️ ';
      case 'submitted': return '💀';
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(console.error);
