'use strict';

const colors = require('ansi-colors');
const Prompt = require('../prompts/multiselect');

class Checkbox extends Prompt {
  constructor(options) {
    super(options);
    this.symbols.check = colors.red(this.symbols.heart);
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
