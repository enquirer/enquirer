'use strict';

const Choice = require('../choice');
const Prompt = require('../prompt');
const utils = require('../utils');

class ArrayPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.choices = this.options.choices || [];
    this.defaults = { ...this.options.values };
    this.initial = utils.first(this.options.initial, this.options.selected);
    this.choices = this.choices.map((ele, i) => new Choice(ele, this, i));
    this.length = this.choices.length;
    this.updateChoices();
  }

  async initialize() {
    await super.initialize();
    this.updateChoices();
    this.state.index = Math.max(this.findIndex(this.initial), 0);
  }

  updateChoices(choices = this.choices) {
    this.state.choices = choices.slice();
    this.state.visible = this.updateVisible();
  }

  updateVisible(choices = this.state.choices) {
    return choices.slice(0, this.state.limit);
  }

  increment() {
    utils.increment(this, 'index', this.state.limit);
  }
  decrement() {
    utils.decrement(this, 'index', this.state.limit);
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
    let choice = this.state.choices.find(find.bind(this));
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.state.choices.indexOf(this.find(value));
  }

  filter(fn) {
    return this.state.choices.filter(fn.bind(this));
  }

  map(key) {
    return this.state.choices.map(choice => choice[key]);
  }

  each(fn) {
    this.state.choices.forEach(fn.bind(this));
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
    if (this.state.index < 0) this.state.index = this.state.choices.length - 1;
    this.render();
  }
  down() {
    this.state.index = ++this.state.index % this.state.choices.length;
    this.render();
  }

  prev() {
    this.up();
  }
  next() {
    this.down();
  }

  pageDown() {
    this.addRow();
  }
  pageUp() {
    this.removeRow();
  }

  submit(val) {
    if (utils.isValue(val)) return super.submit(val);

    let choice = this.selected;
    let value = this.options.multiple === true
      ? choice.map(choice => choice.value)
      : choice ? choice.value : void 0;

    return super.submit(value);
  }

  get selected() {
    return this[this.options.multiple ? 'filter' : 'find'](ch => ch.enabled);
  }
}

module.exports = ArrayPrompt;
