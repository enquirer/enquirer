'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
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
