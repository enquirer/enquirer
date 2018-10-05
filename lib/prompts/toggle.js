'use strict';

const BooleanPrompt = require('../types/boolean');

class TogglePrompt extends BooleanPrompt {
  constructor(options = {}) {
    super(options);
    this.value = this.initial = this.cast(this.options.initial);
    this.disabled = this.options.disabled || 'no';
    this.enabled = this.options.enabled || 'yes';
  }

  dispatch(ch) {
    this.cast(ch) ? this.enable() : this.disable();
  }

  reset() {
    this.value = this.initial;
    this.render();
  }

  delete() {
    this.alert();
  }

  toggle() {
    this.value = !this.value;
    this.render();
  }

  enable() {
    if (this.value === true) return this.alert();
    this.value = true;
    this.render();
  }
  disable() {
    if (this.value === false) return this.alert();
    this.value = false;
    this.render();
  }

  space() {
    this.toggle();
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

  render() {
    this.clear();

    let value = [
      this.value ? this.disabled : this.styles.success.underline(this.disabled),
      this.value ? this.styles.success.underline(this.enabled) : this.enabled
    ];

    let prompt = [
      this.element('prefix'),
      this.element('message'),
      this.element('separator'),
      this.answered ? this.styles.answered(this.value) : value.join(this.styles.muted(' / ')),
      this.error() || this.hint()
    ];

    this.write(prompt.filter(Boolean).join(' '));
  }
}

module.exports = TogglePrompt;
