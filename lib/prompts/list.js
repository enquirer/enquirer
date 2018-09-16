'use strict';

const StringPrompt = require('../types/string');
const trim = str => str.replace(/ +/g, ' ');

class ListPrompt extends StringPrompt {
  constructor(options) {
    super(options);
    this.sep = this.options.separator || /, */;
    this.value = this.initial;
  }
  split(input = this.typed || this.value) {
    let list = input && typeof input === 'string' ? input.split(this.sep) : [];
    return list.map(str => str.trim());
  }
  renderMessage(...args) {
    return trim(super.renderMessage(...args));
  }
  render() {
    if (this.answered) {
      this.typed = this.split().map(this.colors.answered).join(', ');
    }
    super.render();
  }
  submit(value) {
    return super.submit(Array.isArray(value) ? value : this.split());
  }
}

module.exports = ListPrompt;
