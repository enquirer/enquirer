'use strict';

const first = (...args) => args.find(v => v != null && v !== '');
const colors = require('ansi-colors');
const StringPrompt = require('../types/string');
const { ansi, set, get, resolveValue, trim } = require('../utils');

const replace = async(str, regex, fn) => {
  let pending = [];
  str.replace(regex, (...args) => pending.push(fn(...args)));
  let values = await Promise.all(pending);
  return str.replace(regex, () => values.shift());
};

class SnippetPrompt extends StringPrompt {
  constructor(options = {}) {
    super(options);
    let values = options.values || options.defaults || {};
    this.defaults = { ...values };
    this.values = { ...values };
    this.regex = options.regex || /{{([^} ]+)([^}]*)}}/g;
    this.index = this.initial = options.initial || 0;
    this.typed = '';
    this.cursor = 0;
  }

  async init() {
    await super.init();
    this.variables = [];
    this.errors = new Map();
    this.unresolved = new Set();
    this.missing = new Set();
    this.invalid = new Set();
    this.template = await resolveValue(this, this.template || '');
    await this.interpolate();

    if (typeof this.initial === 'string') {
      let index = this.variables.indexOf(this.initial);
      this.index = this.initial = Math.max(index, 0);
    }
  }

  split() {
    let lines = this.template.split(/\r*\n/);
    // console.log([this.terminal])
    // let rows = this.height;
    // let limit = rows;
    // if (this.options.limit) {

    // }
    return lines.slice(0, this.options.limit || 20);
    // let limit = this.options.limit || lines.length;
    // let rows = this.height || lines.length;
    // let end = Math.min(Math.max(limit, rows), rows);
    // return lines.slice(0, end);
  }

  async interpolate() {
    let lines = this.split();
    let linesInvalid = new Map();
    let linesMissing = [];
    let lineMap = [];
    let index = 0;

    for (let i = 0; i < lines.length; i++) {
      let matches = new Set();
      let lineIndices = {};
      let lineValues = {};
      let line = lines[i];

      lines[i] = await replace(line, this.regex, async(match, key, key2, input) => {
      // lines[i] = ' ' + line.replace(this.regex, (match, key, key2) => {
        let selected = this.index === index;
        key2 = trim(key2);
        key = trim(key);
        matches.add(key);

        lineMap[index] = { line, indices: lineIndices, values: lineValues };
        index++;

        let fillin =  get(this.values, key2);
        let value = get(this.values, key) || fillin;
        let val = first(this.typed, value, match);

        if (!this.hasRendered) {
          this.unresolved.add(key);
          this.variables.push(key);
        }

        if (value) {
          this.unresolved.delete(key);
          this.missing.delete(key);
          lineIndices[index] = value;
          lineValues[key] = value;
        } else {
          if (this.required.has(key)) {
            this.missing.add(key);
            linesMissing.push(i);
          }
        }

        if (this.submitted && typeof this.isValid === 'function') {
          let error = await this.isValid(key, colors.unstyle(value));
          if (error === false) error = '(invalid)';
          if (typeof error === 'string') {
            this.errors.set(key, error);
            linesInvalid.set(i, error.trim());
          } else {
            this.errors.delete(key);
          }
        }

        let isError = this.submitted && this.errors.has(key);
        let isMissing = this.submitted && this.missing.has(key) && !this.errors.size;

        if (!this.answered && selected) {
          this.key = key;
          if (isError || isMissing) {
            return this.colors.danger.underline(val);
          }
          return this.colors.selected(val);
        }

        if (isError) {
          return this.colors.danger(value);
        }

        if (!value && isMissing) {
          return this.colors.danger(match);
        }

        if (this.answered || value) {
          return this.colors.hint(value);
        }

        return this.colors.active(match);
      });
    }

    if (!this.submitted) {
      return lines.join('\n');
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let invalid = linesInvalid.get(i);

      if ((!this.errors.size && linesMissing.includes(i)) || invalid) {
        lines[i] = this.colors.danger(this.symbols.bullet) + line.slice(1);
      }
    }

    return lines.join('\n') + '\n';
  }

  updateValues() {
    if (!this.key) return;
    if (this.typed) {
      set(this.values, this.key, this.typed);
      this.missing.delete(this.key);
      return;
    }
    if (this.required.has(this.key)) {
      this.missing.add(this.key);
    }
  }

  dispatch(ch, key) {
    super.dispatch(ch, key);
    this.updateValues();
    return this.render();
  }

  async delete() {
    await super.delete(false);
    this.updateValues();
    set(this.values, this.key, this.typed);
    return this.render();
  }

  reset() {
    this.values = { ...this.defaults };
    this.missing = this.required;
    this.index = this.cursor = 0;
    this.typed = '';
    return this.render();
  }

  next() {
    this.updateValues();
    this.typed = '';
    this.index = this.index >= this.variables.length ? 0 : this.index + 1;
    return this.render();
  }
  prev() {
    this.updateValues();
    this.typed = '';
    this.index = this.index <= 0 ? this.variables.length : this.index - 1;
    return this.render();
  }

  up() {
    return this.prev();
  }
  down() {
    return this.next();
  }

  first() {
    this.typed = '';
    this.index = 0;
    return this.render();
  }
  last() {
    this.typed = '';
    this.index = this.variables.length;
    return this.render();
  }

  renderFooter() {
    if (this.answered || !this.submitted) return;
    if (typeof this.error === 'string') {
      return this.colors.danger(this.error);
    }
    if (this.errors.size > 0) {
      let errors = [];
      for (let [, error] of this.errors) errors.push(error);
      return errors.join('\n');
    }
    if (this.missing.size > 0) {
      return this.colors.danger('Please fill in all required fields.');
    }
    return '';
  }

  renderHelp(help = '') {
    let hint = help || this.hint;
    if (!this.answered && hint) {
      return typeof hint === 'function' ? hint.call(this) : hint;
    }
    return '';
  }

  async render(help) {
    let typed = !this.answered && this.typed ? this.colors.active(this.typed) : '';
    let snippet = await this.interpolate();
    this.clear();
    this.write(this.renderHeader());
    this.write(this.renderMessage(typed));
    this.write(this.renderHelp(help));
    this.write(`\n${snippet}`);
    this.write(this.renderFooter());
    this.write(ansi.cursor.move(-(this.raw.length) + this.cursor * this.width));
    this.submitted = false;
  }

  async submit() {
    let { regex, template, errors, missing, values } = this;
    this.submitted = true;
    await this.interpolate();

    if (errors.size || missing.size) {
      await this.render();
      return this.alert();
    }

    let contents = template.replace(regex, (m, key) => get(values, key));

    this.value = {
      contents: Buffer.from(contents),
      keys: [...new Set(this.variables)],
      unresolved: this.unresolved,
      errors,
      missing,
      values
    };

    return super.submit();
  }

  async check(values = {}) {
    if (this.isValid) {
      for (let key of Object.keys(values)) {
        let valid = await this.isValid(key, values[key]);
        if (valid !== true) {
          this.error = typeof valid === 'string' ? valid : `${key} is invalid`;
          break;
        }
      }
      await this.render();
      this.alert();
      this.error = void 0;
      return;
    }

    if (this.missing.size > 0 || this.invalid.size > 0) {
      await this.render();
      return this.alert();
    }
  }

  set required(value) {
    this._required = value;
  }
  get required() {
    let required = this._required || this.options.required || [];
    if (required === true) {
      required = Object.keys(this.values);
    }
    if (typeof required === 'string') {
      required = [required];
    }
    this._required = new Set(required);
    return this._required;
  }

  get raw() {
    return colors.unstyle(this.typed);
  }
}

module.exports = SnippetPrompt;
