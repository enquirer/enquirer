const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');
const symbols = require('../../lib/style/symbols');
const prompt = new Prompt({
  name: 'color',
  message: 'Trick or treat! Take your pick',
  choices: ['candy', 'apple', 'toothbrush', 'insult'],
  styles: {
    primary: colors.blue,
    muted: colors.yellow,
  },
  elements: {
    separator: colors.dim(symbols.middot),
    // pointer: { on: '🔮' },
    // pointer: { on: '🦉' },
    // pointer: { on: '🗡️  ' },
    pointer(state, status, choice) {
      return status === 'on' ? '🗡️ ' : '  ';
    },
    prefix(state, status) {
      switch (status) {
        case 'pending': return '🎃 ';
        case 'cancelled': return '⚰️ ';
        case 'answered': return '💀 ';
      }
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(console.error);
