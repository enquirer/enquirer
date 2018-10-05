'use strict';

const StringPrompt = require('../types/string');

class ListPrompt extends StringPrompt {
  constructor(options) {
    super(options);
    this.sep = this.options.separator || /, */;
    this.value = this.initial;
  }
  split(input = this.input || this.value) {
    return input && typeof input === 'string' ? input.split(this.sep) : [];
  }
  renderInput() {
    let style = this.answered ? this.styles.answered : this.styles.default;
    return this.list.map(style).join(', ');
  }
  submit(value) {
    this.value = this.list;
    return super.submit();
  }
  get list() {
    return this.split();
  }
}

module.exports = ListPrompt;
