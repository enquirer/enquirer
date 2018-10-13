const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');
const symbols = require('../../lib/style/symbols');
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
  elements: {
    separator(state, status) {
      return colors.dim(status === 'answered' ? symbols.middot : symbols.ellipsis);
    },
    pointer(state, status) {
      return status === 'on' ? ['🍬', '🍎', '👄', '🖕'][state.index] : '  ';
    },
    prefix(state, status) {
      switch (status) {
        case 'pending': return '🎃';
        case 'cancelled': return '⚰️ ';
        case 'answered': return '💀';
      }
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(err => console.error('TERMINATED'));
