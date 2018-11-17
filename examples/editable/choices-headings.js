const log = require('../log-keypress');
const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/editable');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  promptLine: false,
  align: false,
  header() {
    return 'Keypress: ' + log(prompt) + ' ';
  },
  choices: [
    {
      name: 'author',
      role: 'heading',
      message: colors.underline.bold('Author information'),
      indicator: colors.cyan('?'),
      choices: [
        {
          name: 'firstname',
          message: 'First Name',
          initial: 'Jon',
          editable: true
        },
        {
          name: 'lastname',
          message: 'Last Name',
          initial: 'Schlinkert',
          editable: true
        },
        {
          name: 'username',
          message: 'GitHub username',
          editable: true
        },
        {
          name: 'email',
          message: 'Email address?',
          editable: true
        }
      ]
    },
    {
      name: 'colors',
      role: 'heading',
      message: colors.underline.bold('Favorite colors?'),
      indicator: colors.cyan('\n?'),
      choices: [
        { name: 'green' },
        { name: 'blue' },
        { name: 'organge' },
        { name: 'purple' }
      ]
    }
  ]
});

prompt.run()
  .then(value => {
    console.log('author:', value.author);
    console.log('colors:', value.colors);
  })
  .catch(console.error);
