'use strict';

const Prompt = require('../prompt');
const toString = val => Array.isArray(val) ? val.join(', ') : val;
const isNumber = val => /^([-+0-9]+|Infinity)$/.test(val);

class RawList extends Prompt {
  constructor(options = {}) {
    super(options);
    this.cursor = 0;
    this.typed = '';
  }

  async init() {
    await super.init();
    this.choices = this.options.choices.map(this.toChoice.bind(this));
    this.initial = this.options.initial || 0;
    this.hint = this.options.hint || '';
  }

  dispatch(ch) {
    if (!isNumber(ch)) return this.alert();
    let num = parseInt(this.typed + ch, 10);
    if (num > this.choices.length) {
      return this.alert();
    }
    this.typed += ch;
    this.cursor = num - 1;
    this.render();
  }

  delete() {
    this.typed = this.typed.slice(0, this.typed.length - 1);
    this.cursor = this.typed ? parseInt(this.typed, 10) : this.initial;
    this.render();
  }

  moveCursor(i) {
    if (i < 0) i = this.choices.length - 1;
    if (i === this.choices.length) i = 0;
    this.cursor = i;
  }

  up() {
    this.moveCursor(this.cursor - 1);
    this.typed = `${this.cursor + 1}`;
    this.render();
  }
  down() {
    this.moveCursor(this.cursor + 1);
    this.typed = `${this.cursor + 1}`;
    this.render();
  }

  toChoice(choice) {
    if (typeof choice === 'string') choice = { value: choice };
    choice.name = choice.name || choice.value;
    choice.message = choice.message || choice.name;
    return choice;
  }

  renderChoice(choice, i) {
    let msg = ` ${i + 1}) ${choice.message}`;
    if (this.cursor === i) {
      return this.colors.active(msg);
    }
    return msg;
  }

  renderChoices() {
    if (this.answered) return ' ' + this.colors.answered(toString(this.selected));
    return ' \n' + this.choices.map(this.renderChoice.bind(this)).join('\n');
  }

  render() {
    this.clear();
    this.write(this.renderMessage(this.hint || ''));
    this.write(this.renderChoices());
    this.write(`\n Answer: ${this.typed}`);
  }

  get selected() {
    return this.choices[this.cursor].value;
  }

  submit() {
    this.value = this.selected;
    return super.submit();
  }
}

module.exports = RawList;
