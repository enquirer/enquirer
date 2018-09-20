'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');
const symbols = require('../style/symbols');

class SelectPrompt extends ArrayPrompt {
  constructor(options) {
    super({ ...options, multiple: false });
    this.state.separator = '';
  }

  space() {
    this.alert();
  }

  renderChoice(choice) {
    let isSelected = this.state.index === choice.index;
    let prefix = isSelected ? this.styles.active(choice.prefix) : ' ';
    let message = isSelected ? colors.cyan(choice.message) : choice.message;
    if (choice.disabled) message = this.styles.gray(choice.message);
    return prefix + ' ' + message;
  }

  renderChoices() {
    if (this.state.answered) return '';
    return '\n' + this.choices.map(this.renderChoice.bind(this)).join('\n');
  }

  render() {
    if (this.state.answered) this.state.typed = this.current.value;
    super.render();
    this.write(this.renderChoices());
  }
}

module.exports = SelectPrompt;
