'use strict';

const assert = require('assert');
const Emitter = require('events');
const prompts = require('./prompts');
const ignores = ['suggest', 'format', 'validate', 'test'];

class Enquirer extends Emitter {
  constructor(options, answers) {
    super();
    this.options = { ...options };
    this.answers = { ...answers };
    this.prompts = prompts;
  }

  use(fn) {
    fn.call(this, this);
    return this;
  }

  register(type, Prompt) {
    this.prompts[type] = Prompt;
    return this;
  }

  async prompt(questions = [], options) {
    const answers = { ...this.answers };
    let prev;

    for (const question of [].concat(questions)) {
      if (question.skip && await question.skip(question, { ...answers })) {
        continue;
      }

      let { type, name } = question;
      let ignored = [];


      if (typeof type === 'function') {
        type = await type();
      }

      if (typeof type !== 'string') {
        continue;
      }

      assert(this.prompts[type], type + ' is not registered');
      const Prompt = this.prompts[type];
      const prompt = new Prompt(question);

      for (const key of Object.keys(question)) {
        if (isIgnored(key, Prompt.prototype)) {
          ignored.push(key);
          continue;
        }

        if (typeof question[key] === 'function') {
          question[key] = await question[key].call(prompt, prev, question, { ...answers });
        }
      }

      let answer = answers[name] = await prompt.run();

      for (const key of ignored) {
        await question[key].call(prompt, answer, question, { ...answers });
      }

      prev = answer;
    }
    return answers;
  }
}

function isIgnored(key, proto) {
  return (key in proto) || ignores.includes(key) || /^on[A-Z]/.test(key);
}

const enquirer = new Enquirer();
const questions = require('./questions');

enquirer.register('snippet', require('./recipes/snippet'));

enquirer.prompt(questions)
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
