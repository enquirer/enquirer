'use strict';

const Prompt = require('../prompts/multiselect');

class Checkbox extends Prompt {
  constructor(options) {
    super(options);
    this.style.symbols.check = this.style.symbols.heart;
  }
}

const { prompt } = Checkbox;

prompt({message: 'Favorite color?', choices: ['red', 'blue', 'green']})
  .on('submit', answer => console.log(answer))
  .on('abort', error => console.log(error));

module.exports = Checkbox;
