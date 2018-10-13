'use strict';

const Enquirer = require('..');
const enquirer = new Enquirer();

/**
 * "autofill" plugin - to achieve similar goal to autofill for web forms
 */

const autofill = (answers = {}) => {
  return enquirer => {
    let prompt = enquirer.prompt.bind(enquirer);
    let context = { ...enquirer.answers, ...answers };

    enquirer.prompt = async questions => {
      let list = [].concat(questions || []);
      let choices = [];
      let filled = {};

      for (let item of list) {
        let value = context[item.name];
        if (value !== void 0) {
          choices.push({ name: item.name, value, hint: `(${value})` });
        }
      }

      enquirer.on('submit', (value, prompt) => (filled = prompt.values));

      if (choices.length) {
        let values = await enquirer.prompt({
          type: 'multiselect',
          name: 'autofilled',
          message: 'Would you like to autofill prompts with the following values?',
          choices
        });

        values.autofilled = filled;

        for (let item of list) {
          if (values.autofilled[item.name] !== void 0) {
            item.initial = values.autofilled[item.name];
          }
        }

        if (enquirer.cancelled) {
          return values;
        }
      }

      return prompt(list);
    };
  };
};

enquirer.use(autofill({ name: 'Jon Schlinkert', username: 'jonschlinkert' }));

const questions = [
  { type: 'input', name: 'name', message: 'What is your name?' },
  { type: 'input', name: 'username', message: 'What is your username?' },
  { type: 'input', name: 'email', message: 'What is your email?' },
  { type: 'input', name: 'phone', message: 'What is your phone number?' },
];

enquirer.prompt(questions)
  .then(answers => {
    console.log(answers);
  })
  .catch(console.error);
