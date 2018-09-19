'use strict';

const swap = require('arr-swap');
const visit = require('collection-visit');
const toggle = require('toggle-array');
const Choice = require('./choice');

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

  /**
   * Returns true if the given `choice` is a valid (selectable) choice item, and
   * not a "group" or "radio" choice.
   *
   * @param {String} `key` Property name to use for plucking objects.
   * @return {Array} Plucked objects
   * @api public
   */

  isSelectable(choice) {
    return (
      choice.type !== 'separator' &&
      choice.type !== 'group' &&
      choice.type !== 'radio' &&
      choice.name !== 'none' &&
      choice.name !== 'all'
    );
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

  /**
   * Getter for getting the checked choices from the collection.
   * @name .checked
   * @api public
   */

  get checked() {
    return this.choices.reduce((acc, choice) => {
      if (this.options.radio === true && !this.isSelectable(choice)) {
        return acc;
      }
      if (choice.checked === true) {
        acc.push(choice.value);
      }
      return acc;
    }, []);
  }

  get all() {
    return this.choices.filter(this.isSelectable).length === this.checked.length;
  }

  get none() {
    return this.checked.length === 0;
  }

  /**
   * Getter for getting the length of the collection.
   * @name .length
   * @api public
   */

  get length() {
    return this.choices.length;
  }

  get selected() {
    return this.choices.filter(item => item.enabled === true);
  }

  get active() {
    return this.choices[this.state.index];
  }

  get index() {
    return this.state.index;
  }
}

function clone(value) {
  switch (typeOf(value)) {
    case 'array':
      return value.map(clone);
    case 'object':
      let Ctor = obj.constructor;
      let obj = new Ctor();
      for (let key of Object.keys(value)) {
        obj[key] = clone(value[key]);
      }
      return obj;
    default: {
      return value;
    }
  }
}

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof RegExp) return 'regexp';
  return typeof val;
}

function isNumber(num) {
  if (typeof num === 'number') {
    return Number.isFinite(num);
  }
  if (typeof num === 'string') {
    return num.trim() !== '' && Number.isFinite(+num);
  }
  return false;
}

function define(obj, key, value) {
  Reflect.defineProperty(obj, key, { value });
}

module.exports = Choices;
