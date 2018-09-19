'use strict';

const utils = require('./utils');

class Choice {
  constructor(ele, index, prompt) {
    if (typeof ele === 'string') {
      ele = { name: ele, message: ele, value: ele };
    }

    let choice = { ...ele };
    Reflect.defineProperty(this, 'original', { value: choice, enumerable: false });

    Object.assign(this, choice);
    this.name = choice.name || choice.key || choice.value || choice.message;
    this.message = choice.message || choice.title || this.name;
    this.value = choice.value || this.name;
    this.index = index || choice.index || 0;
    this.number = this.index + 1;
    this.cursor = 0;
    this.typed = '';

    if (prompt && typeof this.enabled !== 'boolean') {
      let value = utils.first(prompt.value, prompt.initial);
      this.enabled = value === this.name || value === this.index;
    }
  }
  isValid(options = {}) {
    if (typeof options.isValid === 'function') {
      return options.isValid.call(this, this.name, this.value);
    }
    return true;
  }
  format(options = {}) {
    if (typeof options.format === 'function') {
      return options.format.call(this, this.value);
    }
    return this.value;
  }

  get status() {
    return this.enabled ? 'on' : this.disabled ? 'disabled' : 'off';
  }
}

module.exports = Choice;
