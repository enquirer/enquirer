'use strict';

const Prompt = require('prompt-base/lib/types/string');

class Invisible extends Prompt {
  constructor(options) {
    super({ ...options, style: 'invisible' });
  }
}

module.exports = Invisible;
