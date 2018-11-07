const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What packages do you want to install?',
  choices: [
    { name: 'dependencies', choices: ['ansi-colors', 'picomatch'] },
    { name: 'devDependencies', choices: ['kind-of', 'enquirer'] }
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
