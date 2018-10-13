'use strict';

const hint = '(Use <space> to select, <return> to submit)';
const SelectPrompt = require('./select');
const { first } = require('../utils');

class MultiselectPrompt extends SelectPrompt {
  constructor(options) {
    super({ multiple: true, ...options });
    this.state.hint = first([this.options.hint, hint]);
  }

  async format() {
    if (this.answered && Array.isArray(this.value)) {
      return this.value.map(s => this.styles.answered(s)).join(', ');
    }
    return super.format();
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
