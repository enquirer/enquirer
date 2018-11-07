const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What packages do you want to install?',
  initial: ['dependencies'],
  symbols: { indicator: '$' },
  choices: [
    { name: 'dependencies', choices: ['kind-of', 'picomatch'] },
    { name: 'devDependencies', choices: ['ansi-colors', 'mocha'] }
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
