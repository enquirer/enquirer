const Prompt = require('../../lib/prompts/form');
const prompt = new Prompt({
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
      initial: 'jonschlinkert'
    },
    {
      name: 'company',
      message: 'Company name?',
      initial: 'Sellside'
    },
    {
      name: 'email',
      message: 'Email',
      get initial() {
        let { company = '', username = '' } = prompt.values;
        return `${username}@${company.toLowerCase()}.com`;
      },
      validate(value = '') {
        return !value.includes('@gmail.com');
      }
    }
  ]
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
