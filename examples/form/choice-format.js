'use strict';

const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  indicator() {
    return '';
  },
  choices: [
    {
      name: 'feature',
      message: 'Enable feature?',
      format(input, choice) {
        choice.input = '';
        choice.cursor = 0;
        let { success, dark } = this.styles;
        let check = () => choice.enabled ? success('✔') : dark('✔');
        if (input !== ' ') {
          this.alert();
          return check();
        }
        choice.enabled = !choice.enabled;
        return check();
      },
      result(value, choice) {
        return choice.enabled;
      }
    },
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
