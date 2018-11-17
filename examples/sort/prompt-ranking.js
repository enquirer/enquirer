const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/sort');
const prompt = new Prompt({
  name: 'career',
  message: 'Please rank the following in order of importance',
  numbered: true,
  choices: ['Recognition', 'Opportunity', 'Pay', 'Benefits', 'Co-workers']
});

prompt.run()
  .catch(console.error);
