const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');
const symbols = require('../../lib/style/symbols');
const prompt = new Prompt({
  name: 'color',
  message: 'Trick or treat! Take your pick',
  choices: ['candy', 'apple', 'toothbrush', 'insult'],
  elements: {
    separator: symbols.middot
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(console.error);
