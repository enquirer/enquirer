'use strict';

const colors = require('ansi-colors');
const Prompt = require('../prompts/multiselect');

class Checkbox extends Prompt {
  constructor(options) {
    super(options);
    this.style.symbols.check = colors.red(this.style.symbols.heart);
  }
}

module.exports = Checkbox;

/**
 * Example usage
 */

const { prompt } = Checkbox;

prompt({ message: 'Favorite color?', choices: ['red', 'blue', 'green'] })
  .on('submit', answer => console.log(answer))
  .on('abort', error => console.log(error));
