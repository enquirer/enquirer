'use strict';

const assert = require('assert');
const Events = require('events');
const utils = require('./lib/utils');

/**
 * Create an instance of `Enquirer`.
 * ```js
 * const Enquirer = require('enquirer');
 * const enquirer = new Enquirer();
 * ```
 * @name Enquirer
 * @param {Object} `options` (optional) Options to use with all prompts.
 * @param {Object} `answers` (optional) Answers object to initialize with.
 * @api public
 */

class Enquirer extends Events {
  constructor(options, answers) {
    super();
    this.options = { ...options };
    this.answers = { ...answers };
  }

  /**
   * Register a custom prompt type.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   * enquirer.register('customType', require('./custom-prompt'));
   * ```
   * @name register
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
    let name = type.toLowerCase();
    if (fn.prototype instanceof this.Prompt) {
      this.prompts[name] = fn;
    } else {
      this.prompts[name] = fn(this.Prompt, this);
    }
    return this;
  }

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   *
   * (async() => {
   *   const response = await enquirer.prompt({
   *     type: 'input',
   *     name: 'username',
   *     message: 'What is your username?'
   *   });
   *   console.log(response);
   * })();
   * ```
   * @name prompt
   * @param {Array|Object} `questions` Options objects for one or more prompts to run.
   * @return {Promise} Promise that returns an "answers" object with the user's responses.
   * @api public
   */

  async prompt(questions = []) {
    let cancel = false;

    for (let question of [].concat(questions)) {
      let opts = { ...this.options, ...question };

      for (let key of Object.keys(opts)) {
        let val = opts[key];
        if (typeof val === 'function') {
          opts[key] = (...args) => {
            args.push(this.answers);
            return val(...args);
          };
        }
      }

      let { type } = question;

      if (typeof type === 'function') type = await type.call(this, question);
      if (!type) continue;

      assert(this.prompts[type], `Prompt "${type}" is not registered`);

      let prompt = new this.prompts[type](opts);
      let name = prompt.name;

      let state = this.state(prompt, opts);
      let onCancel = opts.onCancel || (() => false);
      let value = utils.get(this.answers, name);

      this.emit('prompt', prompt, this.answers);

      if (opts.autofill === true && value != null) {
        prompt.value = value;
        prompt.submit();
        opts.onSubmit && await opts.onSubmit(name, value, prompt);
        continue;
      }

      if (opts.skip && await opts.skip(state)) {
        continue;
      }

      prompt.state.answers = this.answers;

      // bubble events
      let emit = prompt.emit.bind(prompt);
      prompt.emit = (...args) => {
        this.emit(...args.concat(state));
        return emit(...args);
      };

      try {
        value = this.answers[name] = await prompt.run();
        cancel = opts.onSubmit && await opts.onSubmit(name, value, prompt);
      } catch (err) {
        cancel = !(await onCancel(name, value, prompt));
      }

      if (cancel) {
        return this.answers;
      }
    }

    return this.answers;
  }

  /**
   * Use an enquirer plugin.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   * const plugin = enquirer => {
   *   // do stuff to enquire instance
   * };
   * enquirer.use(plugin);
   * ```
   * @name use
   * @param {Function} `plugin` Plugin function that takes an instance of Enquirer.
   * @return {Object} Returns the Enquirer instance.
   * @api public
   */

  use(plugin) {
    plugin.call(this, this);
    return this;
  }

  /**
   * Programmatically cancel all prompts.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   *
   *
   *
   * enquirer.use(plugin);
   * ```
   * @name use
   * @param {Function} `plugin` Plugin function that takes an instance of Enquirer.
   * @return {Object} Returns the Enquirer instance.
   * @api public
   */

  submit(value, state) {
    this.submitted = true;
    this.emit('submit', value, state);
    this.emit('answer', state.prompt.name, value, state);
  }

  cancel(error, state) {
    this.cancelled = true;
    this.emit('cancel', error, state);
  }

  state(prompt, question) {
    let state = { prompt, question, answers: this.answers };
    this.emit('state', state);
    return state;
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

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * ```js
   * const { prompt } = require('enquirer');
   * (async() => {
   *   const response = await prompt({
   *     type: 'input',
   *     name: 'username',
   *     message: 'What is your username?'
   *   });
   *   console.log(response);
   * })();
   * ```
   * @name Enquirer#prompt
   * @param {Array|Object} `questions` Options objects for one or more prompts to run.
   * @return {Promise} Promise that returns an "answers" object with the user's responses.
   * @api public
   */

  static prompt(questions, onSubmit, onCancel) {
    let enquirer = new Enquirer({ onSubmit, onCancel });
    // let emit = enquirer.emit.bind(enquirer);
    // enquirer.emit = (...args) => {
    //   prompt.emit(...args);
    //   return emit(...args);
    // };
    return enquirer.prompt(questions);
  }
}

utils.mixinEmitter(Enquirer, new Events());
utils.mixinEmitter(Enquirer.prompt, new Events());
const prompts = Enquirer.prompts;

for (let name of Object.keys(prompts)) {
  let key = name.toLowerCase();

  let run = options => new prompts[name](options).run();
  Enquirer.prompt[key] = run;
  Enquirer[key] = run;

  if (!Enquirer[name]) {
    Reflect.defineProperty(Enquirer, name, { get: () => prompts[name] });
  }
}

module.exports = Enquirer;


// const { prompt } = Enquirer;

// // prompt.on('prompt', console.log);

// prompt.confirm({ message: 'Name?' })
