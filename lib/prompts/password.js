'use strict';

const StringPrompt = require('../types/string');

class PasswordPrompt extends StringPrompt {
  constructor(options) {
    super({ ...options, style: 'password' });
    this.cursorHide();
  }
}

module.exports = PasswordPrompt;
