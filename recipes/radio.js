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

  symbol(name, status) {
    const symbol = this.symbols[name][status];
    const color = this.styles[name][status];
    return color(symbol);
  }

  indicator(choice) {
    const symbol = this.symbols.radio[choice.status];
    const color = this.styles.radio[choice.status];
    return color(symbol) + ' ';
    // return this.symbol('radio', choice.status) + ' ';
  }

  get selected() {
    return this.find(choice => choice.enabled) || this.find(this.initial);
  }
}

module.exports = Radio;
