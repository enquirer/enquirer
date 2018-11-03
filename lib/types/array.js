'use strict';

const { reorder, scrollUp, scrollDown, isObject, swap } = require('../utils');
const Prompt = require('../prompt');

class ArrayPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.maxChoices = options.maxChoices || Infinity;
    this.initial = options.initial || 0;
    this.longest = 0;
    this.cursorHide();
    this.fns = [];
  }

  async initialize() {
    await this.reset(true);
    await super.initialize();
  }

  async reset() {
    let { choices, initial, autofocus } = this.options;
    this.state._choices = [];
    this.state.choices = [];

    this.choices = await Promise.all(await this.toChoices(choices));
    this.choices.forEach(ch => (ch.enabled = false));

    if (isObject(initial)) initial = Object.keys(initial);
    if (Array.isArray(initial)) {
      if (autofocus != null) this.index = this.findIndex(autofocus);
      initial.forEach(v => this.enable(this.find(v)));
      return this.render();
    }

    if (autofocus != null) initial = autofocus;
    if (typeof initial === 'string') initial = this.findIndex(initial);
    if (typeof initial === 'number' && initial > -1) {
      this.index = Math.max(0, Math.min(initial, this.choices.length));
      this.enable(this.find(this.index));
    }
  }

  async toChoices(choices, parent) {
    if (typeof choices === 'function') choices = await choices.call(this);

    if (Array.isArray(choices)) {
      for (let i = 0; i < choices.length; i++) {
        if (typeof choices[i] === 'function') {
          choices[i] = await choices[i](this);
        }
      }
    }

    if (isObject(choices)) {
      choices = toArray(choices);
    }

    let list = await Promise.all(choices);
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      item = await this.toChoice(item, i, parent);
      if (item.choices) {
        item.choices = await this.toChoices(item.choices, item);
      }
      list[i] = item;
    }

    return list;
  }

  async toChoice(ele, i, parent) {
    if (ele instanceof Promise) ele = await ele;
    if (typeof ele === 'function') ele = await ele.call(this);
    if (typeof ele === 'string') ele = { name: ele };
    if (ele.normalized === true) return ele;
    ele.normalized = true;

    if (typeof ele.disabled === 'string') {
      ele.hint = ele.disabled;
      ele.disabled = true;
    }

    if (ele.disabled === true && !ele.hint) {
      ele.hint = '(disabled)';
    }

    if (ele.index != null) return ele;
    ele.name = ele.name || ele.key || ele.title || ele.value || ele.message;
    ele.message = ele.message || ele.name;
    ele.value = ele.value || ele.name;

    ele.cursor = 0;
    ele.input = '';
    ele.index = i;

    ele.parent = parent;
    ele.indent = parent ? parent.indent + '  ' : (ele.indent || '');
    ele.enabled = !!(this.multiple && !ele.disabled && (ele.enabled || this.isSelected(ele)));

    if (typeof ele.initial === 'function') {
      ele.initial = await ele.initial.call(this, this.state, ele, i);
    }

    this.longest = Math.max(this.longest, ele.message.length);
    let init = { ...ele };

    ele.reset = (input = init.input, value = init.value) => {
      for (let key of Object.keys(init)) ele[key] = init[key];
      ele.input = input;
      ele.value = value;
    };
    return ele;
  }

  async onChoice(choice, i) {
    if (typeof choice.onChoice === 'function') {
      await choice.onChoice.call(this, this.state, choice, i);
    }
  }

  dispatch(s, key) {
    if (this.options.multiple && this[key.name]) {
      return this[key.name]();
    }
    this.alert();
  }

  focus(choice, enabled) {
    if (typeof enabled !== 'boolean') enabled = choice.enabled;
    this.index = choice.index;
    choice.enabled = enabled && !this.skipChoice(choice);
    return choice;
  }

  space() {
    if (!this.options.multiple) return this.alert();
    this.toggle(this.focused);
    return this.render();
  }

  a() {
    let choices = this.choices.filter(ch => !this.skipChoice(ch));
    let enabled = choices.every(ch => ch.enabled);
    this.choices.forEach(ch => (ch.enabled = !enabled));
    return this.render();
  }

  i() {
    this.choices.forEach(ch => (ch.enabled = !ch.enabled));
    return this.render();
  }

  g(choice = this.focused) {
    if (!this.choices.some(ch => !!ch.parent)) return this.a();
    this.toggle((choice.parent && !choice.choices) ? choice.parent : choice);
    return this.render();
  }

  toggle(choice, enabled) {
    if (typeof enabled !== 'boolean') enabled = !choice.enabled;
    choice.enabled = enabled;

    if (choice.choices) {
      choice.choices.forEach(ch => this.toggle(ch, enabled));
    }

    let parent = choice.parent;
    while (parent) {
      let choices = parent.choices.filter(ch => ch.disabled);
      parent.enabled = choices.every(ch => ch.enabled);
      parent = parent.parent;
    }

    reset(this, this.choices);
    return choice;
  }

  enable(choice) {
    choice.enabled = !this.skipChoice(choice);
    choice.choices && choice.choices.forEach(ch => this.enable(ch));
    return choice;
  }

  disable(choice) {
    choice.enabled = false;
    choice.choices && choice.choices.forEach(this.disable.bind(this));
    return choice;
  }

  number(n) {
    let i = Number(n);
    if (i > this.choices.length - 1) return this.alert();

    let focused = this.focused;
    let choice = this.choices.find(ch => i === ch.index);

    if (this.visible.indexOf(choice) === -1) {
      let choices = reorder(this.choices);
      let actualIdx = choices.indexOf(choice);

      if (focused.index > actualIdx) {
        let start = choices.slice(actualIdx, actualIdx + this.limit);
        let end = choices.filter(ch => !start.includes(ch));
        this.choices = start.concat(end);
      } else {
        let pos = actualIdx - this.limit + 1;
        this.choices = choices.slice(pos).concat(choices.slice(0, pos));
      }
    }

    this.index = this.choices.indexOf(choice);
    this.toggle(this.focused);
    return this.render();
  }

  home() {
    this.choices = reorder(this.choices);
    this.index = 0;
    return this.render();
  }

  end() {
    let pos = this.choices.length - this.limit;
    let choices = reorder(this.choices);
    this.choices = choices.slice(pos).concat(choices.slice(0, pos));
    this.index = this.limit - 1;
    return this.render();
  }

  first() {
    this.index = 0;
    return this.render();
  }

  last() {
    this.index = this.visible.length - 1;
    return this.render();
  }

  prev() {
    if (this.visible.length <= 1) return this.alert();
    return this.up();
  }

  next() {
    if (this.visible.length <= 1) return this.alert();
    return this.down();
  }

  right() {
    if (this.cursor >= this.input.length) return this.alert();
    this.cursor++;
    return this.render();
  }

  left() {
    if (this.cursor <= 0) return this.alert();
    this.cursor--;
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

  scrollUp(i = 0) {
    this.choices = scrollUp(this.choices);
    this.index = i;
    if (this.skipChoice()) {
      return this.up();
    }
    return this.render();
  }

  scrollDown(i = this.visible.length - 1) {
    this.choices = scrollDown(this.choices);
    this.index = i;
    if (this.skipChoice()) {
      return this.down();
    }
    return this.render();
  }

  shiftUp() {
    if (this.options.sort === true) {
      this.swap(this.index - 1);
      return this.up();
    }
    return this.scrollUp(this.index);
  }

  shiftDown() {
    if (this.options.sort === true) {
      this.swap(this.index + 1);
      return this.down();
    }
    return this.scrollDown(this.index);
  }

  pageUp() {
    if (this.visible.length <= 1) return this.alert();
    this.limit = Math.max(this.limit - 1, 0);
    this.index = Math.min(this.limit - 1, this.index);
    this._limit = this.limit;
    if (this.skipChoice()) {
      return this.up();
    }
    return this.render();
  }

  pageDown() {
    if (this.visible.length >= this.choices.length) return this.alert();
    this.index = Math.max(0, this.index);
    this.limit = Math.min(this.limit + 1, this.choices.length);
    this._limit = this.limit;
    if (this.skipChoice()) {
      return this.down();
    }
    return this.render();
  }

  swap(pos) {
    swap(this.choices, this.index, pos);
  }

  skipChoice(choice = this.focused) {
    if (choice) {
      return choice.disabled || choice.collapsed || choice.hidden || choice.completing;
    }
  }

  isEnabled(choice = this.focused) {
    if (Array.isArray(choice)) return choice.every(ch => this.isEnabled(ch));
    if (choice.choices) {
      let choices = choice.choices.filter(ch => !this.skipChoice(ch));
      return choice.enabled && choices.every(ch => this.isEnabled(ch));
    }
    return choice.enabled && !this.skipChoice(choice);
  }

  isChoice(choice, value) {
    return choice.name === value || choice.index === Number(value);
  }

  isSelected(choice) {
    if (Array.isArray(this.initial)) {
      return this.initial.some(value => this.isChoice(choice, value));
    }
    return this.isChoice(choice, this.initial);
  }

  filter(value, prop) {
    let isChoice = (ele, i) => [ele.name, i].includes(value);
    let fn = typeof value === 'function' ? value : isChoice;
    let result = this.choices.filter(fn);
    if (prop) {
      return result.map(ch => ch[prop]);
    }
    return result;
  }

  find(value, prop) {
    if (isObject(value)) return prop ? value[prop] : value;
    let isChoice = (ele, i) => [ele.name, i].includes(value);
    let fn = typeof value === 'function' ? value : isChoice;
    let choice = this.choices.find(fn);
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.choices.indexOf(this.find(value));
  }

  map(names = [], prop = 'value') {
    return names.reduce((acc, name) => {
      acc[name] = this.find(name, prop);
      return acc;
    }, {});
  }

  async submit() {
    if (this.options.reorder !== false && this.options.sort !== true) {
      this.choices = reorder(this.choices);
    }
    let result = this.options.multiple ? this.selected : this.focused;
    if (result === void 0) return this.alert();
    this.value = Array.isArray(result) ? result.map(ch => ch.name) : result.name;
    return super.submit();
  }

  set choices(choices = []) {
    this.state._choices = this.state._choices || [];
    this.state.choices = choices;

    for (let choice of choices) {
      if (!this.state._choices.some(ch => ch.name === choice.name)) {
        this.state._choices.push(choice);
      }
    }

    if (!this.setInitial && this.options.initial) {
      this.setInitial = true;
      let init = this.initial;
      if (typeof init === 'string' || typeof init === 'number') {
        let choice = this.find(init);
        if (choice) {
          this.initial = choice.index;
          this.focus(choice, true);
        }
      }
    }
  }
  get choices() {
    return reset(this, this.state.choices || []);
  }

  set visible(visible) {
    this.state.visible = visible;
  }
  get visible() {
    return (this.state.visible || this.choices).slice(0, this.limit);
  }

  set limit(num) {
    this.state.limit = num;
  }
  get limit() {
    let limit = this.state.limit || this._limit || this.options.limit || this.choices.length;
    return Math.min(limit, this.height);
  }

  set index(i) {
    this.state.index = i;
  }
  get index() {
    return Math.max(0, this.state ? this.state.index : 0);
  }

  get enabled() {
    return this.filter(choice => this.isEnabled(choice));
  }

  get focused() {
    let choice = this.choices[this.index];
    if (this.state.submitted && this.options.multiple !== true) {
      choice.enabled = true;
    }
    return choice;
  }

  get selected() {
    return this.options.multiple ? this.enabled : this.focused;
  }
}

