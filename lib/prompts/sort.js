'use strict';

const hint = '(Use <shift>+<up/down> to sort)';
const Prompt = require('./select');

class Sort extends Prompt {
  constructor(options) {
    super({ ...options, reorder: false, sort: true, multiple: true });
    this.state.hint = [this.options.hint, hint].find(this.isValue.bind(this));
  }

  indicator() {
    return '';
  }

  get selected() {
    return this.choices;
  }

  submit() {
    this.value = this.choices.map(choice => choice.value);
    return super.submit();
  }
}

module.exports = Sort;
