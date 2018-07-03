const util = require('util');
const Prompt = require('../prompts/form.js');

const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information',
  history: {
    path: __dirname + '/form-store.json'
  },
  choices: [
    {
      name: 'firstname',
      message: 'First Name:',
      hint: 'Jon',
    },
    {
      name: 'lastname',
      message: 'Last Name:',
      hint: 'Schlinkert',
    },
    {
      name: 'username',
      message: 'GitHub username:',
      hint: 'jonschlinkert',
    },
    {
      name: 'email',
      message: 'Email:',
      hint: 'jon.schlinkert@sellside.com',
      validate(...args) {
        return true;
      }
    }
  ]
});

prompt.run()
  .then(console.log)
  .catch(console.error);
