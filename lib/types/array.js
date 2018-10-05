'use strict';

const Prompt = require('../prompt');
const { choice, choices, increment, decrement } = require('../utils');

class ArrayPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.longest = 0;
    this.scroll = this.options.scroll !== false;
    this.multiple = this.options.multiple === true;
    this.index = this.options.index || 0;
    this.min = this.options.min || 2;
  }

  async initialize() {
    await this.reset();
    await super.initialize();
  }

  async reset() {
    if (!this.initialState) this.initialState = this.state.clone();
    this.state = this.initialState.clone();
    let choices = this.options.choices;

    if (Array.isArray(choices)) {
      for (let i = 0; i < choices.length; i++) {
        if (typeof choices[i] === 'function') {
          choices[i] = await choices[i](this);
        }
      }
    }

    this.allChoices = [];
    this.choices = await this.toChoices(choices);
    let initial = this.options.initial;
    if (typeof initial === 'string') initial = this.findIndex(initial);
    if (typeof initial === 'number' && initial > -1) {
      this.index = Math.max(0, Math.min(initial, this.choices.length));
    }
  }

  async toChoices(items = this.options.choices || []) {
    if (typeof items === 'function') {
      items = await items.call(this);
    }
    let arr = await Promise.all(choices(items));
    return arr.map(this.toChoice.bind(this));
  }

  toChoice(ele, i) {
    ele = choice(ele, i);
    ele.enabled = this.multiple && !ele.disabled && (ele.enabled || this.isSelected(ele));
    ele.pointer = ele.pointer || this.symbols.pointer;
    this.longest = Math.max(this.longest, ele.message.length);
    return ele;
  }

  dispatch(s, key) {
    if (this.typeahead) return this.typeahead(s, key);
    if (this.complete) return this.complete(s, key);
    this.alert();
  }

  number(s) {
    let idx = this.findIndex(Number(s));
    if (idx === -1) return this.alert();
    this.index = idx;
    this.toggle();
    return this.render();
  }

  space() {
    if (!this.multiple) return this.alert();
    this.toggle(this.focused);
    return this.render();
  }

  a() {
    const enabled = this.isEnabled(this);
    this.choices.forEach(choice => (choice.enabled = !enabled));
    return this.render();
  }

  i() {
    this.choices.forEach(this.toggle.bind(this));
    return this.render();
  }

  g() {
    const choice = this.focused;
    this.toggle((choice.parent && !choice.choices) ? choice.parent : choice);
    return this.render();
  }

  skipChoice(choice = this.focused) {
    return choice.disabled || choice.collapsed || choice.hidden;
  }

  first() {
    this.index = 0;
    return this.render();
  }
  last() {
    this.index = this.length - 1;
    return this.render();
  }

  up() {
    let len = this.choices.length;
    let vis = this.visible.length;

    if (len > vis && this.index === 0) {
      return this.scrollUp();
    }

    this.index = ((this.index - 1 % len) + len) % len;

    if (this.skipChoice()) {
      return this.up();
    }

    return this.render();
  }

  down() {
    let len = this.choices.length;
    let vis = this.visible.length;

    if (len > vis && this.index === vis - 1) {
      return this.scrollDown();
    }

    this.index = (this.index + 1) % len;

    if (this.skipChoice()) {
      return this.down();
    }

    return this.render();
  }

  prev() {
    if (this.visible.length <= 1) return this.alert();
    this.up();
  }
  next() {
    if (this.visible.length <= 1) return this.alert();
    this.down();
  }

  shiftUp() {
    this.scrollUp(this.index);
  }
  shiftDown() {
    this.scrollDown(this.index);
  }

  scrollUp(i = 0) {
    let choices = this.choices;
    this.choices = [choices.pop(), ...choices];
    this.index = i;
    if (this.skipChoice()) {
      return this.up();
    }
    return this.render();
  }
  scrollDown(i = this.visible.length - 1) {
    let choices = this.choices;
    this.choices = [...choices.slice(1), choices[0]];
    this.index = i;
    if (this.skipChoice()) {
      return this.down();
    }
    return this.render();
  }

  pageUp() {
    if (this.visible.length <= 1) return this.alert();
    this.limit = Math.max(this.limit - 1, 0);
    this.index = Math.min(this.limit - 1, this.index);
    if (this.skipChoice()) {
      return this.up();
    }
    return this.render();
  }

  pageDown() {
    if (this.visible.length >= this.length) return this.alert();
    this.index = Math.max(0, this.index);
    this.limit = Math.min(this.limit + 1, this.length);
    if (this.skipChoice()) {
      return this.down();
    }
    return this.render();
  }

  increment(max = this.limit) {
    this.index = increment(this.index, max);
  }

  decrement(min = 1) {
    this.index = decrement(this.index, min);
  }

  toggle(choice = this.focused) {
    choice.enabled = !choice.enabled;
    choice.choices && choice.choices.forEach(this.toggle.bind(this));
    return choice;
  }

  enable(choice) {
    choice.enabled = true;
    choice.choices && choice.choices.forEach(this.enable);
    return choice;
  }

  isEnabled(choice) {
    return choice.choices ? choice.choices.every(this.isEnabled) : !!choice.enabled;
  }

  isChoice(choice, value) {
    return choice.name === value || choice.index === Number(value);
  }

  isSelected(choice) {
    if (Array.isArray(this.options.initial)) {
      return this.initial.some(value => this.isChoice(choice, value));
    }
    return this.isChoice(choice, this.options.initial);
  }

  focus(choice, enabled = this.multiple) {
    this.index = choice.index;
    choice.enabled = enabled;
  }

  filter(value) {
    let isChoice = (ele, i, arr) => [ele.name, i].includes(value);
    let filter = typeof value === 'function' ? value : isChoice;
    return this.choices.filter(filter);
  }

  find(value, prop) {
    let isChoice = (ele, i, arr) => [ele.name, i].includes(value);
    let find = typeof value === 'function' ? value : isChoice;
    let choice = this.choices.find(find);
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.choices.indexOf(this.find(value));
  }

  map(key = 'value') {
    return this.choices.map(choice => choice[key]);
  }

  async submit(val) {
    if (val != null && (typeof val !== 'string' || val.trim() !== '')) {
      return super.submit(val);
    }

    let choice = this.selected || this.focused;
    this.value = this.multiple === true
      ? choice.map(choice => choice.value)
      : choice ? choice.value : void 0;

    return super.submit(this.value);
  }

  set choices(choices = []) {
    this.state.choices = choices;
    for (let choice of choices) {
      if (this.allChoices && !this.allChoices.find(ch => ch.name === choice.name)) {
        this.allChoices.push(choice);
      }
    }
  }
  get choices() {
    return this.state.choices || [];
  }

  set visible(choices = []) {
    this.state.visible = choices;
  }
  get visible() {
    let choices = this.state.visible || this.choices || [];
    return choices.slice(0, this.limit);
  }

  set limit(num) {
    this.state.limit = num;
  }
  get limit() {
    let limit = this.state.limit || this.options.limit || this.choices.length;
    return Math.min(limit, this.stdout.rows - 5);
  }

  get length() {
    return this.choices.length;
  }

  set index(i) {
    this.state.index = i;
  }
  get index() {
    return Math.max(0, this.state ? this.state.index : 0);
  }

  get focused() {
    return this.choices[this.index];
  }

  get selected() {
    return this.multiple ? this.filter(choice => choice.enabled) : this.focused;
  }
}

module.exports = ArrayPrompt;
