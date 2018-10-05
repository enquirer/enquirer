'use strict';

const StringPrompt = require('../types/string');

class PasswordPrompt extends StringPrompt {
  constructor(options) {
    super({ ...options, style: 'password' });
  }
}

module.exports = PasswordPrompt;
