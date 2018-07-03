// 'use strict';

// const Emitter = require('events');
// let { prompts } = require('./');

const ignores = ['suggest', 'format', 'validate', 'test'];
function isIgnored(key, proto) {
  return (key in proto) || ignores.includes(key) || /^on[A-Z]/.test(key);
}

// module.exports = (types = prompts) => {
//   return async(questions = [], options = {}, answers = {}) => {
//     const ignored = [];

//     for (const question of [].concat(questions)) {
//       if (question.skip && await question.skip(question, { ...answers })) {
//         continue;
//       }

//       const Prompt = types[question.type];
//       const prompt = new Prompt();

//       for (const key of Object.keys(question)) {
//         if (isIgnored(key, Prompt.prototype)) {
//           ignored.push(key);
//           continue;
//         }

//         if (typeof question[key] === 'function') {
//           question[ket] = await question[key].call(prompt, question, { ...answers });
//         }
//       }

//       answers[question.name] = await prompt.run();

//       for (const key of ignored) {
//         await question[key].call(prompt, question, answers);
//       }
//     }
//     return answers;
//   };
// };

// module.exports = async(questions, options) => {
//   const answers = {};
//   for (const question of [].concat(questions)) {
//     const opts = { ...options, ...question };
//     const Prompt = prompts[opts.type];
//     const prompt = new Prompt(opts);
//     const answer = await prompt.run();
//     answers[prompt.name] = answer;
//   }
//   return answers;
// };

'use strict';

const Emitter = require('events');
let prompts = require('./prompts');

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
    const ignored = [];

    for (const question of [].concat(questions)) {
      if (question.skip && await question.skip(question, { ...answers })) {
        continue;
      }

      const Prompt = this.prompts[question.type];
      const prompt = new Prompt(question);

      for (const key of Object.keys(question)) {
        if (isIgnored(key, Prompt.prototype)) {
          ignored.push(key);
          continue;
        }

        if (typeof question[key] === 'function') {
          question[key] = await question[key].call(prompt, question, { ...answers });
        }
      }

      answers[question.name] = await prompt.run();

      for (const key of ignored) {
        await question[key].call(prompt, question, answers);
      }
    }
    return answers;
  }
}

const enquirer = new Enquirer();
const questions = require('./questions');

enquirer.prompt(questions)
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
