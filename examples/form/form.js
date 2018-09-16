const Store = require('data-store');
const Prompt = require('../../lib/prompts/form');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  history: {
    store: new Store({ path:  __dirname + '/form-store.json' })
  },
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
      name: 'email',
      message: 'Email',
      initial: 'jon.schlinkert@sellside.com',
      validate(value = '') {
        return value.includes('@sellside.com');
      }
    }
  ]
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