function toArray(choices) {
  let i = 0;
  const toChoices = (list, parent) => {
    if (Array.isArray(list)) {
      return list.map(ch => toChoice(ch, i++, parent));
    }
    let result = [];
    for (let name of Object.keys(list)) {
      if (typeof list[name] === 'string') {
        result.push(list);
        continue;
      }

      let ele = list[name];
      if (isObject(ele) && !hasChoices(ele)) {
        result.push(toChoice({ name, ...ele }, i++, parent));
        continue;
      }

      let group = toChoice(name, i++, parent);
      result.push(group);

      if (ele && typeof ele === 'object') {
        group.choices = toChoices(ele, group);
        group.choices.forEach(c => result.push(c));
      } else {
        group[name] = ele;
      }
    }
    return result;
  };
  return toChoices(choices);
}

function reset(prompt, choices) {
  for (let choice of choices) {
    if (choice.choices) {
      let items = choice.choices.filter(ch => !prompt.skipChoice(ch));
      choice.enabled = items.every(ch => ch.enabled === true);
    }
    if (prompt.skipChoice(choice) === true) {
      choice.enabled = false;
    }
  }
  return choices;
}

function hasChoices(obj) {
  let hasArray = false;
  let i = 0;
  for (let key of Object.keys(obj)) {
    i++;
    if (Array.isArray(obj[key])) {
      hasArray = true;
      break;
    }
    if (isObject(obj[key])) {
      hasArray = hasChoices(obj[key]);
      break;
    }
    hasArray = false;
  }
  return i === 1 && hasArray;
}

function toChoice(choice, i, parent) {
  if (typeof choice === 'string') choice = { name: choice, message: choice };
  choice.index = i;
  choice.parent = parent;
  choice.indent = parent ? parent.indent + '  ' : (choice.indent || '');
  return choice;
}

module.exports = ArrayPrompt;
