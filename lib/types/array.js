'use strict';

const colors = require('ansi-colors');
const symbols = require('../style/symbols');
const Choice = require('../choice');
const Prompt = require('../prompt');
const utils = require('../utils');

/**
 * - cursor - position of cursor in a typed value
 * - index - position of currently selected item in an array of items
 *
 * Tips:
 * - cursor and typed value only change from append and delete
 */

class ArrayPrompt extends Prompt {
  constructor(options) {
    super(options);
    let choices = this.options.choices || [];
    this.defaults = { ...this.options.values };
    this.choices = choices.map((ele, i) => new Choice(ele, i, this));
    this.length = choices.length;
    this.state.limit = this.options.limit || this.length;
    this.updateChoices();
  }

  async initialize() {
    await super.initialize();
    this.updateChoices();
    this.state.index = Math.max(this.findIndex(this.initial || this.options.index), 0);
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

  find(value, prop) {
    let isChoice = ch => ch.index === value || [ch.name, ch.value].includes(value);
    let choice = this.state.choices.find(isChoice);
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

  submit() {
    let selected = this.selected;
    this.state.value = Array.isArray(selected)
      ? selected.map(choice => choice.value)
      : selected.value;

    return super.submit();
  }

  get selected() {
    return this.filter(choice => choice.enabled);
  }
}

module.exports = ArrayPrompt;
