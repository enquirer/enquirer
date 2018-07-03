'use strict';

const colors = require('ansi-colors');
const Prompt = require('prompt-base/lib/types/boolean');
const { utils } = Prompt;

class Toggle extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = this.initial = !!options.initial;
    this.enabled = options.enabled || 'yes';
    this.disabled = options.disabled || 'no';
  }

  reset() {
    this.value = this.initial;
    this.render();
  }

  delete() {
    this.disable();
  }

  toggle() {
    this.value = !this.value;
    this.render();
  }

  disable() {
    if (this.value === false) {
      return this.alert();
    }
    this.value = false;
    this.render();
  }
  enable() {
    if (this.value === true) {
      return this.alert();
    }
    this.value = true;
    this.render();
  }

  up() {
    this.toggle();
  }
  down() {
    this.toggle();
  }

  right() {
    this.toggle();
  }
  left() {
    this.toggle();
  }

  next() {
    this.toggle();
  }
  prev() {
    this.toggle();
  }

  dispatch(ch, key) {
    switch (ch) {
      case ' ':
        this.toggle();
        break;
      case '1':
      case 'y':
      case 't':
        this.enable();
        break;
      case '0':
      case 'n':
      case 'f':
        this.disable();
        break;
      default: {
        this.alert();
        break;
      }
    }
  }

  render(first) {
    this.clear();
    const values = [
      this.value ? this.disabled : colors.cyan.underline(this.disabled),
      this.value ? colors.cyan.underline(this.enabled) : this.enabled
    ];

    const message = this.renderMessage(values.join(colors.dim(' / ')));
    this.write(message);
  }
}

module.exports = Toggle;
