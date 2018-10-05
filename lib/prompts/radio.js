'use strict';

const SelectPrompt = require('./select');

class RadioPrompt extends SelectPrompt {
  async reset() {
    await super.reset();
    this.toggle();
  }

  toggle() {
    this.choices.forEach((ch, i) => (ch.enabled = i === this.index));
  }

  space() {
    this.toggle();
    return this.render();
  }

  enable(choice) {
    return choice;
  }

  indicator(choice) {
    if (choice.disabled) return this.styles.hint(this.symbols.radio.disabled);
    if (choice.enabled) return this.styles.success(this.symbols.radio.on);
    return this.symbols.radio.off;
  }

  get selected() {
    return this.find(choice => choice.enabled) || this.find(this.initial);
  }
}

module.exports = RadioPrompt;
