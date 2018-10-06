'use strict';

const { cyan, gray } = require('ansi-colors');
const { ArrayPrompt } = require('../types');
const { first } = require('../utils');

class Sort extends ArrayPrompt {
  constructor(options) {
    super(options);
    this.hint = first(this.options.hint, '(Use <shift>+<up/down> to sort)');
  }

  swap(pos) {
    if (pos === this.list.length) pos = 0;
    if (pos < 0) pos = this.list.length - 1;
    let choice = this.list[this.cursor];
    this.list[this.cursor] = this.list[pos];
    this.list[pos] = choice;
    this.choices = [...this.list, ...this.choices.slice(this.list.length)];
  }

  shiftUp() {
    this.swap(this.cursor - 1);
    this.up();
    this.render();
  }

  shiftDown() {
    this.swap(this.cursor + 1);
    this.down();
    this.render();
  }

  renderChoice(choice, i) {
    choice.enabled = true;
    return this.cursor === i ? cyan.underline(choice.message) : choice.message;
  }

  render(help) {
    this.clear();
    let values = this.list.map(choice => cyan(choice.name));
    let value = this.answered ? values.join(', ') : this.renderHelp(help);
    let message = this.renderMessage(value) + this.renderChoices();
    this.write(message);
  }

  get selected() {
    return this.choices;
  }

  submit() {
    this.value = this.choices.map(choice => choice.value);
    return super.submit(this.value);
  }
}

module.exports = Sort;
