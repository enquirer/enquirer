'use strict';

const { reorder, scrollUp, scrollDown, isObject, swap, set } = require('../utils');
const colors = require('ansi-colors');
const Prompt = require('../prompt');
const roles = require('../roles');

class ArrayPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.cursorHide();
    this.maxChoices = options.maxChoices || Infinity;
    this.multiple = options.multiple || false;
    this.initial = options.initial || 0;
    this.delay = options.delay || 0;
    this.longest = 0;
    this.num = '';
  }

  async initialize() {
    if (typeof this.options.initial === 'function') {
      this.initial = await this.options.initial.call(this);
    }
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
      await this.render();
    } else {
      if (autofocus != null) initial = autofocus;
      if (typeof initial === 'string') initial = this.findIndex(initial);
      if (typeof initial === 'number' && initial > -1) {
        this.index = Math.max(0, Math.min(initial, this.choices.length));
        this.enable(this.find(this.index));
      }
    }

    if (this.isDisabled(this.focused)) {
      await this.down();
    }
  }

  async toChoices(value, parent) {
    let choices = [];
    let index = 0;

    let toChoices = async(items, parent) => {
      if (typeof items === 'function') items = await items.call(this);
      if (items instanceof Promise) items = await items;

      for (let i = 0; i < items.length; i++) {
        let choice = items[i] = await this.toChoice(items[i], index++, parent);
        choices.push(choice);

        if (choice.choices) {
          await toChoices(choice.choices, choice);
        }
      }
      return choices;
    };

    return toChoices(value, parent);
  }

  async toChoice(ele, i, parent) {
    if (typeof ele === 'function') ele = await ele.call(this, this);
    if (ele instanceof Promise) ele = await ele;
    if (typeof ele === 'string') ele = { name: ele };

    if (ele.normalized) return ele;
    ele.normalized = true;

    let role = roles(ele.role, this.options);
    ele = role(this, ele);

    if (typeof ele.disabled === 'string') {
      ele.hint = ele.disabled;
      ele.disabled = true;
    }

    if (ele.disabled === true && ele.hint == null) {
      ele.hint = '(disabled)';
    }

    if (ele.index != null) return ele;
    ele.name = ele.name || ele.key || ele.title || ele.value || ele.message;
    ele.message = ele.message || ele.name || '';
    ele.value = ele.value || ele.name;

    ele.cursor = 0;
    ele.input = '';
    ele.index = i;

    ele.parent = parent;
    ele.level = parent ? parent.level + 1 : 1;
    ele.indent = parent ? parent.indent + '  ' : (ele.indent || '');
    ele.path = parent ? parent.path + '.' + ele.name : ele.name;
    ele.enabled = !!(this.multiple && !this.isDisabled(ele) && (ele.enabled || this.isSelected(ele)));

    if (typeof ele.initial === 'function') {
      ele.initial = await ele.initial.call(this, this.state, ele, i);
    }

    if (!this.isDisabled(ele)) {
      this.longest = Math.max(this.longest, colors.unstyle(ele.message).length);
    }

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

  async newItem() {
    let choices = this.choices.slice();
    choices.push({ name: 'New choice name?', editable: true, newChoice: true });
    this.choices = await this.toChoices(choices);
    this.index = this.choices.length - 1;
    this.limit = this.choices.length;
    return this.render();
  }

  indent(choice) {
    return choice.level > 1 ? '  '.repeat(choice.level - 1) : '';
  }

  dispatch(s, key) {
    if (this.multiple && this[key.name]) {
      return this[key.name]();
    }
    this.alert();
  }

  focus(choice, enabled) {
    if (typeof enabled !== 'boolean') enabled = choice.enabled;
    this.index = choice.index;
    choice.enabled = enabled && !this.isDisabled(choice);
    return choice;
  }

  space() {
    if (!this.multiple) return this.alert();
    this.toggle(this.focused);
    return this.render();
  }

  a() {
    let choices = this.choices.filter(ch => !this.isDisabled(ch));
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
      let choices = parent.choices.filter(ch => this.isDisabled(ch));
      parent.enabled = choices.every(ch => ch.enabled);
      parent = parent.parent;
    }

    reset(this, this.choices);
    return choice;
  }

  enable(choice) {
    choice.enabled = !this.isDisabled(choice);
    choice.choices && choice.choices.forEach(ch => this.enable(ch));
    return choice;
  }

  disable(choice) {
    choice.enabled = false;
    choice.choices && choice.choices.forEach(this.disable.bind(this));
    return choice;
  }

  number(n) {
    this.num += n;

    let number = num => {
      let i = Number(num);
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
    };

    clearTimeout(this.numberTimeout);

    return new Promise(resolve => {
      let len = this.choices.length;
      let num = this.num;

      let handle = (val = false, res) => {
        clearTimeout(this.numberTimeout);
        if (val) number(num);
        this.num = '';
        resolve(res);
      };

      if (num === '0' || (num.length === 1 && Number(num + '0') > len)) {
        return handle(true);
      }

      if (Number(num) > len) {
        return handle(false, this.alert());
      }

      this.numberTimeout = setTimeout(() => handle(true), this.delay);
    });
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
    let idx = this.index;
    if (this.options.scroll === false && idx === 0) {
      return this.alert();
    }
    if (len > vis && idx === 0) {
      return this.scrollUp();
    }
    this.index = ((idx - 1 % len) + len) % len;
    if (this.isDisabled()) {
      return this.up();
    }
    return this.render();
  }

  down() {
    let len = this.choices.length;
    let vis = this.visible.length;
    let idx = this.index;
    if (this.options.scroll === false && idx === vis - 1) {
      return this.alert();
    }
    if (len > vis && idx === vis - 1) {
      return this.scrollDown();
    }
    this.index = (idx + 1) % len;
    if (this.isDisabled()) {
      return this.down();
    }
    return this.render();
  }

  scrollUp(i = 0) {
    this.choices = scrollUp(this.choices);
    this.index = i;
    if (this.isDisabled()) {
      return this.up();
    }
    return this.render();
  }

  scrollDown(i = this.visible.length - 1) {
    this.choices = scrollDown(this.choices);
    this.index = i;
    if (this.isDisabled()) {
      return this.down();
    }
    return this.render();
  }

  async shiftUp() {
    if (this.options.sort === true) {
      this.sorting = true;
      this.swap(this.index - 1);
      await this.up();
      this.sorting = false;
      return;
    }
    return this.scrollUp(this.index);
  }

  async shiftDown() {
    if (this.options.sort === true) {
      this.sorting = true;
      this.swap(this.index + 1);
      await this.down();
      this.sorting = false;
      return;
    }
    return this.scrollDown(this.index);
  }

  pageUp() {
    if (this.visible.length <= 1) return this.alert();
    this.limit = Math.max(this.limit - 1, 0);
    this.index = Math.min(this.limit - 1, this.index);
    this._limit = this.limit;
    if (this.isDisabled()) {
      return this.up();
    }
    return this.render();
  }

  pageDown() {
    if (this.visible.length >= this.choices.length) return this.alert();
    this.index = Math.max(0, this.index);
    this.limit = Math.min(this.limit + 1, this.choices.length);
    this._limit = this.limit;
    if (this.isDisabled()) {
      return this.down();
    }
    return this.render();
  }

  swap(pos) {
    swap(this.choices, this.index, pos);
  }

  isDisabled(choice = this.focused) {
    let keys = ['disabled', 'collapsed', 'hidden', 'completing'];
    if (choice && keys.some(key => choice[key] === true)) {
      return true;
    }
    return choice && choice.role === 'heading';
  }

  isEnabled(choice = this.focused) {
    if (Array.isArray(choice)) return choice.every(ch => this.isEnabled(ch));
    if (choice.choices) {
      let choices = choice.choices.filter(ch => !this.isDisabled(ch));
      return choice.enabled && choices.every(ch => this.isEnabled(ch));
    }
    return choice.enabled && !this.isDisabled(choice);
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
    return [].concat(names || []).reduce((acc, name) => {
      acc[name] = this.find(name, prop);
      return acc;
    }, {});
  }

  async submit() {
    let choice = this.focused;
    if (choice.newChoice) {
      if (!choice.input) return this.alert();
      delete choice.newChoice;
      choice.name = choice.message = choice.input;
      choice.input = '';
      choice.cursor = 0;
      return this.render();
    }

    if (this.choices.some(ch => ch.newChoice)) {
      return this.alert();
    }

    if (this.options.reorder !== false && this.options.sort !== true) {
      this.choices = reorder(this.choices);
    }

    let multi = this.multiple === true;
    let value = this.selected;
    if (value === void 0) {
      return this.alert();
    }

    if (multi && this.choices.some(ch => ch.choices)) {
      this.value = {};
      for (let choice of value) set(this.value, choice.path, choice.value);
    } else if (multi) {
      this.value = value.map(ch => ch.name);
    } else {
      this.value = value.name;
    }

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

    if (!this._initial && this.options.initial) {
      this._initial = true;
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

  set value(value) {
    super.value = value;
  }
  get value() {
    if (typeof super.value !== 'string' && super.value === this.initial) {
      return this.input;
    }
    return super.value;
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
    if (this.state.submitted && this.multiple !== true) {
      choice.enabled = true;
    }
    return choice;
  }

  get selected() {
    return this.multiple ? this.enabled : this.focused;
  }
}

function reset(prompt, choices) {
  for (let choice of choices) {
    if (choice.choices) {
      let items = choice.choices.filter(ch => !prompt.isDisabled(ch));
      choice.enabled = items.every(ch => ch.enabled === true);
    }
    if (prompt.isDisabled(choice) === true) {
      choice.enabled = false;
    }
  }
  return choices;
}

module.exports = ArrayPrompt;
