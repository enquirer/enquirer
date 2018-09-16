'use strict';

const assert = require('assert');
const Events = require('events');
const utils = require('./lib/utils');
const defer = ['suggest', 'format', 'validate', 'test'];

class Enquirer extends Events {
  constructor(options, answers) {
    super();
    this.options = { ...options };
    this.answers = { ...answers };
    this.defer = [].concat(this.options.defer || defer);
    this.Prompt = Enquirer.Prompt;
    this.prompts = Enquirer.prompts;
    this.utils = Enquirer.utils;
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

  async prompt(questions = [], options) {
    let state = this.state();
    let deferred;

    for (let question of [].concat(questions)) {
      question = state.question = { ...question };
      deferred = state.deferred = new Set();

      if (question.skip && await question.skip(state)) {
        continue;
      }

      let { type, name } = question;

      if (typeof type === 'function') {
        type = await type(this);
      }

      if (typeof type !== 'string') {
        continue;
      }

      assert(this.prompts[type], type + ' is not registered');

      let Prompt = this.prompts[type];
      let prompt = state.prompt = new Prompt(question);
      state = this.state(prompt, question);
      state.deferred = deferred;

      for (let key of Object.keys(question)) {
        if (this.isDeferred(key, Prompt.prototype)) {
          state.deferred.add(key);
          continue;
        }

        if (typeof question[key] === 'function') {
          question[key] = await question[key].call(prompt, state);
        }
      }

      let answer = this.answers[name] = await prompt.run();

      for (let key of state.deferred) {
        if (typeof question[key] === 'function') {
          await question[key].call(prompt, state);
        }
      }

      state.prev = answer;
    }

    return this.answers;
  }

  /**
   * Returns true if a custom function defined on a "question" should
   * not be called until after the prompt is run and the user submits
   * an answer.
   *
   * @param {String} `name` Option name.
   * @param {Object} `proto` Prompt.prototype
   * @return {Boolean}
   * @api public
   */

  isDeferred(name, proto) {
    return defer.includes(name) || /^on[A-Z]/.test(name) || name in proto;
  }

  state(prompt, question, answers = this.answers, prev = null) {
    let state = { enquirer: this, prompt, question, answers, prev };
    this.emit('state', state);
    return state;
  }

  use(fn) {
    fn.call(this, this);
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

  static get utils() {
    return require('./lib/utils');
  }
}

utils.mixinEmitter(Enquirer, new Events());

for (let name of Object.keys(Enquirer.prompts)) {
  utils.define(Enquirer, name, options => {
    let prompt = new Enquirer.prompts[name](options);
    utils.forwardEvents(prompt, Enquirer);
    return prompt.run();
  });
}

module.exports = Enquirer;
