
'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');
const utils = require('../../lib/utils');
const prompt = new Prompt({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  highlight: true,
  symbols: {
    question: '$'
  },
  styles: {
    primary: colors.yellow,
    // highlight: colors.bgGreen.black,
    // answered: colors.blue.bold
    get highlight() {
      return this.complementary(this.inverse);
    },
    get answered() {
      return this.complementary(this.inverse);
    }
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
