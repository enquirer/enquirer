'use strict';

const colors = require('ansi-colors');
const actions = require('../actions/');
const Prompt = require('../prompt');
const roles = require('../roles');
const utils = require('../utils');
const { isObject, reorder, scrollUp, scrollDown, swap } = utils;

class ArrayPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.cursorHide();
    this.maxSelected = options.maxSelected || Infinity;
    this.multiple = options.multiple || false;
    this.initial = options.initial || 0;
    this.delay = options.delay || 0;
    this.longest = 0;
    this.num = '';

    for (let key of Object.keys(actions.array)) {
      this[key] = (...args) => {
        return actions.array[key](this, ...args);
      };
    }
  }

  async initialize() {
    if (typeof this.options.initial === 'function') {
      this.initial = await this.options.initial.call(this);
    }
    await this.reset(true);
    await super.initialize();
  }

  async reset() {
    let { choices, initial, autofocus, suggest } = this.options;
    this.state._choices = [];
    this.state.choices = [];

    this.choices = await Promise.all(await this.toChoices(choices));
    this.choices.forEach(ch => (ch.enabled = false));

    if (typeof suggest !== 'function' && this.selectable.length === 0) {
      throw new Error('At least one choice must be selectable');
    }

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
    this.state.loadingChoices = true;
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

    return toChoices(value, parent)
      .then(choices => {
        this.state.loadingChoices = false;
        return choices;
      });
  }

  async toChoice(ele, i, parent) {
    if (typeof ele === 'function') ele = await ele.call(this, this);
    if (ele instanceof Promise) ele = await ele;
    if (typeof ele === 'string') ele = { name: ele };

    if (ele.normalized) return ele;
    ele.normalized = true;

    let role = roles(ele.role, this.options);
    ele = role(this, ele);

    if (typeof ele.disabled === 'string' && !ele.hint) {
      ele.hint = ele.disabled;
      ele.disabled = true;
    }

    if (ele.disabled === true && ele.hint == null) {
      ele.hint = '(disabled)';
    }

    // if the choice was already normalized, return it
    if (ele.index != null) return ele;
    ele.name = ele.name || ele.key || ele.title || ele.value || ele.message;
    ele.message = ele.message || ele.name || '';
    ele.value = [ele.value, ele.name].find(this.isValue.bind(this));

    ele.input = '';
    ele.index = i;
    ele.cursor = 0;

    utils.define(ele, 'parent', parent);
    ele.level = parent ? parent.level + 1 : 1;
    if (ele.indent == null) {
      ele.indent = parent ? parent.indent + '  ' : (ele.indent || '');
    }

    ele.path = parent ? parent.path + '.' + ele.name : ele.name;
    ele.enabled = !!(this.multiple && !this.isDisabled(ele) && (ele.enabled || this.isSelected(ele)));

    if (!this.isDisabled(ele)) {
      this.longest = Math.max(this.longest, colors.unstyle(ele.message).length);
    }

    // shallow clone the choice first
    let choice = { ...ele };

    // then allow the choice to be reset using the "original" values
    ele.reset = (input = choice.input, value = choice.value) => {
      for (let key of Object.keys(choice)) ele[key] = choice[key];
      ele.input = input;
      ele.value = value;
    };

    if (typeof ele.initial === 'function') {
      ele.initial = await ele.initial.call(this, this.state, ele, i);
    }

    return ele;
  }

  async onChoice(choice, i) {
    if (this.index === i) {
      this.emit('choice', choice, i, this);
    }

    if (typeof choice.onChoice === 'function') {
      await choice.onChoice.call(this, this.state, choice, i);
    }
  }

  async addChoice(ele, i, parent) {
    let choice = await this.toChoice(ele, i, parent);
    this.choices.push(choice);
    this.index = this.choices.length - 1;
    this.limit = this.choices.length;
    return choice;
  }

  async newItem(item, i, parent) {
    let ele = { name: 'New choice name?', editable: true, newChoice: true, ...item };
    let choice = await this.addChoice(ele, i, parent);

    choice.updateChoice = () => {
      delete choice.newChoice;
      choice.name = choice.message = choice.input;
      choice.input = '';
      choice.cursor = 0;
    };

    return this.render();
  }

  indent(choice) {
    if (choice.indent == null) {
      return choice.level > 1 ? '  '.repeat(choice.level - 1) : '';
    }
    return choice.indent;
  }

  dispatch(s, key) {
    if (this.multiple && this[key.name]) return this[key.name]();
    this.alert();
  }

  isDisabled(choice = this.focused) {
    let keys = ['disabled', 'collapsed', 'hidden', 'completing', 'readonly'];
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

  map(names = [], prop = 'value') {
    return [].concat(names || []).reduce((acc, name) => {
      acc[name] = this.find(name, prop);
      return acc;
    }, {});
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

  async submit() {
    let choice = this.focused;
    if (!choice) return this.alert();

    if (choice.newChoice) {
      if (!choice.input) return this.alert();
      choice.updateChoice();
      return this.render();
    }

    if (this.choices.some(ch => ch.newChoice)) {
      return this.alert();
    }

    let { reorder, sort } = this.options;
    let multi = this.multiple === true;
    let selected = this.selected;

    if (selected === void 0) {
      return this.alert();
    }

    // re-sort choices to original order
    if (Array.isArray(selected) && reorder !== false && sort !== true) {
      selected = utils.reorder(selected);
    }

    this.value = multi ? selected.map(ch => ch.name) : selected.name;
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
    return utils.reset(this, this.state.choices || []);
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
    let { state, options, choices } = this;
    let size = state.limit || this._limit || options.limit || choices.length;
    let trim = val => val ? colors.unstyle(val).trim() : '';
    let sections = this.sections();
    let { header, prompt, after } = sections;
    let nonChoices = [...header.split('\n'), ...prompt.split('\n'), ...after.split('\n')];
    let diff = 0;
    if (nonChoices.length && trim(nonChoices[0]) === '') diff++;
    return Math.min(size, this.height - nonChoices.length + diff);
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
    return this.filter(this.isEnabled.bind(this));
  }

  get focused() {
    let choice = this.choices[this.index];
    if (choice && this.state.submitted && this.multiple !== true) {
      choice.enabled = true;
    }
    return choice;
  }

  get selectable() {
    return this.choices.filter(choice => !this.isDisabled(choice));
  }

  get selected() {
    return this.multiple ? this.enabled : this.focused;
  }
}

module.exports = ArrayPrompt;
