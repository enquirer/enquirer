'use strict';

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
    this.limit = this.options.limit || this.length;
    this.index = this.options.index || 0;
    this.updateChoices();
  }

  async initialize() {
    super.initialize();
    this.updateChoices();

    if (typeof this.initial === 'number') {

    }
  }

  updateChoices(choices = this.choices) {
    this.choices = choices.slice();
    this.visible = this.updateVisible();
  }

  updateVisible(choices = this.choices) {
    return choices.slice(0, this.limit);
  }

  increment() {
    utils.increment(this, 'index', this.limit);
  }
  decrement() {
    utils.decrement(this, 'index', this.limit);
  }

  find(value, prop) {
    let isChoice = ch => ch.index === value || [ch.name, ch.value].includes(value);
    let choice = this.choices.find(isChoice);
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.choices.indexOf(this.find(value));
  }

  addRow() {
    if (this.limit >= this.length) return this.alert();
    if (++this.limit === this.length) {
      this.index = 0;
    }
    this.updateVisible();
    this.render();
  }
  removeRow() {
    if (this.limit <= 1) return this.alert();
    if (--this.limit === this.index) {
      this.index = this.limit - 1;
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

  first() {
    this.index = 0;
    this.render();
  }
  last() {
    this.index = this.length - 1;
    this.render();
  }

  submit(val) {
    let selected = this.options.value ? this.find(this.options.value) : this.selected;

    this.state.value = Array.isArray(selected)
      ? selected.map(choice => choice.value)
      : selected.value;

    return super.submit();
  }

  get selected() {
    return this.choices.filter(choice => choice.enabled);
  }
}

module.exports = ArrayPrompt;
