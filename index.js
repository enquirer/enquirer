'use strict';

const assert = require('assert');
const Events = require('events');
const utils = require('./lib/utils');

class Enquirer extends Events {
  constructor(options, answers) {
    super();
    this.prompts = Enquirer.prompts;
    this.Prompt = Enquirer.Prompt;
    this.options = { ...options };
    this.answers = { ...answers };
  }

  register(name, fn) {
    if (this.utils.isObject(name)) {
      for (let key of Object.keys(name)) this.register(key, name[key]);
      return this;
    }

    assert.equal(typeof fn, 'function', 'expected a function');
    let type = name.toLowerCase();

    if (fn.prototype instanceof this.Prompt) {
      this.prompts[type] = fn;
    } else {
      this.prompts[type] = fn(this.Prompt, this);
    }
    return this;
  }

  async prompt(questions = []) {
    for (let question of [].concat(questions)) {
      let options = { ...this.options, ...question };
      let { type, name } = options;

      if (typeof type === 'function') type = await type.call(this, options);
      if (typeof type !== 'string') continue;

      assert(this.prompts[type], `Prompt "${type}" is not registered`);

      let Prompt = this.prompts[type];
      let prompt = new Prompt(options);
      let state = this.state(prompt, options);

      for (let key of Object.keys(options)) {
        let val = options[key];
        if (typeof val === 'function' && key.slice(0, 2) === 'on') {
          prompt.on(key.slice(2).toLowerCase(), val.bind(prompt));
        }
      }

      prompt.once('run', value => this.emit('run', value, prompt));
      prompt.once('submit', value => this.emit('submit', value, prompt));
      prompt.once('cancel', error => this.emit('cancel', error, prompt));
      prompt.on('keypress', value => this.emit('keypress', value, prompt));
      prompt.on('state', value => this.emit('state', value, prompt));
      this.emit('prompt', prompt);

      if (this.options.skip && await this.options.skip(state)) {
        continue;
      }

      let value = this.answers[name] = await prompt.run();
      this.emit('answer', value, prompt);
    }

    return this.answers;
  }

  state(prompt, question) {
    let state = { prompt, question, answers: { ...this.answers } };
    this.emit('state', state);
    return state;
  }

  use(plugin) {
    plugin.call(this, this);
    return this;
  }

  static get Prompt() {
    return require('./lib/prompt');
  }

  static get prompts() {
    return require('./lib/prompts');
  }

  static get types() {
    return require('./lib/types');
  }
}

utils.mixinEmitter(Enquirer, new Events());

for (let name of Object.keys(Enquirer.prompts)) {
  utils.define(Enquirer, name, Enquirer.prompts[name]);
}

module.exports = Enquirer;
