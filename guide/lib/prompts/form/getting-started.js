const { prompt } = require('enquirer');
const highlight = require('../../utils/highlight');

const response = prompt({
  type: 'form',
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      message: 'First Name',
      name: 'firstname'
    },
    {
      message: 'Last Name',
      name: 'lastname'
    },
    {
      message: 'GitHub username',
      name: 'username'
    }
  ]
});

response
  .then(answers => console.log(highlight(answers)))
  .catch(console.error);
