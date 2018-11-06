const Prompt = require('../../lib/prompts/editable');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      name: 'author',
      role: 'heading',
      choices: [
        {
          name: 'firstname',
          message: 'First Name',
          initial: 'Jon',
          editable: true,
          prefix() {
            return prompt.symbols.check;
          }
        },
        {
          name: 'lastname',
          message: 'Last Name',
          initial: 'Schlinkert',
          prefix() {
            return prompt.symbols.check;
          }
        },
        {
          name: 'username',
          message: 'GitHub username',
          initial: 'jonschlinkert',
          prefix() {
            return prompt.symbols.check;
          }
        },
        {
          name: 'email',
          message: 'Email address?',
          editable: true,
          prefix() {
            return prompt.symbols.check;
          }
        }
      ]
    }
  ]
});

prompt
  .run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
