const Prompt = require('../../lib/prompts/form');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      name: 'firstname',
      message: 'First Name',
      initial: 'Jon',
      prefix() {
        return prompt.symbols.check
      }
    },
    {
      name: 'lastname',
      message: 'Last Name',
      initial: 'Schlinkert',
      prefix() {
        return prompt.symbols.check
      }
    },
    {
      name: 'username',
      message: 'GitHub username',
      initial: 'jonschlinkert',
      prefix() {
        return prompt.symbols.check
      }
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
