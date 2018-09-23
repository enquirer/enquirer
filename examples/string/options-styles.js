'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/types/string');
const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  hideCursor: true,
  styles: {
    primary: colors.blue,
    highlight: colors.bgGreen.black
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
