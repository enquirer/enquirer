'use strict';

const SelectPrompt = require('./select');

class MultiselectPrompt extends SelectPrompt {
  constructor(options) {
    super({ multiple: true, ...options });
  }

  dispatch(s, key) {
    this[key.name] ? this[key.name](s, key) : super.dispatch(s, key);
  }

  pointer(choice, i) {
    return this.styles[choice.enabled ? 'success' : 'dark'](this.symbols.check);
  }
}

module.exports = MultiselectPrompt;
