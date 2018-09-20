'use strict';

const BooleanPrompt = require('../types/boolean');

class TogglePrompt extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.value = this.initial = !!options.initial;
    this.disabled = options.disabled || 'no';
    this.enabled = options.enabled || 'yes';
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
    switch (!key.code && ch && ch.toLowerCase()) {
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

  render() {
    this.clear();
    let active = str => this.styles.active.underline(str);
    let message = [
      this.value ? this.disabled : active(this.disabled),
      this.value ? active(this.enabled) : this.enabled
    ];
    this.write(this.renderMessage(message.join(this.styles.hint(' / '))));
  }
}

module.exports = TogglePrompt;
