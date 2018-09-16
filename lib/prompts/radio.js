'use strict';

const SelectPrompt = require('./select');
const utils = require('../utils');

class RadioPrompt extends SelectPrompt {
  async init() {
    await super.init();
    this.initial = utils.first(this.options.initial, 0);
    this.initial = this.find(this.initial, 'index');
    this.enable();
  }

  dispatch(ch, key) {
    if (ch === ' ') {
      this.enable();
    }
  }

  reset() {
    this.cursor = this.initial;
    this.enable();
  }

  number(ch) {
    if (super.number(ch) !== false) {
      this.cursor = +ch;
      this.enable();
    }
  }

  enable() {
    this.choices.forEach((choice, i) => (choice.enabled = i === this.cursor));
    this.render();
  }

  indicator(choice) {
    if (choice.disabled) return this.colors.hint(this.symbols.indicator.disabled);
    if (choice.enabled) return this.colors.success(this.symbols.indicator.on);
    return this.symbols.indicator.off;
  }

  renderChoiceHelp(choice) {
    return choice.hint ? this.colors.hint(choice.hint) : '';
  }

  renderChoice(choice, i) {
    let pointer = this.cursor === i ? this.colors.active(this.symbols.pointer.on) : ' ';
    let indicator = this.indicator(choice, i);
    let help = this.renderChoiceHelp(choice, i);
    let line = [pointer + indicator, choice.message, help];
    return line.filter(Boolean).join(' ');
  }

  get selected() {
    return this.find(choice => choice.enabled) || this.find(this.initial);
  }
}

module.exports = RadioPrompt;
