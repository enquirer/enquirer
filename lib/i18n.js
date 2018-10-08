'use strict';

const utils = require('./utils');
const argv = utils.parse(process.argv.slice(2));

class I18N {
  constructor(options = {}) {
    this.options = options;
    this.languages = new Map();
    this.languages.set('en', new Map());

    if (options.languages) {
      for (let key of Object.keys(options.languages)) {
        if (!this.languages.has(key)) this.languages.set(key, new Map());
        let language = this.language(key);
        let messages = options.languages[key];
        for (let key of Object.keys(messages)) {
          language.set(key, messages[key]);
        }
      }
    } else {
      this.set(options);
    }
  }

  language(lang = this.lang) {
    return this.languages.get(lang);
  }

  set(key, value, lang) {
    if (utils.isObject(key)) {
      for (let k of Object.keys(key)) this.set(k, key[k], value);
      return this;
    }

    let language = this.language(lang);
    language.set(key, value);
    return this;
  }

  get(key, lang) {
    let language = this.language(lang);
    return language.get(key);
  }

  has(key, lang) {
    let language = this.language(lang);
    return language.has(key);
  }

  get lang() {
    let lang = argv.lang || this.options.lang || 'en';
    if (!this.languages.has(lang)) {
      throw new Error(`language "${lang}" is not registered`);
    }
    return lang;
  }
}

module.exports = I18N;
