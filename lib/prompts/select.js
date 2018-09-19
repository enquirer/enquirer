'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');
const symbols = require('../style/symbols');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super(options);
    this.state.separator = '';
  }

  space() {
    this.alert();
  }

  renderChoice(choice) {
    let isSelected = this.state.index === choice.index;
    let symbol = choice.prefix || symbols.rightAngleSmall;
    let prefix = isSelected ? this.styles.active(symbol) : ' ';
    let message = isSelected ? colors.cyan(choice.message) : choice.message;
    if (choice.disabled) message = this.styles.gray(choice.message);
    return prefix + ' ' + message;
  }

  renderChoices() {
    if (this.state.answered) return '';
    return '\n' + this.state.choices.map(this.renderChoice.bind(this)).join('\n');
  }

  render() {
    if (this.state.answered) this.state.typed = this.choice.value;
    super.render();
    this.write(this.renderChoices());
  }

  get choice() {
    return this.state.choices[this.state.index];
  }
}

module.exports = SelectPrompt;
