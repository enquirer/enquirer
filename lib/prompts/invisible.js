'use strict';

const StringPrompt = require('../types/string');

class InvisiblePrompt extends StringPrompt {
  constructor(options) {
    super({ ...options, style: 'invisible' });
    this.cursorHide();
  }
}

module.exports = InvisiblePrompt;
