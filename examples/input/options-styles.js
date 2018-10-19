
'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');
const utils = require('../../lib/utils');
const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  styles: {
    primary: colors.blue,
    get answered() {
      return this.inverse;
    }
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
