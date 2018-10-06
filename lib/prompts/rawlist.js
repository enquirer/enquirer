'use strict';

const SelectPrompt = require('./select');

class RawList extends SelectPrompt {
  number(ch) {
    if (!this.choices[ch]) return this.alert();
    this.input = ch;
    return super.number(ch);
  }

  pointer(choice, i) {
    let message = `${i}) ${choice.message}`;
    if (this.index === i) {
      return this.styles.active(message);
    }
    return message;
  }

  async renderChoices() {
    let choices = await super.renderChoices();
    choices += '\n   Answer: ' + this.input;
    return choices;
  }
}

module.exports = RawList;
