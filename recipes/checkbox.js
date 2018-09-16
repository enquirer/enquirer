'use strict';

const { dim, red } = require('ansi-colors');
const Prompt = require('../lib/prompts/multiselect');
const symbols = require('../lib/style/symbols');

class Checkbox extends Prompt {
  constructor(options) {
    super(options);
  }
  indicator(choice) {
    return choice.enabled ? red(symbols.heart) : dim.gray(symbols.heart);
  }
}

module.exports = Checkbox;
