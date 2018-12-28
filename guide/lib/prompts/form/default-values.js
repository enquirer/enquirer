const { prompt } = require('enquirer');
const highlight = require('../../utils/highlight');

const response = prompt({
  type: 'form',
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      name: 'firstname',
      message: 'First Name',
      initial: 'Jon'
    },
    {
      name: 'lastname',
      message: 'Last Name',
      initial: 'Schlinkert'
    },
    {
      name: 'username',
      message: 'GitHub username',
      onChoice(state, choice) {
        let { firstname, lastname } = this.values;
        choice.initial = `${firstname}${lastname}`.toLowerCase();
      }
    }
  ]
});

response
  .then(answers => console.log(highlight(answers)))
  .catch(console.error);
