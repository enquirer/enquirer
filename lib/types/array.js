'use strict';

const first = (...args) => args.find(v => v != null);
const Prompt = require('../prompt');

class ArrayPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.scroll = options.scroll !== false;
    this.multiple = options.multiple === true;
    this.initial = [].concat(first(options.initial, options.selected, []));
  }

  initialize() {
    this.index = first(this.options.index, this.options.autofocus, 0);
    this.state.choices = this.state.choices.map(this.choice.bind(this));
    return super.initialize();
  }

  reset(render = true) {
    this.index = first(this.options.index, this.options.autofocus, 0);
    render && this.render();
  }

  dispatch(ch, key) {
    if (this.typeahead) return this.typeahead(ch, key);
    if (this.complete) return this.complete(ch, key);
    this.alert();
  }

  space() {
    if (!this.multiple) return this.alert();
    this.toggle(this.focused);
    this.render();
  }

  a() {
    const enabled = this.enabled(this);
    this.state.choices.forEach(choice => (choice.enabled = !enabled));
    this.render();
  }

  i() {
    this.state.choices.forEach(this.toggle.bind(this));
    this.render();
  }

  g() {
    const choice = this.focused;
    this.toggle((choice.parent && !choice.choices) ? choice.parent : choice);
    this.render();
  }

  skipChoice(choice = this.visible[this.index]) {
    return (choice && (choice.disabled || choice.collapsed || choice.hidden));
  }

  first() {
    this.index = 0;
    this.render();
  }
  last() {
    this.index = this.length - 1;
    this.render();
  }

  up() {
    let len = this.length;
    let vis = this.visible.length;

    if (len > vis && this.index === 0) {
      return this.scrollUp();
    }

    this.index = ((this.index - 1 % len) + len) % len;

    if (this.skipChoice()) {
      return this.up();
    }

    this.render();
  }

  down() {
    let len = this.length;
    let vis = this.visible.length;

    if (len > vis && this.index === vis - 1) {
      return this.scrollDown();
    }

    this.index = ++this.index % len;

    if (this.skipChoice()) {
      return this.down();
    }

    this.render();
  }

  shiftUp() {
    this.scrollUp(this.index);
  }
  shiftDown() {
    this.scrollDown(this.index);
  }

  scrollUp(i = 0) {
    let choices = this.state.choices;
    this.state.choices = [choices.pop(), ...choices];
    this.index = i;
    if (this.skipChoice()) {
      return this.up();
    }
    this.render();
  }
  scrollDown(i = this.limit - 1) {
    let choices = this.state.choices;
    this.state.choices = [...choices.slice(1), choices[0]];
    this.index = i;
    if (this.skipChoice()) {
      return this.down();
    }
    this.render();
  }

  pageup() {
    if (this.limit <= 1) return this.alert();
    this.limit = Math.max(this.limit - 1, 0);
    this.index = Math.min(this.limit - 1, this.index);
    if (this.skipChoice()) {
      return this.up();
    }
    this.render();
  }

  pagedown() {
    if (this.limit >= this.length) return this.alert();
    this.index = Math.max(0, this.index);
    this.limit = Math.min(this.limit + 1, this.length);
    if (this.skipChoice()) {
      return this.down();
    }
    this.render();
  }

  toggle(choice = this.focused) {
    choice.enabled = !choice.enabled;
    choice.choices && choice.choices.forEach(this.toggle.bind(this));
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
    return [choice.name, choice.index].includes(value);
  }

  isSelected(choice) {
    if (Array.isArray(this.initial)) {
      return this.initial.some(val => this.isChoice(choice, val));
    }
    return this.isChoice(choice, this.initial);
  }

  focus(choice, enabled = this.multiple) {
    this.index = choice.index;
    choice.enabled = enabled;
  }

  find(value, prop) {
    let isChoice = ch => this.isChoice(ch, value);
    let find = typeof value === 'function' ? value : isChoice;
    let choice = this.state.choices.find(find.bind(this));
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.state.choices.indexOf(this.find(value));
  }

  map(key = 'value') {
    return this.state.choices.map(choice => choice[key]);
  }

  choice(choice, i, parent) {
    choice.index = i;
    choice.name = choice.name || choice.message || choice.key || choice.value;
    choice.message = choice.message || choice.name || choice.title;
    choice.value = choice.value || choice.name;
    choice.typed = '';

    choice.enabled = !choice.disabled && (choice.enabled || this.isSelected(choice));
    choice.pointer = choice.pointer || this.symbols.pointer;

    choice.parent = parent ? parent.name : null;
    choice.indent = parent ? parent.indent + '  ' : (choice.indent || '');
    return choice;
  }

  async submit(val) {
    if (val != null && val.trim() !== '') return super.submit(val);

    let choice = this.selected;
    this.value = this.multiple === true
      ? choice.map(choice => choice.value)
      : (choice ? choice.value : this.state.choices[0].value);

    return super.submit(this.value);
  }

  get visible() {
    return this.state ? this.state.choices.slice(0, this.limit) : [];
  }

  get length() {
    return this.state.choices.length;
  }

  set limit(i) {
    this.state.limit = i;
  }
  get limit() {
    return this.state ? this.state.limit : 0;
  }

  set index(i) {
    this.state.index = i;
  }
  get index() {
    return this.state ? this.state.index : 0;
  }

  get focused() {
    return this.state.choices[this.index];
  }

  get selected() {
    return this.multiple ? this.filter(choice => choice.enabled) : this.focused;
  }
}

module.exports = ArrayPrompt;
