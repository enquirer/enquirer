'use strict';

const StringPrompt = require('../types/string');
const { flash, history } = require('../extras');

class TextPrompt extends StringPrompt {
  async init() {
    await super.init();
    this.flash = flash.bind(this, this);
    this.snippets = snippets(this.options);
    this.idx = 0;

    let opts = this.options.history;
    if (opts && opts.store) {
      this.store = opts.store;
    }

    if (this.store && !this.store.has('value')) {
      this.store.set('value', opts.state || { past: [], present: '' });
    }
  }

  complete(typed, history = []) {
    return typed ? history.find(item => item.indexOf(typed) === 0) : super.next();
  }

  async save() {
    if (!this.store) return this.alert();
    if (!this.typed) return !this.answered && this.alert();

    const flash = (msg, ms = 1500) => {
      return this.flash(msg, ms)
        .then(() => {
          this.typed = '';
          this.cursor = 0;
          this.render();
        });
    };

    let data = this.store.get('value');
    let typed = this.typed;

    if (data.present === typed || data.past.includes(typed)) {
      return flash(this.colors.danger('(value is already saved)'))
        .then(() => {
          this.typed = typed;
          this.cursor = typed.length;
          this.render();
        });
    }

    let state = history('save', data, typed);
    this.store.set('value', state);

    return flash(this.colors.success(this.symbols.check + ' saved'));
  }

  async remove() {
    if (!this.store) return this.alert();
    if (!this.typed) return;

    let state = history('remove', this.store.get('value'), this.typed);
    this.store.set('value', state);

    return this.flash(this.colors.danger(`${this.symbols.cross} removed`), 1500)
      .then(() => {
        this.typed = state.present;
        this.cursor = this.typed.length;
        this.render();
      });
  }

  async next() {
    if (!this.store && this.snippets.size) {
      return this.nextSnippet();
    }

    if (!this.store) return super.next();
    let data = this.store.get('value');
    let past = data.past.concat(this.typed);
    let value = await this.complete(this.typed, past);
    if (value) {
      this.typed = value;
      this.cursor = this.typed.length;
      this.render();
    }
  }

  async nextSnippet() {
    let keys = this.snippets.keys;
    if (!keys.includes(this.typed)) {
      this.typed = await this.complete(this.typed, keys);
      this.cursor = this.typed.length;
      return this.render();
    }
    let value = this.snippets.get(this.typed);
    if (value) {
      this.typed = value;
      this.cursor = value.length;
      return this.render();
    }
    return this.alert();
  }

  prev() {
    if (!this.snippets.size) return super.prev();
    if (this.snippets.idx <= 0) return this.alert();
    this.snippets.idx--;
    return this.next();
  }

  shiftUp() {
    if (!this.store) return this.alert();
    let data = this.store.get('value');
    if (data.past.length === 0) return this.alert();
    let state = history('undo', data, this.typed);
    this.typed = state.present;
    this.cursor = this.typed.length;
    this.store.set('value', state);
    this.render();
  }

  shiftDown() {
    if (!this.store) return this.alert();
    let data = this.store.get('value');

    if (!data.past.length && !data.present) {
      if (this.placeholder) return this.alert();
      this.typed = '';
      this.render();
      return;
    }

    let state = history('redo', data, this.typed);
    this.typed = state.present;
    this.cursor = this.typed.length;
    this.render();
  }

  async submit() {
    let v = this.value = !this.placeholder ? this.typed : this.initial;

    if (v && this.autosave && !this.placeholder) {
      let data = this.store.get('value');
      if (data.present === v || data.past.includes(v)) {
        return super.submit();
      }
      let state = history('save', data, v);
      this.store.set('value', state);
      return this.flash(this.colors.success(`${this.symbols.check} autosaved`), 750)
        .then(() => {
          this.render();
          return super.submit();
        });
    }

    return super.submit();
  }

  static get TextPrompt() {
    return TextPrompt;
  }
}

function snippets(options = {}) {
  let obj = { ...options.snippets };
  let keys = Object.keys(obj);
  return {
    set: (key, val) => (obj[key] = val),
    has: key => obj[key] != null,
    get: key => obj[key],
    keys,
    size: keys.length,
  };
}

module.exports = TextPrompt;
