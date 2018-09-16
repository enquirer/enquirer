'use strict';

const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/sort');
const prompt = new Prompt({
  name: 'colors',
  message: 'Reorder colors',
  choices: ['red', 'white', 'green', 'cyan', 'yellow']
});

prompt.run()
  .then(function(answer = []) {
    console.log(answer);
    console.log('Your preferred order of colors is:');
    console.log(answer.map(key => colors[key](key)).join('\n'));
  })
  .catch(console.error);
