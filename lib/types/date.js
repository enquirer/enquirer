'use strict';

const NumberPrompt = require('./number');

class DatePrompt extends NumberPrompt {
  constructor(options) {
    super(options);
  }
}

module.exports = DatePrompt;
