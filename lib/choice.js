'use strict';

class Choice {
  constructor(item, prompt = {}, index = 0) {
    if (typeof item === 'string') {
      item = { name: item, message: item, value: item };
    }

    let choice = { ...item };
    Reflect.defineProperty(this, 'original', { value: choice, enumerable: false });
    Object.assign(this, choice);

    this.type = choice.type || 'option';
    this.name = choice.name || choice.key || choice.value || choice.message;
    this.message = choice.message || choice.title || this.name;
    this.alias = choice.alias;

    this.index = index;
    this.number = this.index + 1;
    this.cursor = 0;

    this.value = choice.value || this.name;
    this.typed = '';

    this.disabled = this.type === 'separator' || choice.disabled === true;
    this.enabled = choice.enabled === true;
  }

  render(options) {
    return this.indicator + this.message;
  }

  every(fn) {
    return fn(this) && this.choices && this.choices.every(fn);
  }

  isValid(options = {}) {
    return true;
  }

  format(options = {}) {
    return this.value;
  }

  set indicator(val = '') {
    if (val !== '' && typeof val === 'string') {
      this._indicator = val.trim() + ' ';
    }
  }
  get indicator() {
    let val = this._indicator;
    if (val) {
      // do stuff with status
      return val;
    }
    return '';
  }

  get status() {
    if (this.disabled) return 'disabled';
    if (this.collapsed) return 'collapsed';
    if (this.expanded) return 'expanded';
    if (this.selected) return 'selected';
    if (this.enabled) return 'enabled';
    return 'off';
  }
}

module.exports = Choice;
