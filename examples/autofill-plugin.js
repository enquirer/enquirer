'use strict';

/**
 * Example "autofill" plugin - to achieve similar goal to autofill for web forms.
 *
 * _This isn't really needed in Enquirer, since the `autofill` option does
 * effectively the same thing natively_. This is just an example.
 */

const autofill = (answers = {}) => {
  return enquirer => {
    let prompt = enquirer.prompt.bind(enquirer);
    let context = { ...enquirer.answers, ...answers };

    enquirer.prompt = async questions => {
      let list = [].concat(questions || []);
      let choices = [];

      for (let item of list) {
        let value = context[item.name];
        if (value !== void 0) {
          choices.push({ name: item.name, value, hint: `(${value})` });
        }
      }

      if (choices.length) {
        let values = await enquirer.prompt({
          type: 'multiselect',
          name: 'autofill',
          message: 'Would you like to autofill prompts with the following values?',
          choices
        });

        for (let item of list) {
          if (values.autofill.includes(item.name)) {
            item.initial = context[item.name];
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

const Enquirer = require('..');
const enquirer = new Enquirer();

enquirer.use(autofill({ name: 'Jon Schlinkert', username: 'jonschlinkert' }));

const questions = [
  { type: 'input', name: 'name', message: 'What is your name?' },
  { type: 'input', name: 'username', message: 'What is your username?' },
  { type: 'input', name: 'email', message: 'What is your email?' },
  { type: 'input', name: 'phone', message: 'What is your phone number?' }
];

enquirer.prompt(questions)
  .then(answers => console.log(answers))
  .catch(console.error);
