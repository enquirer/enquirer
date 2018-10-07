'use strict';

const SelectPrompt = require('./select');

class MultiselectPrompt extends SelectPrompt {
  constructor(options) {
    super({ multiple: true, ...options });
  }

  dispatch(s, key) {
    this[key.name] ? this[key.name](s, key) : super.dispatch(s, key);
  }

  indicator(choice, i) {
    if (this.options.indicator) return this.options.indicator(choice, i);
    return this.styles[choice.enabled ? 'success' : 'dark'](this.symbols.check);
  }

  pointer() {
    return '';
  }
}

module.exports = MultiselectPrompt;
