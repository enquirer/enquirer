'use strict';

const yosay = require('yosay');
const { prompt } = require('enquirer');

(async() => {

  const answers = await prompt({
    type: 'autocomplete',
    name: 'color',
    header: yosay('Welcome to my awesome generator!'),
    message: 'Pick your favorite colors',
    choices: ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime']
  });

  console.log(answers);

})().catch(console.log);
