'use strict';

const colors = require('ansi-colors');
const placeholder = require('../placeholder');
const utils = require('../utils');
const Select = require('./select');
const Form = require('./form');
const form = Form.prototype;

class Editable extends Select {
  constructor(options) {
    super({ ...options, multiple: true });
    this.values = {};
  }

  dispatch(char, key) {
    return form.dispatch.call(this, char, key);
  }
  append(char, key) {
    return form.append.call(this, char, key);
  }
  delete(char, key) {
    return form.delete.call(this, char, key);
  }

  space(char) {
    if (this.focused.editable) {
      return this.append(char);
    }
    return super.space();
  }

  next() {
    if (this.focused.editable) {
      return form.next.call(this);
    }
    return super.next();
  }

  prev() {
    if (this.focused.editable) {
      return form.prev.call(this);
    }
    return super.prev();
  }

  async renderChoice(choice, i) {
    this.longest = choice.length;
    if (choice.editable) {
      return form.renderChoice.call(this, choice, i);
    }
    return super.renderChoice(choice, i);
  }

  submit() {
    this.value = {};
    for (let choice of this.choices) {
      if (choice.editable) {
        this.value[choice.name] = choice.value === choice.name
          ? (choice.initial || '')
          : choice.value;

      } else {
        this.value[choice.name] = choice.enabled === true;
      }
    }
    return this.base.submit.call(this);
  }
}

module.exports = Editable;
