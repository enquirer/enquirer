'use strict';

const util = require('util');
const Prompt = require('../prompt');
const { first, isObject } = require('../utils');

class ArrayPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.longest = 0;
    this.aliases = [];
    this.choices = [];
    this.list = [];
  }

  skip() {
    if (this.options.value !== void 0) {
      this.value = first(this.find(this.options.value, 'value'), this.options.value);
      return true;
    }
  }

  async init() {
    await super.init();
    this.value = this.initial = this.options.initial;
    let choices = this.options.choices || [];
    this.choices = this.options.choices = [];

    if (typeof choices === 'function') {
      this.update = choices.bind(this);
      choices = await this.update(this.typed);
    }

    this.choices = await this.toChoices(choices);
    this.list = await this.toList();

    let cursor = this.options.cursor || this.initial;
    this.cursor = Math.max(this.findIndex(cursor), 0);

    if (this.choices[this.cursor] && this.choices[this.cursor].disabled) {
      throw new Error('the default choice may not be disabled');
    }
  }

  toChoice(choice, choices = []) {
    if (typeof choice === 'string') {
      choice = { name: choice, message: choice, value: choice };
    }

    let value = first(this.value, this.initial);
    let i = choices.length;

    choice.index = i;
    choice.number = i + 1;
    choice.name = first(choice.name, choice.key, choice.value, choice.message);
    choice.message = first(choice.message, choice.title, choice.name, choice.value);
    choice.value = first(choice.value, choice.name);
    choice.typed = '';

    if (typeof choice.disabled === 'string') {
      choice.hint = choice.disabled;
      choice.disabled = true;
    }

    if (choice.disabled === true && !choice.hint) {
      choice.disabled = '(disabled)';
    }

    if (typeof choice.enabled !== 'boolean') {
      choice.enabled = value !== void 0 && (value === choice.name || value === i);
    }

    choice.indent = choice.parent ? choice.parent.indent + '  ' : (choice.indent || '');
    this.longest = Math.max(this.longest, choice.message.length);
    this.aliases.push(choice.alias || '');
    return choice;
  }

  toChoices(choices) {
    choices = this.normalizeChoices(choices);
    let arr = [];

    let addChoices = choices => {
      if (!choices) return;
      for (let choice of choices) {
        choice = this.toChoice(choice, arr);
        if (!arr.includes(choice)) arr.push(choice);
        addChoices(choice.choices);
      }
    };

    addChoices(choices);
    return arr;
  }

  normalizeChoices(choices, parent) {
    if (typeof choices === 'function') choices = choices.call(this);
    if (Array.isArray(choices)) {
      return choices.map(choice => this.normalizeChoice(choice, parent));
    }
    let arr = [];
    for (let name of Object.keys(choices)) {
      let value = choices[name];
      if (isObject(value)) {
        if (!hasChildren(value)) {
          arr.push(this.normalizeChoice({ name, ...value }, parent));
        } else {
          arr.push(this.normalizeChoice({ name, choices: value }, parent));
        }
      } else {
        if (!Array.isArray(value)) {
          throw new TypeError('invalid choices value: ' + util.inspect(value));
        }

        if (value.length === 0) {
          arr.push(this.normalizeChoice({ name, disabled: true }, parent));
        } else {
          arr.push(this.normalizeChoice({ name, choices: value }, parent));
        }
      }
    }
    return arr;
  }

  normalizeChoice(choice, parent) {
    if (typeof choice === 'string') {
      choice = { name: choice, message: choice, value: choice };
    } else {
      choice = { ...choice };
    }
    if (choice.choices) {
      choice.choices = this.normalizeChoices(choice.choices, choice);
    }
    Reflect.defineProperty(choice, 'parent', { value: parent });
    choice.indent = '';
    return choice;
  }

  async update(typed) {
    return this.choices || [];
  }

  toList(choices = this.choices) {
    return choices.slice(0, this.limit);
  }

  find(value, prop) {
    const find = () => {
      switch (typeof value) {
        case 'undefined': return;
        case 'object':
          return value;
        case 'number':
          return this.choices.find(ch => ch.index === value);
        case 'string':
          return this.choices.find(ch => ch.alias === value || ch.name === value);
        case 'function':
          return this.choices.find(value.bind(this));
        default: {
          throw new TypeError(`invalid type: "${typeof value}"`);
        }
      }
    };

    let choice = find();
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    let choice = this.find(value);
    if (choice) {
      return this.choices.indexOf(choice);
    }
    return -1;
  }

  number(i) {
    let n = +i;
    let choice = this.find(n);

    if (!choice) {
      this.alert();
      return false;
    }

    if (this.list.includes(choice)) {
      this.moveCursor(this.list.indexOf(choice));
      this.render();
      return true;
    }

    if (this.options.scroll === false) {
      this.alert();
      return false;
    }

    let currentIdx = this.choices.indexOf(choice);
    let posChoice = this.list[this.cursor];
    let pos = posChoice.index;
    let idx = choice.index;
    let start, end;

    if (idx <= pos) {
      this.cursor = 0;
      start = this.choices.slice(currentIdx);
      end = this.choices.slice(0, currentIdx);
    } else {
      this.cursor = this.list.length - 1;
      start = this.choices.slice(currentIdx - this.list.length + 1);
      end = this.choices.filter(choice => !start.includes(choice));
    }

    this.choices = start.concat(end);
    this.list = this.toList();
    this.render();
    return true;
  }

  moveCursor(i) {
    this.cursor = i;
  }

  reset() {
    this.moveCursor(first(this.options.cursor, this.initial, 0));
    this.render();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }
  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  prev() {
    this.up();
  }
  next() {
    this.down();
  }

  up() {
    let pos = this.cursor - 1;
    let len = this.list.length;
    if (!len) return this.alert();
    if (this.options.scroll !== false && len < this.choices.length && pos === -1) {
      return this.scrollUp();
    }
    if (pos < 0) pos = len - 1;
    this.moveCursor(pos);
    this.render();
    let selected = this.list[this.cursor];
    if (selected && selected.disabled || selected.collapsed === true) {
      this.up();
    }
  }
  down() {
    let pos = this.cursor + 1;
    let len = this.list.length;
    if (!len) return this.alert();
    if (this.options.scroll !== false && len < this.choices.length && pos === len) {
      return this.scrollDown();
    }
    if (pos === len) pos = 0;
    this.moveCursor(pos);
    this.render();
    let selected = this.list[this.cursor];
    if (selected && selected.disabled || selected.collapsed === true) {
      this.down();
    }
  }

  scrollUp() {
    let list = this.choices.slice();
    let item = list.pop();
    this.choices = [item, ...list];
    this.list = this.toList();
    this.render();
    let selected = this.list[this.cursor];
    if (selected && (selected.disabled || selected.collapsed === true)) {
      this.up();
    }
  }
  scrollDown() {
    let list = this.choices.slice();
    let item = list.shift();
    this.choices = [...list, item];
    this.list = this.toList();
    this.render();
    let selected = this.list[this.cursor];
    if (selected && (selected.disabled || selected.collapsed === true)) {
      this.down();
    }
  }

  shiftUp() {
    this.scrollUp();
  }
  shiftDown() {
    this.scrollDown();
  }

  pageUp() {
    if (this.limit <= 1) return this.alert();
    this.limit--;
    if (this.limit <= this.cursor) {
      this.cursor = this.limit - 1;
    }
    this.list = this.toList();
    this.render();
  }
  pageDown() {
    if (this.limit === this.choices.length) return this.alert();
    this.limit++;
    if (this.limit > this.choices.length) {
      this.cursor = 0;
    }
    this.list = this.toList();
    this.render();
  }

  exceedsMaxSelected(max = this.maxSelected) {
    return max && [].concat(this.selected || []).length > max;
  }

  renderFooter() {
    if (!this.answered && this.footer && this.list.length < this.choices.length) {
      return this.footer ? '\n' + this.footer : '';
    }
    return '';
  }

  renderChoice(choice) {
    return choice.message;
  }

  renderChoices() {
    let list = this.list.map(this.renderChoice.bind(this)).join('\n');
    return !this.answered && list ? ('\n' + list) : '';
  }

  submit(value) {
    if (value !== void 0) {
      return super.submit(value);
    }

    let selected = this.options.value ? this.find(this.options.value) : this.selected;
    this.value = Array.isArray(selected)
      ? selected.map(choice => choice.value)
      : selected.value;

    return super.submit();
  }

  set limit(num) {
    this._limit = num;
  }
  get limit() {
    return this._limit || Math.min(this.options.limit || this.list && this.list.length || this.choices.length, this.height);
  }

  get selected() {
    return this.choices.filter(choice => choice.enabled);
  }

  static get ArrayPrompt() {
    return ArrayPrompt;
  }
}

function hasChildren(choice) {
  for (let key of Object.keys(choice)) {
    if (Array.isArray(choice[key])) {
      return true;
    }
    if (isObject(choice[key])) {
      return hasChildren(choice[key]);
    }
  }
  return false;
}

module.exports = ArrayPrompt;
