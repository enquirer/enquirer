'use strict';

const TextPrompt = require('./text');

class PasswordPrompt extends TextPrompt {
  constructor(options) {
    super({ ...options, style: 'password' });
  }
}

module.exports = PasswordPrompt;
