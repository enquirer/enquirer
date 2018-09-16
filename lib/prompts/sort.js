'use strict';

const ArrayPrompt = require('../types/array');
const utils = require('../utils');
const hint = '(Use <shift>+<up/down> to sort)';

class SortPrompt extends ArrayPrompt {
  constructor(options) {
    super(options);
    this.hint = utils.first(this.options.hint, hint);
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
    return this.cursor === i ? this.colors.selected(choice.message) : choice.message;
  }

  render(help) {
    this.clear();
    let values = this.list.map(choice => this.colors.active(choice.name));
    let value = this.answered ? values.join(', ') : this.renderHelp(help);
    this.write(this.renderMessage(value));
    this.write(this.renderChoices());
  }

  get selected() {
    return this.choices;
  }

  submit() {
    this.value = this.choices.map(choice => choice.value);
    return super.submit(this.value);
  }
}

module.exports = SortPrompt;
