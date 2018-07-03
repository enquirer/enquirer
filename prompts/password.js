'use strict';

const TextPrompt = require('./text');

class Password extends TextPrompt {
  constructor(options) {
    super({ ...options, style: 'password' });
  }
}

module.exports = Password;
