'use strict';

const StringPrompt = require('prompt-base/lib/types/string');

class List extends StringPrompt {
  constructor(options) {
    super(options);
    this.separator = this.options.separator || /, */;
    this.value = this.options.initial || '';
  }
  submit() {
    const value = this.value ? this.value.split(this.separator) : [];
    this.value = value.map(str => str.trim());
    return super.submit();
  }
}

module.exports = List;
