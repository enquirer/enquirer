const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/editable');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  promptLine: false,
  choices: [
    {
      name: 'author',
      role: 'heading',
      message: colors.underline.bold('Author information'),
      disabled: ' ',
      async indicator() {
        return prompt.style(await prompt.prefix());
      },
      choices: [
        {
          name: 'firstname',
          message: colors.italic('First Name'),
          initial: 'Jon',
          editable: true
        },
        {
          name: 'lastname',
          message: colors.italic('Last Name'),
          initial: 'Schlinkert',
          editable: true
        },
        {
          name: 'username',
          message: colors.italic('GitHub username'),
          // initial: 'jonschlinkert',
          editable: true
        },
        {
          name: 'email',
          message: colors.italic('Email address?'),
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
      disabled: '',
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
    console.log('author:', value.author)
    console.log('colors:', value.colors)
  })
  .catch(console.error);
