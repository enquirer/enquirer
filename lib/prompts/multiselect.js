'use strict';

const SelectPrompt = require('./select');
const { first } = require('../utils');

class MultiselectPrompt extends SelectPrompt {
  constructor(options) {
    super({ multiple: true, ...options });
    this.state.hint = first([this.options.hint, '(Use <space> to select, <return> to submit)']);
  }

  dispatch(s, key) {
    this[key.name] ? this[key.name](s, key) : super.dispatch(s, key);
  }

  indicator(choice, i) {
    if (choice.indicator !== false) {
      return this.styles[choice.enabled ? 'success' : 'dark'](this.symbols.check);
    }
    return ' ';
  }

  pointer() {
    return '';
  }
}

module.exports = MultiselectPrompt;
