'use strict';

const colors = require('ansi-colors');
const Prompt = require('../prompts/select');
const { symbols } = Prompt.utils;

class Radio extends Prompt {
  dispatch(ch, key) {
    if (ch === ' ') {
      this.space();
    }
  }

  reset() {
    this.cursor = this.initial || 0;
    this.enable();
  }

  number(ch) {
    super.number(ch);
    this.cursor = +ch;
    this.enable();
  }

  space() {
    this.enable();
  }

  enable() {
    this.choices.forEach((choice, i) => (choice.enabled = i === this.cursor));
    this.render();
  }

  checkbox(choice) {
    if (choice.disabled) return colors.gray(symbols.radio.disabled);
    if (choice.enabled) return colors.green(symbols.radio.on);
    return symbols.radio.off;
  }

  renderChoice(choice, i) {
    const radio = this.checkbox(choice);
    const symbol = this.style.symbols.pointer;
    const pointer = this.cursor === i ? colors.cyan(symbol) + radio : ` ${radio}`;
    return `${pointer} ${choice.message}`;
  }

  submit() {
    this.value = this.selected.value;
    return super.submit();
  }

  get selected() {
    return this.find(choice => choice.enabled) || this.choices[this.initial];
  }
}

module.exports = Radio;
