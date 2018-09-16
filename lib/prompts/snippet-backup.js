'use strict';

const first = (...args) => args.find(v => v != null && v !== '');
const colors = require('ansi-colors');
const StringPrompt = require('../types/string');
const { ansi, set, get } = require('../utils');

class SnippetPrompt extends StringPrompt {
  constructor(options = {}) {
    super(options);
    this.regex = options.regex || /{{([^} ]+)([^}]*)}}/g;
    this.initial = options.initial || 0;
    this.values = options.values || options.defaults || {};
    this.original = { ...this.values };
    this.typed = '';
    this.cursor = 0;
  }

  async init() {
    await super.init();

    if (typeof this.options.template === 'function') {
      this.options.template = await this.options.template();
      this.template = this.constructor.prototype.template.bind(this);
    }

    this.variables = [];
    this.lineMap = [];
    this.tmpl = this.options.template || '';
    this.tmpl.replace(this.regex, (m, param, fallback) => {
      if (fallback && this.values[param] === void 0) {
        let raw = fallback.trim();
        let val = raw.replace(/^['"`](.*?)['"`]$/g, '$1');
        if (raw === val && get(this.values, val) !== void 0) {
          set(this.values, param, this.values[val]);
        }
        if (raw !== val) {
          set(this.values, param, val);
        }
      }
      this.variables.push(param);
    });

    let lines = this.tmpl.split('\n');

    for (let i = 0; i < lines.length; i++) {
      this.lineMap.push(matchNames(this.regex, lines[i]));
    }

    let required = [].concat(this.options.required || []);
    if (this.options.required === true) {
      required = this.variables;
    }

    this.required = new Set(required);
    this.missing = new Set(required);

    if (typeof this.initial === 'string') {
      this.initial = Math.max(this.variables.indexOf(this.initial), 0);
    }

    this.index = this.initial || 0;
    this.typed = '';
  }

  updateValues() {
    let key = this._key;
    if (key && this.typed) set(this.values, key, this.typed);
    if (key && !this.typed && this.required.has(key)) {
      this.missing.add(key);
    }
  }

  dispatch(ch, key) {
    super.dispatch(ch, key);
    this.updateValues();
    this.render();
  }

  delete() {
    super.delete(false);
    this.updateValues();
    set(this.values, this._key, this.typed);
    this.render();
  }

  reset() {
    this.tmpl = this.options.template;
    this.values = { ...this.original };
    this.missing = this.required;
    this.cursor = 0;
    this.typed = '';
    this.render();
  }

  up() {
    this.prev();
  }
  down() {
    this.next();
  }

  first() {
    while (this.index > 0) {
      this.up();
    }
  }

  last() {
    while (this.index < this.variables.length - 1) {
      this.down();
    }
  }

  next() {
    this.updateValues();
    this.typed = '';
    this.index++;
    if (this.index > this.variables.length - 1) {
      this.index = 0;
    }
    this.render();
  }

  prev() {
    this.updateValues();
    this.typed = '';
    this.index--;
    if (this.index < 0) {
      this.index = this.variables.length - 1;
    }
    this.render();
  }

  template(submitted = this.submitted) {
    let { typed, error = {} } = this;
    let index = 0;

    if (this.missing.size === 0) {
      error = this.error = {};
    }

    let str = this.options.template.replace(this.regex, (m, param, fallback) => {
      index++;

      let existing = get(this.values, param);
      if (this.answered && this.missing.size === 0) {
        return existing ? this.colors.success(existing) : this.colors.info(m);
      }

      if (!typed && (existing == null || existing === '')) {
        set(this.values, param, (existing = void 0));
      }

      let value = get(this.values, fallback.trim()) || existing;
      let val = first(typed, value, m);

      if (value && error.invalid !== param) {
        this.missing.delete(param);
      } else if (this.required.has(param)) {
        this.missing.add(param);
      }

      if (this.index === index - 1) {
        this._key = param;
        if (submitted && val === m && this.missing.has(param)) {
          val = this.colors.danger(val);
        }
        // if (value && !this.typed) {
        //   this.typed = value;
        //   this.cursor = this.typed.length;
        // }
        return this.colors.selected(val);
      }

      // set(this.values, param, value);
      if (value) {
        return this.colors.hint(value);
      }
      if (this.missing.has(param) && submitted) {
        return this.colors.danger(m);
      }
      return this.colors.info(m);
    });

    let lines = str.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let variables = this.lineMap[i].filter(v => this.missing.has(v));
      let line = ' ' + lines[i];
      let prefix = variables.length ? this.colors.danger(this.symbols.bullet) : '';
      lines[i] = prefix + (prefix ? line.slice(1) : line);
    }

    this.tmpl = lines.join('\n');
    return this.tmpl;
  }

  renderFooter(submitted = this.submitted) {
    if (!this.answered && submitted && this.error) {
      if (this.error.invalid) this.missing.add(this.error.invalid);
      return '\n' + this.colors.danger(this.error.message);
    }
    if (!this.answered && submitted && this.missing.size > 0) {
      return '\n' + this.colors.danger('Please fill in all required fields.');
    }
    return '\n';
  }

  renderHelp(help = '') {
    let hint = help || this.hint;
    if (!this.answered && hint) {
      return typeof hint === 'function' ? hint.call(this) : hint;
    }
    return '';
  }

  render(help) {
    this.clear();
    let template = this.template();
    let typed = !this.answered && this.typed ? this.colors.active(this.typed) : '';

    this.write(this.renderHeader());
    this.write(this.renderMessage(typed + '\n' + template, this.renderHelp(help)));
    this.write(this.renderFooter());
    this.write(ansi.cursor.move(-(this.raw.length) + this.cursor * this.width));
    this.submitted = false;
  }

  async submit(...args) {
    this.submitted = true;
    let tmpl = this.options.template;
    let value = { ...this.values };
    value.result = tmpl.replace(this.regex, (m, param) => get(value, param, m));
    if (this.missing.size > 0) {
      this.render();
      this.alert();
      return;
    }
    this.value = value;
    return super.submit(...args);
  }

  get width() {
    return this.output.columns || 80;
  }

  get raw() {
    return colors.unstyle(this.typed);
  }
}

function matchNames(regex, str) {
  let matches = [];
  str.replace(regex, (m, param) => matches.push(param));
  return matches;
}

module.exports = SnippetPrompt;
