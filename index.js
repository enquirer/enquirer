'use strict';

const assert = require('assert');
const Events = require('events');
const utils = require('./lib/utils');

/**
 * Create an instance of `Enquirer`.
 *
 * @param {Object} `options` Options to use with all prompts.
 * @param {Object} `answers` Answers object to initialize with.
 * @api public
 */

class Enquirer extends Events {
  constructor(options, answers) {
    super();
    this.options = { ...options };
    this.answers = { ...answers };
  }

  /**
   * Register a custom prompt `type`.
   *
   * @param {String} `type`
   * @param {Function|Prompt} `fn` `Prompt` class, or a function that returns a `Prompt` class.
   * @return {Object} Returns the Enquirer instance
   * @api public
   */

  register(type, fn) {
    if (this.utils.isObject(type)) {
      for (let key of Object.keys(type)) this.register(key, type[key]);
      return this;
    }
    assert.equal(typeof fn, 'function', 'expected a function');
    let t = type.toLowerCase();
    if (fn.prototype instanceof this.Prompt) {
      this.prompts[t] = fn;
    } else {
      this.prompts[t] = fn(this.Prompt, this);
    }
    return this;
  }

  submit(value, state) {
    this.emit('submit', value, state);
    this.emit('answer', state.prompt.name, value, state);
  }

  cancel(error, state) {
    this.cancelled = true;
    this.emit('cancel', error, state);
  }

  async prompt(questions = []) {
    let cancel = false;

    for (let question of [].concat(questions)) {
      let opts = { ...this.options, ...question };
      let { type, name } = question;

      if (typeof type === 'function') type = await type.call(this, question);
      if (!type) continue;

      assert(this.prompts[type], `Prompt "${type}" is not registered`);

      let prompt = new this.prompts[type](question);
      let state = this.state(prompt, opts);
      let onCancel = opts.onCancel || (() => false);
      let value;

      this.emit('prompt', prompt, this.answers);

      if (opts.skip && await opts.skip(state)) {
        continue;
      }

      prompt.once('run', value => this.emit('run', value, state));
      prompt.once('submit', value => this.submit(value, state));
      prompt.once('cancel', error => this.cancel(error, state));
      prompt.on('keypress', value => this.emit('keypress', value, state));
      prompt.on('state', value => this.emit('state', value, state));

      try {
        value = this.answers[name] = await prompt.run();
        cancel = opts.onSubmit && await opts.onSubmit(value, state);
      } catch (err) {
        cancel = !(await onCancel(value, state));
      }

      if (cancel) {
        return this.answers;
      }
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

  get Prompt() {
    return this.constructor.Prompt;
  }

  get prompts() {
    return this.constructor.prompts;
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

  static prompt(questions) {
    let enquirer = new Enquirer();
    return enquirer.prompt(questions);
  }
}

utils.mixinEmitter(Enquirer, new Events());

for (let name of Object.keys(Enquirer.prompts)) {
  Reflect.defineProperty(Enquirer, name, { get: () => Enquirer.prompts[name] });
  // Enquirer[name.toLowerCase()] = options => new Enquirer.prompts[name](options);
}

module.exports = Enquirer;
