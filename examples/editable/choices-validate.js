const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/editable');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  promptLine: false,
  align: false,
  choices: [
    {
      name: 'author',
      role: 'heading',
      message: colors.underline.bold('Author information'),
      async indicator() {
        return prompt.style(await prompt.prefix());
      },
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
          editable: true,
          validate(value) {
            if (value.includes('jon')) {
              this.error = 'Invalid email address';
              return false;
            }
            this.error = void 0;
            return true;
          }
        }
      ]
    },
    {
      name: 'colors',
      role: 'heading',
      message: colors.underline.bold('Favorite colors?'),
      async indicator() {
        return '\n' + prompt.style(await prompt.prefix());
      },
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
