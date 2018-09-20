'use strict';

const visit = require('collection-visit');
const toggle = require('toggle-array');
const Choice = require('./choice');
const utils = require('./utils');
const { first } = utils;

/**
 * Create a new `Choices` collection.
 *
 * ```js
 * let choices = new Choices(['foo', 'bar', 'baz']);
 * let choices = new Choices([{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]);
 * ```
 * @param {Array} `choices` One or more `choice` strings or objects.
 * @api public
 */

class Choices {
  constructor(prompt) {
    this.prompt = prompt;
    this.options = prompt.options;
    this.choices = prompt.choices;
    this.state = prompt.state;
  }

  render(options) {
    return this.choices.map(choice => this.renderChoice(choice, options)).join('\n');
  }

  renderChoice(choice, options) {
    return choice.render(this.index, options);
  }

  toChoice(choice, choices = []) {
    if (typeof choice === 'string') {
      choice = { name: choice, message: choice, value: choice };
    }

    let i = choices.length;

    choice.index = i;
    choice.number = i + 1;
    choice.name = utils.first(choice.name, choice.key, choice.value, choice.message);
    choice.message = utils.first(choice.message, choice.title, choice.name, choice.value);
    choice.value = utils.first(choice.value, choice.name);
    choice.typed = '';

    if (typeof choice.disabled === 'string') {
      choice.hint = choice.disabled;
      choice.disabled = true;
    }

    if (choice.disabled === true && !choice.hint) {
      choice.disabled = '(disabled)';
    }

    let prompt = this.prompt;
    if (typeof choice.enabled !== 'boolean') {
      let value = first(prompt.value, prompt.initial);
      choice.enabled = value !== void 0 && (value === choice.name || value === i);
    }

    choice.indent = choice.parent ? choice.parent.indent + '  ' : (choice.indent || '');
    prompt.longest = Math.max(prompt.longest, choice.message.length);
    prompt.aliases.push(choice.alias || '');
    return choice;
  }

  choice(value, parent) {
    let choice = new Choice(value, this);
    define(choice, 'parent', parent);
    define(choice, 'prompt', this);
    return choice;
  }

  /**
   * Create a choices separator.
   *
   * ```js
   * choices.separator();
   * ```
   * @param {String} `separator` Optionally pass a string to use as the separator.
   * @return {Object} Returns a separator object.
   * @api public
   */

  separator(separator = '────────') {
    return this.choice({ type: 'separator', name: separator });
  }

  /**
   * Toggle the choice at the given `idx`.
   *
   * ```js
   * choices.toggle(1);
   * // radio mode
   * choices.toggle(1, true);
   * ```
   * @param {Number} `idx` The index of the choice to toggle.
   * @api public
   */

  toggle(val, radio) {
    if (typeof val === 'undefined') {
      val = this.keys;
    }

    if (Array.isArray(val)) {
      visit(this, 'toggle', val, radio);
      return this;
    }

    let choice = this.get(val);
    if (!choice) {
      return this;
    }

    if (radio) {
      toggle(this.choices, 'checked', this.getIndex(choice));
    } else {
      choice.toggle();
    }

    if (choice.type === 'group') {
      choice.checked = this.isChecked(choice.keys);
    }
    if (choice.type === 'option') {
      choice.group.checked = this.isChecked(choice.group.keys);
    }

    return this;
  }

  /**
   * Swap two choices in the choices array.
   *
   * @param {String|Number|Function} `choice_a`
   * @param {String|Number|Function} `choice_b`
   * @return {Object} Returns the new array of choices.
   * @api public
   */

  swap(a, b) {
    let choices = this.choices.slice();
    choices[this.findIndex(a)] = b;
    choices[this.findIndex(b)] = a;
    return choices;
  }

  find(value, prop) {
    const find = () => {
      switch (typeOf(value)) {
        case 'function':
          return this.choices.find(value.bind(this));
        case 'string':
          return this.choices.find(ch => [ch.name, ch.value].includes(value));
        case 'regex':
          return this.choices.find(ch => value.test(ch.name) || value.test(ch.value));
        case 'number':
          return this.choices[value];
        default: {
          throw new TypeError(`.find does not support ${typeOf(value)}s`);
        }
      }
    };

    let choice = find();
    if (choice) {
      return prop ? choice[prop] : choice;
    }
  }

  findIndex(value) {
    return this.choices.indexOf(this.find(value));
  }

  get checked() {
    return this.filter(choice => choice.checked === true);
  }

  get enabled() {
    return this.filter(choice => choice.enabled === true);
  }

  get focused() {
    return this.choices[this.state.index];
  }

  get length() {
    return this.choices.length;
  }

  get index() {
    return this.state.index;
  }
}

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof RegExp) return 'regexp';
  return typeof val;
}

function define(obj, key, value) {
  Reflect.defineProperty(obj, key, { value });
}

module.exports = Choices;
