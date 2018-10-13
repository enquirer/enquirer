'use strict';

const I18N = require('./i18n');

class State {
  constructor(prompt) {
    let options = prompt.options;
    this.i18n = new I18N(this, options);
    this.cursor = prompt.cursor || 0;
    this.index = prompt.index || 0;
    this.value = options.value;
    this.input = options.input || this.value || '';
    this.prefix = options.prefix || prompt.symbols.questionSmall;
    this.separator = options.separator || prompt.symbols.pointerSmall;
    this.initial = prompt.initial;
  }

  set(key, value) {
    return this.i18n.set(key, value);
  }
  get(key, state, prompt) {
    let value = this.i18n.get(key);
    if (typeof value === 'function') {
      return value(this, state, prompt);
    }
    return value;
  }
  has(key) {
    return this.i18n.has(key);
  }
}

module.exports = State;
