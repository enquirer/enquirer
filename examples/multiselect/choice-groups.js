const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What packages do you want to install?',
  initial: ['dependencies'],
  symbols: { indicator: '$' },
  choices: [
    { name: 'dependencies', choices: ['ansi-colors', 'enquirer', 'picomatch'] },
    { name: 'devDependencies', choices: ['kind-of', ''] }
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
