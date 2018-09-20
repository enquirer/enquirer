'use strict';

const Prompt = require('../prompt');
const symbols = require('../style/symbols');
const utils = require('../utils');
const { first, increment, decrement } = utils;

class ArrayPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.defaults = { ...this.options.values };
    this.choices = this.addChoices(this.options.choices);
    this.visible = this.choices.slice();
    this.length = this.choices.length;
    this.initial = [].concat(first([this.options.selected, this.options.initial, []]));
    this.autofocus = this.options.autofocus || 0;
    this.longest = 0;
    this.updateChoices();
  }

  initialize() {
    super.initialize();
    this.updateChoices();
  }

  choice(ele, i, parent) {
    if (typeof ele === 'string') ele = { name: ele };
    let choice = { ...ele };
    choice.name = choice.name || choice.message || choice.key || choice.value;
    choice.message = choice.message || choice.name || choice.title;
    choice.value = choice.value || choice.name;
    choice.cursor = 0;
    choice.typed = '';
    choice.index = this.index++;
    choice.enabled = !choice.disabled && (choice.enabled || this.isSelected(choice));
    choice.prefix = choice.prefix || symbols.rightAngle;

    if (choice.disabled === true && !choice.hint) {
      choice.hint = '(disabled)';
    }

    if (typeof choice.disabled === 'string' && !choice.hint) {
      choice.hint = choice.disabled;
      choice.disabled = true;
    }

    choice.parent = parent ? parent.name : null;
    choice.indent = parent ? parent.indent + '  ' : (choice.indent || '');

    this.longest = Math.max(this.longest, choice.message.length);
    return choice;
  }

  isSelected(choice) {
    if (!this.initial) return false;
    return this.initial.some(val => [choice.name, choice.index].includes(val));
  }

  addChoices(choices) {
    this.index = 0;
    const toChoices = (list, parent) => {
      if (Array.isArray(list)) {
        return list.map(ch => this.choice(ch, this.index, parent));
      }
      let result = [];
      for (let key of Object.keys(list)) {
        let group = this.choice(key, this.index, parent);
        result.push(group);
        let ele = list[key];
        if (ele && typeof ele === 'object') {
          group.choices = toChoices(ele, group);
          group.choices.forEach(c => result.push(c));
        } else {
          group.value = ele;
        }
      }
      return result;
    };
    return toChoices(choices);
  }

  updateChoices(choices = this.choices) {
    this.choices = choices.map(this.choice.bind(this));
    this.visible = this.updateVisible();
    this.emit('choices', this);
  }

  updateVisible(choices = this.choices) {
    return choices.slice(0, this.state.limit);
  }

  increment() {
    increment(this, 'index', this.state.limit);
  }
  decrement() {
    decrement(this, 'index', this.state.limit);
  }

  dispatch(ch) {
    if (!ch || !this.options.multiple) return this.alert();

    if (ch === 'g') {
      let choice = this.choice;
      this.toggle((choice.parent && !choice.choices) ? choice.parent : choice);
    }

    if (ch === 'a') {
      let enabled = this.isEnabled(this.state);
      this.each(ch => (ch.enabled = !enabled));
    }

    if (ch === 'i') {
      if (this.maxChoices < this.length) return this.alert();
      this.each(this.toggle.bind(this));
    }

    this.render();
  }

  find(value, prop) {
    let isChoice = ch => [ch.index, ch.name].includes(value);
    let find = typeof value === 'function' ? value : isChoice;
    let choice = this.choices.find(find.bind(this));
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.choices.indexOf(this.find(value));
  }

  filter(fn) {
    return this.choices.filter(fn.bind(this));
  }

  map(key) {
    return this.choices.map(choice => choice[key]);
  }

  each(fn) {
    this.choices.forEach(fn.bind(this));
  }

  number(i) {
    let choice = this.find(i);
    if (!choice) {
      this.alert();
      return false;
    }

    if (this.visible.includes(choice)) {
      this.state.index = this.visible.indexOf(choice);
      this.render();
      return true;
    }

    if (this.options.scroll === false) {
      this.alert();
      return false;
    }

    let currentIdx = this.findIndex(choice);
    let posChoice = this.visible[this.index];
    let pos = posChoice.index;
    let idx = choice.index;
    let start, end;

    if (idx <= pos) {
      this.state.index = 0;
      start = this.choices.slice(currentIdx);
      end = this.choices.slice(0, currentIdx);
    } else {
      this.state.index = this.visible.length - 1;
      start = this.choices.slice(currentIdx - this.visible.length + 1);
      end = this.choices.filter(choice => !start.includes(choice));
    }

    this.choices = start.concat(end);
    this.visible = this.updateVisible();
    this.render();
    return true;
  }

  first() {
    this.state.index = 0;
    this.render();
  }
  last() {
    this.state.index = this.length - 1;
    this.render();
  }

  up() {
    this.state.index--;
    if (this.state.index < 0) this.state.index = this.choices.length - 1;
    this.render();
  }
  down() {
    this.state.index = ++this.state.index % this.choices.length;
    this.render();
  }

  prev() {
    this.up();
  }
  next() {
    this.down();
  }

  addRow() {
    if (this.state.limit >= this.length) return this.alert();
    if (++this.state.limit === this.length) {
      this.state.index = 0;
    }
    this.updateVisible();
    this.render();
  }
  removeRow() {
    if (this.state.limit <= 1) return this.alert();
    if (--this.state.limit === this.state.index) {
      this.state.index = this.state.limit - 1;
    }
    this.updateVisible();
    this.render();
  }

  pageDown() {
    this.addRow();
  }
  pageUp() {
    this.removeRow();
  }

  async submit(val) {
    if (utils.isValue(val)) return super.submit(val);

    let choice = this.selected;
    this.value = this.options.multiple === true
      ? choice.map(choice => choice.value)
      : choice ? choice.value : this.choices[0].value;

    return super.submit(this.value);
  }

  get current() {
    return this.state.choices[this.state.index];
  }

  get selected() {
    if (this.options.multiple) {
      return this.filter(choice => choice.enabled);
    }
    let choice = this.find(choice => choice.enabled);
    return choice || this.choices[this.state.index];
  }
}

module.exports = ArrayPrompt;
