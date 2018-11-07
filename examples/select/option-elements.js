const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');
const symbols = require('../../lib/symbols');
const prompt = new Prompt({
  name: 'color',
  message: 'Trick or treat! Take your pick',
  choices: ['candy', 'apple', 'toothbrush', 'insult'],
  styles: {
    primary: colors.yellow,
    muted(...args) {
      return this.complement(...args);
    }
  },
  separator(state) {
    return colors.dim(state.status === 'submitted' ? symbols.middot : symbols.ellipsis);
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
  .catch(err => console.error('TERMINATED'));
