'use strict';

const utils = require('../../lib/utils');
const pkg = require('../../package');

const Prompt = require('../../lib/prompts/form');
const prompt = new Prompt({
  name: 'user',
  message: 'Update the following fields in package.json:',
  choices() {
    const choices = [];
    for (let name of Object.keys(pkg)) {
      let initial = pkg[name];
      if (initial && !Array.isArray(initial) && typeof initial !== 'object') {
        choices.push({
          name,
          get initial() {
            let sepLength = 4;
            let margin = prompt.longest + sepLength;
            let width = prompt.stdout.columns - margin;

            if (initial.length > width) {
              let indent = ' '.repeat(margin);
              initial = initial.replace(/\s+/g, ' ');
              initial = utils.wordWrap(initial, { width: width - 3, newline: '\n' + indent })
            }
            return initial;
          }
        });
      }
    }
    return choices;
  }
});

prompt.run()
  .then(answers => console.log('ANSWERS:', Object.assign({}, pkg, answers)))
  .catch(console.error);
